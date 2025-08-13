package com.devtrack.controller;

import com.devtrack.model.DailyLog;
import com.devtrack.model.Note;
import com.devtrack.model.KanbanCard;
import com.devtrack.model.User;
import com.devtrack.repository.LogRepository;
import com.devtrack.repository.NoteRepository;
import com.devtrack.repository.KanbanRepository;
import com.devtrack.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DailyLogRepository dailyLogRepository;
    private final NoteRepository noteRepository;
    private final KanbanCardRepository kanbanCardRepository;
    private final UserRepository userRepository;

    public DashboardController(DailyLogRepository dailyLogRepository,
                               NoteRepository noteRepository,
                               KanbanCardRepository kanbanCardRepository,
                               UserRepository userRepository) {
        this.dailyLogRepository = dailyLogRepository;
        this.noteRepository = noteRepository;
        this.kanbanCardRepository = kanbanCardRepository;
        this.userRepository = userRepository;
    }

    // GET /api/dashboard/summary
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        long totalLogs = dailyLogRepository.countByUser(user);
        long totalNotes = noteRepository.countByUser(user);

        Map<String, Long> kanbanCounts = new HashMap<>();
        kanbanCounts.put("done", kanbanCardRepository.countByUserAndColumn(user, "done"));
        kanbanCounts.put("inProgress", kanbanCardRepository.countByUserAndColumn(user, "inProgress"));
        kanbanCounts.put("todo", kanbanCardRepository.countByUserAndColumn(user, "todo"));

        Map<String, Object> response = new HashMap<>();
        response.put("totalLogs", totalLogs);
        response.put("totalNotes", totalNotes);
        response.put("kanban", kanbanCounts);

        return ResponseEntity.ok(response);
    }

    // GET /api/dashboard/recent
    @GetMapping("/recent")
    public ResponseEntity<Map<String, Object>> getRecent(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Map<String, Object>> recentLogs = dailyLogRepository.findTop5ByUserOrderByDateDesc(user)
                .stream()
                .map(log -> Map.of(
                        "date", log.getDate(),
                        "content", log.getContent()
                ))
                .collect(Collectors.toList());

        List<Map<String, Object>> recentNotes = noteRepository.findTop5ByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(note -> Map.of(
                        "title", note.getTitle(),
                        "content", note.getContent()
                ))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("logs", recentLogs);
        response.put("notes", recentNotes);

        return ResponseEntity.ok(response);
    }
}
