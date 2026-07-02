package com.edusync.dto.response;

import java.math.BigDecimal;
import java.util.List;

/**
 * Finance page: collection summary, monthly collected totals, and a per-form
 * breakdown surfaced as "categories" (a dedicated fee-category model does not
 * exist yet, so forms are the real available dimension).
 */
public record FinanceResponse(
    Summary summary,
    List<MonthPoint> monthly,
    List<Category> categories
) {
    public record Summary(BigDecimal collected, BigDecimal outstanding, BigDecimal target, double pct) {}

    public record MonthPoint(String month, BigDecimal amount, double pct) {}

    public record Category(String name, BigDecimal collected, BigDecimal target, double pct) {}
}
