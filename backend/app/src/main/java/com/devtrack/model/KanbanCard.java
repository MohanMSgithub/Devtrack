package com.devtrack.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class KanbanCard {
    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "column_name")
    private String columnName;
    private String title;
    private String description;
    private LocalDate createdAt;
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDate.now();
    }

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getColumn() {
        return columnName;
    }

    public void setColumn(String column) {
        this.columnName = column;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
