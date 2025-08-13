package com.devtrack.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class RecentActivityDto {
    private String activity;
    private String type;      // e.g., "Log", "Note", "Task"
    private String title;     // title or short description
    private String date;      // formatted date string

    // Constructor for LocalDateTime
    public RecentActivityDto(String activity, LocalDateTime dateTime) {
        this.activity = activity;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        this.date = dateTime.format(formatter);
    }

    // Constructor for LocalDate
    public RecentActivityDto(String activity, LocalDate date) {
        this.activity = activity;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        this.date = date.format(formatter);
    }

    // Full details constructor
    public RecentActivityDto(String activity, String type, String title, String date) {
        this.activity = activity;
        this.type = type;
        this.title = title;
        this.date = date;
    }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getActivity() { return activity; }
    public void setActivity(String activity) { this.activity = activity; }
}
