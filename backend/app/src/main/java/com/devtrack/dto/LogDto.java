package com.devtrack.dto;

import com.devtrack.model.DailyLog;

public class LogDto {
    private Long id;
    private String date;
    private String learned;
    private String built;
    private String blocked;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getLearned() {
        return learned;
    }

    public void setLearned(String learned) {
        this.learned = learned;
    }

    public String getBlocked() {
        return blocked;
    }

    public void setBlocked(String blocked) {
        this.blocked = blocked;
    }

    public String getBuilt() {
        return built;
    }

    public void setBuilt(String built) {
        this.built = built;
    }

    public LogDto() {}

    public LogDto(DailyLog log) {
        this.id = log.getId();
        this.date = log.getDate();
        this.learned = log.getLearned();
        this.built = log.getBuilt();
        this.blocked = log.getBlocked();
    }

    // Getters and Setters
}
