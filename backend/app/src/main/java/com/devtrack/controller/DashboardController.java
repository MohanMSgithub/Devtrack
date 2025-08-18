package com.devtrack.controller;

import com.devtrack.dto.DashboardStatsDto;
import com.devtrack.dto.RecentActivityDto;
import com.devtrack.model.*;
import com.devtrack.repository.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final LogRepository logRepository;
    private final NoteRepository noteRepository;
    private final KanbanRepository kanbanRepository;
    private final UserRepository userRepository;

    public DashboardController(LogRepository logRepository, NoteRepository noteRepository,
                               KanbanRepository kanbanRepository, UserRepository userRepository) {
        this.logRepository = logRepository;
        this.noteRepository = noteRepository;
        this.kanbanRepository = kanbanRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName(); // comes from login
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));    }

    @GetMapping("/stats")
    public DashboardStatsDto getStats() {
        User user = getCurrentUser();

        // Logs this week
        LocalDate now = LocalDate.now();
        int currentWeek = now.get(WeekFields.ISO.weekOfYear());
        long logsThisWeek = logRepository.findByUser(user).stream()
                .filter(log -> {
                    try {
                        LocalDate logDate = log.getDate();
                        return logDate.get(WeekFields.ISO.weekOfYear()) == currentWeek;
                    } catch (Exception e) {
                        return false;
                    }
                }).count();

        // Notes count
        long notesCount = noteRepository.findByUser(user).size();

        // Kanban counts
        List<KanbanCard> cards = kanbanRepository.findByUser(user);
        long todo = cards.stream().filter(c -> "todo".equalsIgnoreCase(c.getColumn())).count();
        long inProgress = cards.stream().filter(c -> "inprogress".equalsIgnoreCase(c.getColumn())).count();
        long done = cards.stream().filter(c -> "done".equalsIgnoreCase(c.getColumn())).count();

        return new DashboardStatsDto(logsThisWeek, notesCount, todo, inProgress, done);
    }

    @GetMapping("/recent")
    public Map<String, List<RecentActivityDto>> getRecent() {
        User user = getCurrentUser();

        List<RecentActivityDto> logs = logRepository.findByUser(user).stream()
                .sorted(Comparator.comparing(DailyLog::getDate).reversed())
                .limit(5)
                .map(log -> new RecentActivityDto(
                        log.getId(),
                        "log",
                        "Daily Log",
                        log.getContent(),
                        log.getDate(),
                        null
                ))
                .collect(Collectors.toList());

        List<RecentActivityDto> notes = noteRepository.findByUser(user).stream()
                .sorted(Comparator.comparing(Note::getCreatedAt).reversed())
                .limit(5)
                .map(note -> new RecentActivityDto(
                        note.getId(),
                        "note",
                        note.getTitle(),
                        note.getContent(),
                        note.getCreatedAt(),
                        null
                ))
                .collect(Collectors.toList());

        List<RecentActivityDto> kanban = kanbanRepository.findByUser(user).stream()
                .sorted(Comparator.comparing(KanbanCard::getCreatedAt).reversed())
                .limit(5)
                .map(card -> new RecentActivityDto(
                        card.getId(),
                        "kanban",
                        card.getTitle(),
                        card.getDescription(),
                        card.getCreatedAt(),
                        card.getColumn()
                ))
                .collect(Collectors.toList());

        Map<String, List<RecentActivityDto>> response = new HashMap<>();
        response.put("logs", logs);
        response.put("notes", notes);
        response.put("kanban", kanban);

        return response;
    }
}
