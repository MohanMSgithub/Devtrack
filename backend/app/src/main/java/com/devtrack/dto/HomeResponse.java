package com.devtrack.dto;

import java.util.List;

public class HomeResponse {
    private int logsCount;
    private int notesCount;
    private int cardsCount;
    private int streak;
    private List<ActivityItem> recentActivity;

    // getters/setters

    public int getLogsCount() { return logsCount; }
    public void setLogsCount(int logsCount) { this.logsCount = logsCount; }

    public int getNotesCount() { return notesCount; }
    public void setNotesCount(int notesCount) { this.notesCount = notesCount; }

    public int getCardsCount() { return cardsCount; }
    public void setCardsCount(int cardsCount) { this.cardsCount = cardsCount; }

    public int getStreak() { return streak; }
    public void setStreak(int streak) { this.streak = streak; }

    public List<ActivityItem> getRecentActivity() { return recentActivity; }
    public void setRecentActivity(List<ActivityItem> recentActivity) { this.recentActivity = recentActivity; }

    // nested activity item DTO
    public static class ActivityItem {
        private String type;
        private String content;
        private String date;

        public ActivityItem() {}
        public ActivityItem(String type, String content, String date) {
            this.type = type;
            this.content = content;
            this.date = date;
        }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
    }
}
