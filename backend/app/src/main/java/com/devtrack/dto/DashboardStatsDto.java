package com.devtrack.dto;

public class DashboardStatsDto {
    private long logsThisWeek;
    private long notesCount;
    private long todo;
    private long inProgress;
    private long done;

    public DashboardStatsDto(long logsThisWeek, long notesCount, long todo, long inProgress, long done) {
        this.logsThisWeek = logsThisWeek;
        this.notesCount = notesCount;
        this.todo = todo;
        this.inProgress = inProgress;
        this.done = done;
    }

    // getters
    public long getLogsThisWeek() { return logsThisWeek; }
    public long getNotesCount() { return notesCount; }
    public long getTodo() { return todo; }
    public long getInProgress() { return inProgress; }
    public long getDone() { return done; }
}
