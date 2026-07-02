package com.edusync.util;

import com.edusync.entity.StudentStatus;

import java.time.Duration;
import java.time.LocalDateTime;

/**
 * Pure helpers that turn domain values into the display-friendly shapes the
 * React frontend expects (initials, "Form 5" labels, kebab-case statuses).
 * Kept dependency-free and static so any service can reuse it without wiring.
 */
public final class DisplayMapper {

    private DisplayMapper() {}

    /** "Aiman Hakim" -> "AH". Falls back to first two letters for single-word names. */
    public static String initials(String name) {
        if (name == null || name.isBlank()) return "?";
        String[] parts = name.trim().split("\\s+");
        if (parts.length == 1) {
            String p = parts[0];
            return (p.length() >= 2 ? p.substring(0, 2) : p).toUpperCase();
        }
        return ("" + parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }

    /** 5 -> "Form 5"; null -> "Unassigned". */
    public static String formLabel(Integer form) {
        return form == null ? "Unassigned" : "Form " + form;
    }

    /**
     * Display status the roster UI uses. AT_RISK is authoritative; otherwise a
     * coarse band is derived from the cached average score:
     * >= 85 honour, < 65 support, else normal.
     */
    public static String studentDisplayStatus(StudentStatus status, Double avgScore) {
        if (status == StudentStatus.AT_RISK) return "at-risk";
        if (status == StudentStatus.GRADUATED) return "graduated";
        if (status == StudentStatus.WITHDRAWN) return "withdrawn";
        if (avgScore == null) return "normal";
        if (avgScore >= 85) return "honour";
        if (avgScore < 65) return "support";
        return "normal";
    }

    /** ACTIVE -> "active", AT_RISK -> "at-risk". */
    public static String kebab(Enum<?> value) {
        return value == null ? null : value.name().toLowerCase().replace('_', '-');
    }

    /** "2 hours ago", "Yesterday", "3 days ago" — coarse relative label from a timestamp. */
    public static String relativeTime(LocalDateTime when) {
        if (when == null) return "—";
        Duration d = Duration.between(when, LocalDateTime.now());
        long minutes = d.toMinutes();
        if (minutes < 1) return "Just now";
        if (minutes < 60) return minutes + (minutes == 1 ? " minute ago" : " minutes ago");
        long hours = d.toHours();
        if (hours < 24) return hours + (hours == 1 ? " hour ago" : " hours ago");
        long days = d.toDays();
        if (days == 1) return "Yesterday";
        if (days < 7) return days + " days ago";
        long weeks = days / 7;
        if (weeks < 5) return weeks + (weeks == 1 ? " week ago" : " weeks ago");
        long months = days / 30;
        return months + (months == 1 ? " month ago" : " months ago");
    }
}
