package com.edusync.dto.response;

import java.math.BigDecimal;
import java.util.List;

/** Aggregated fees page: collection summary, per-form breakdown, overdue and bursaries. */
public record FeePageResponse(
    Summary summary,
    List<ByForm> byForm,
    List<Overdue> overdue,
    List<Bursary> bursaries
) {
    public record Summary(BigDecimal collected, BigDecimal outstanding, BigDecimal target, double pct) {}

    public record ByForm(String form, BigDecimal collected, BigDecimal outstanding, double pct) {}

    public record Overdue(Long id, String initials, String name, BigDecimal amount, String urgency) {}

    public record Bursary(Long id, String name, String form, String type, String status, BigDecimal amount) {}
}
