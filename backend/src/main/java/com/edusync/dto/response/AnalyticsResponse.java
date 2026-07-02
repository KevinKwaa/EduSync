package com.edusync.dto.response;

import java.util.List;

/**
 * Analytics overview: headline signals, monthly attendance/fee trend, and the
 * biggest subject "movers" period-over-period.
 */
public record AnalyticsResponse(
    List<Signal> signals,
    List<MonthPoint> monthly,
    List<Mover> movers
) {
    public record Signal(
        Long id,
        String title,
        String value,
        String trend,
        String note,
        String severity
    ) {}

    public record MonthPoint(String month, double attendance, double fees) {}

    public record Mover(String subject, String form, String change, String direction) {}
}
