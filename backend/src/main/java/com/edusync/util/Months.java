package com.edusync.util;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/** Builds trailing calendar-month windows for the "last N months" trend endpoints. */
public final class Months {

    private Months() {}

    /** A single month with its short label ("Jun") and inclusive day bounds. */
    public record Window(String label, LocalDate start, LocalDate end) {}

    /**
     * The trailing {@code count} calendar months up to and including the current
     * month, oldest first.
     */
    public static List<Window> trailing(int count) {
        List<Window> windows = new ArrayList<>();
        LocalDate now = LocalDate.now();
        for (int i = count - 1; i >= 0; i--) {
            LocalDate start = now.minusMonths(i).withDayOfMonth(1);
            LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
            windows.add(new Window(
                    start.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH), start, end));
        }
        return windows;
    }
}
