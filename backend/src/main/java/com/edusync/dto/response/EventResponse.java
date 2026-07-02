package com.edusync.dto.response;

import java.time.LocalDate;

/**
 * Calendar/event row. {@code day} and {@code month} ("JUL") are split out for
 * the date-chip UI; {@code meta} is a short secondary line (location).
 */
public record EventResponse(
    Long id,
    String title,
    LocalDate date,
    int day,
    String month,
    String location,
    String type,
    String meta
) {}
