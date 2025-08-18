package com.devtrack.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class DailyLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    @Column(nullable = false)
    private LocalDate date;

    private String learned;
    private String built;
    private String blocked;



    @ManyToOne
    @JsonBackReference
    private User user;


    public DailyLog() {}

    public DailyLog(Long id, LocalDate date, String learned, String built, String blocked) {
        this.id = id;
        this.date = date;
        this.learned = learned;
        this.built = built;
        this.blocked = blocked;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getLearned() { return learned; }
    public void setLearned(String learned) { this.learned = learned; }

    public String getBuilt() { return built; }
    public void setBuilt(String built) { this.built = built; }

    public String getBlocked() { return blocked; }
    public void setBlocked(String blocked) { this.blocked = blocked; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    @Transient // Not stored in DB
    public String getContent() {
        return String.format(
                "Learned: %s | Built: %s | Blocked: %s",
                learned != null ? learned : "",
                built != null ? built : "",
                blocked != null ? blocked : ""
        );
    }

}
