package com.devtrack.repository;

import com.devtrack.model.DailyLog;
import com.devtrack.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LogRepository extends JpaRepository<DailyLog, Long> {
    List<DailyLog> findByUser(User user);
}