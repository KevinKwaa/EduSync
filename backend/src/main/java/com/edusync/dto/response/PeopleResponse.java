package com.edusync.dto.response;

import java.util.List;

/**
 * People overview: headcount by role, recent audit activity, and the follow-up
 * watchlist (at-risk students + on-leave staff).
 */
public record PeopleResponse(
    long total,
    List<Segment> segments,
    List<Activity> recentActivity,
    List<WatchItem> watchlist
) {
    public record Segment(String role, long count, double pct) {}

    public record Activity(String initials, String name, String role, String action, String time) {}

    public record WatchItem(String initials, String name, String type, String reason, String urgency) {}
}
