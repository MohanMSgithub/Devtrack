package com.devtrack.controller;

import com.devtrack.model.DailyLog;
import com.devtrack.model.User;
import com.devtrack.repository.LogRepository;
import com.devtrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LogController {

    @Autowired
    private LogRepository logRepository;

    @Autowired
    private UserRepository userRepository;

    public DailyLog addLog(String username, DailyLog log) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        log.setUser(user);
        return logRepository.save(log);
    }

    public List<DailyLog> getLogsByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return logRepository.findByUser(user);
    }
}
