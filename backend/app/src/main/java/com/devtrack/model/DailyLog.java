package com.devtrack.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class DailyLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String date;
    private String learned;
    private String built;
    private String blocked;

    @ManyToOne
    @JsonBackReference
    private User user;

    public DailyLog() {}

    public DailyLog(Long id, String date, String learned, String built, String blocked) {
        this.id = id;
        this.date = date;
        this.learned = learned;
        this.built = built;
        this.blocked = blocked;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getLearned() { return learned; }
    public void setLearned(String learned) { this.learned = learned; }

    public String getBuilt() { return built; }
    public void setBuilt(String built) { this.built = built; }

    public String getBlocked() { return blocked; }
    public void setBlocked(String blocked) { this.blocked = blocked; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
