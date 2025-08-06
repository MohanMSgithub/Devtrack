package com.devtrack.controller;

import com.devtrack.dto.LogDto;
import com.devtrack.model.DailyLog;
import com.devtrack.model.User;
import com.devtrack.repository.UserRepository;
import com.devtrack.service.LogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "http://localhost:5173")
public class LogController {

    @Autowired
    private LogService logService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public DailyLog createLog(@RequestBody LogDto logDto,
                              @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return logService.saveLog(logDto, user);
    }

    @GetMapping
    public List<DailyLog> getLogs(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return logService.getLogs(user);
    }
}
