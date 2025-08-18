package com.devtrack.dto;

import java.time.LocalDate;

public class RecentActivityDto {
    private Long id;
    private String type;      // "log", "note", "kanban"
    private String title;
    private String content;
    private LocalDate date;
    private String columnName; // for kanban only

    public RecentActivityDto(Long id, String type, String title, String content, LocalDate date, String columnName) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.content = content;
        this.date = date;
        this.columnName = columnName;
    }

    // getters
    public Long getId() { return id; }
    public String getType() { return type; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public LocalDate getDate() { return date; }
    public String getColumnName() { return columnName; }
}
