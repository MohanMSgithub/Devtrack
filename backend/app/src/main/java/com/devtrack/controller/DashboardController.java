package com.devtrack.controller;

import com.devtrack.dto.DashboardSummaryDto;
import com.devtrack.dto.RecentActivityDto;
import com.devtrack.model.DailyLog;
import com.devtrack.model.KanbanCard;
import com.devtrack.model.Note;
import com.devtrack.model.User;
import com.devtrack.repository.LogRepository;
import com.devtrack.repository.NoteRepository;
import com.devtrack.repository.KanbanRepository;
import com.devtrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private LogRepository logRepository;

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private KanbanRepository kanbanRepository;

    @Autowired
    private UserRepository userRepository;

    // 1️⃣ Dashboard summary
    @GetMapping("/stats")
    public ResponseEntity<DashboardSummaryDto> getDashboardSummary(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        long totalLogs = logRepository.findByUser(user).size();
        long totalNotes = noteRepository.findByUser(user).size();

        long totalTasks = kanbanRepository.findByUser(user).size();
        long doneTasks = kanbanRepository.findByUser(user).stream()
                .filter(card -> "done".equalsIgnoreCase(card.getColumn()))
                .count();

        DashboardSummaryDto dto = new DashboardSummaryDto(
                totalLogs,
                totalNotes,
                totalTasks,
                doneTasks
        );

        return ResponseEntity.ok(dto);
    }

    // 2️⃣ Recent activity
    @GetMapping("/recent")
    public ResponseEntity<List<RecentActivityDto>> getRecentActivity(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);


        // Recent logs
        List<RecentActivityDto> logs = logRepository.findByUser(user).stream()
                .map(log -> new RecentActivityDto("Log", LocalDateTime.parse(log.getDate())))
                .collect(Collectors.toList());

// Recent notes
        List<RecentActivityDto> notes = noteRepository.findByUser(user).stream()
                .map(note -> new RecentActivityDto("Note", note.getCreatedAt()))
                .collect(Collectors.toList());

// Recent tasks
        List<RecentActivityDto> tasks = kanbanRepository.findByUser(user).stream()
                .map(task -> new RecentActivityDto("Task", task.getCreatedAt()))
                .collect(Collectors.toList());


        // Combine & sort by date desc
        List<RecentActivityDto> allActivities = logs;
        allActivities.addAll(notes);
        allActivities.addAll(tasks);

        allActivities.sort((a, b) -> b.getDate().compareTo(a.getDate()));

        return ResponseEntity.ok(allActivities);
    }

    // Helper: get logged-in user
    private User getAuthenticatedUser(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(
            @RequestParam String query,
            Authentication authentication
    ) {
        User user = getAuthenticatedUser(authentication);
        String qLower = query.toLowerCase();

        // Search logs (DailyLog)
        List<DailyLog> logs = logRepository.findByUser(user).stream()
                .filter(log ->
                        (log.getBlocked() != null && log.getBlocked().toLowerCase().contains(qLower)) ||
                                (log.getBuilt() != null && log.getBuilt().toLowerCase().contains(qLower)) ||
                                (log.getLearned() != null && log.getLearned().toLowerCase().contains(qLower)) ||
                                (log.getDate() != null && log.getDate().toString().contains(qLower))
                )
                .collect(Collectors.toList());

        // Search notes
        List<Note> notes = noteRepository.findByUser(user).stream()
                .filter(note ->
                        (note.getContent() != null && note.getContent().toLowerCase().contains(qLower)) ||
                                (note.getTitle() != null && note.getTitle().toLowerCase().contains(qLower))
                )
                .collect(Collectors.toList());

        // Search tasks (Kanban cards)
        List<KanbanCard> tasks = kanbanRepository.findByUser(user).stream()
                .filter(task ->
                        (task.getTitle() != null && task.getTitle().toLowerCase().contains(qLower)) ||
                                (task.getDescription() != null && task.getDescription().toLowerCase().contains(qLower))
                )
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                Map.of(
                        "logs", logs,
                        "notes", notes,
                        "tasks", tasks
                )
        );
    }



}
