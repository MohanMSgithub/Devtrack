package com.devtrack.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String username;


    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<DailyLog> logs;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Note> notes;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<KanbanCard> cards;

    public User() {}

    public User(String username) {
        this.username = username;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }



    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }



    public List<DailyLog> getLogs() { return logs; }
    public void setLogs(List<DailyLog> logs) { this.logs = logs; }

    public List<Note> getNotes() { return notes; }
    public void setNotes(List<Note> notes) { this.notes = notes; }
    @JsonManagedReference
    public List<KanbanCard> getCards() { return cards; }
    public void setCards(List<KanbanCard> cards) { this.cards = cards; }
}
