package com.devtrack.service;

import com.devtrack.dto.LogDto;
import com.devtrack.model.DailyLog;
import com.devtrack.model.User;
import com.devtrack.repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LogService {
    @Autowired
    private LogRepository logRepository;

    public DailyLog saveLog(LogDto logDto, User user) {
        DailyLog log = new DailyLog();
        log.setDate(logDto.getDate());
        log.setLearned(logDto.getLearned());
        log.setBuilt(logDto.getBuilt());
        log.setBlocked(logDto.getBlocked());
        log.setUser(user);
        return logRepository.save(log);
    }

    public List<DailyLog> getLogs(User user) {
        return logRepository.findByUser(user);
    }
}