package com.devtrack.dto;

public class DashboardSummaryDto {
    private long totalLogs;
    private long totalNotes;
    private long totalKanbanTasks;
    private long completedTasks;

    public DashboardSummaryDto() {
    }

    public DashboardSummaryDto(long totalLogs, long totalNotes, long totalKanbanTasks, long completedTasks) {
        this.totalLogs = totalLogs;
        this.totalNotes = totalNotes;
        this.totalKanbanTasks = totalKanbanTasks;
        this.completedTasks = completedTasks;
    }

    public long getTotalLogs() {
        return totalLogs;
    }

    public void setTotalLogs(long totalLogs) {
        this.totalLogs = totalLogs;
    }

    public long getTotalNotes() {
        return totalNotes;
    }

    public void setTotalNotes(long totalNotes) {
        this.totalNotes = totalNotes;
    }

    public long getTotalKanbanTasks() {
        return totalKanbanTasks;
    }

    public void setTotalKanbanTasks(long totalKanbanTasks) {
        this.totalKanbanTasks = totalKanbanTasks;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(long completedTasks) {
        this.completedTasks = completedTasks;
    }
}
