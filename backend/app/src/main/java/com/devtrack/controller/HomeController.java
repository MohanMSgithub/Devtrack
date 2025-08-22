package com.devtrack.controller;

import com.devtrack.dto.HomeResponse;
import com.devtrack.model.DailyLog;
import com.devtrack.model.KanbanCard;
import com.devtrack.model.Note;
import com.devtrack.model.User;
import com.devtrack.repository.LogRepository;
import com.devtrack.repository.NoteRepository;
import com.devtrack.repository.KanbanRepository;
import com.devtrack.repository.UserRepository;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/home")
public class HomeController {

    @Autowired private UserRepository userRepo;
    @Autowired private LogRepository logRepo;
    @Autowired private NoteRepository noteRepo;
    @Autowired private KanbanRepository kanbanRepo;

    @GetMapping("/{username}")
    public HomeResponse getHomeData(@PathVariable String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<DailyLog> logs = logRepo.findByUser(user);
        List<Note> notes = noteRepo.findByUser(user);
        List<KanbanCard> cards = kanbanRepo.findByUser(user);

        HomeResponse res = new HomeResponse();
        res.setLogsCount(logs.size());
        res.setNotesCount(notes.size());
        res.setCardsCount(cards.size());
        res.setStreak(calculateStreak(logs));

        // Merge activity (Logs, Notes, Cards)
        List<HomeResponse.ActivityItem> activity = new ArrayList<>();

        for (DailyLog l : logs) {
            activity.add(new HomeResponse.ActivityItem(
                    "Log",
                    l.getContent(),
                    l.getDate().toString()
            ));
        }
        for (Note n : notes) {
            activity.add(new HomeResponse.ActivityItem(
                    "Note",
                    n.getTitle(),
                    n.getCreatedAt() != null ? n.getCreatedAt().toString() : ""
            ));
        }
        for (KanbanCard c : cards) {
            activity.add(new HomeResponse.ActivityItem(
                    "Card",
                    c.getTitle(),
                    c.getCreatedAt() != null ? c.getCreatedAt().toString() : ""
            ));
        }


        // Sort newest first & limit to 2
        List<HomeResponse.ActivityItem> recent = activity.stream()
                .sorted((a, b) -> b.getDate().compareTo(a.getDate()))
                .limit(2)
                .collect(Collectors.toList());

        res.setRecentActivity(recent);
        return res;
    }

    // ✅ Simple streak calculation: count consecutive days with logs
    private int calculateStreak(List<DailyLog> logs) {
        Set<LocalDate> logDates = logs.stream()
                .map(DailyLog::getDate)
                .collect(Collectors.toSet());

        LocalDate today = LocalDate.now();
        int streak = 0;

        while (logDates.contains(today.minusDays(streak))) {
            streak++;
        }
        return streak;
    }
}
