package com.devtrack.dto;

public class NoteDto {
    private String title;
    private String content;
    public NoteDto(String title, String content) {
        this.title = title;
        this.content = content;
    }

    // No-arg constructor
    public NoteDto() {}

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}