package com.edusync.util;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Locale;

/** Monetary helpers shared by the fee/finance/dashboard aggregation services. */
public final class Money {

    private Money() {}

    /** Null-safe: returns ZERO for a null amount. */
    public static BigDecimal nz(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    /** {@code part/whole} as a percentage rounded to 1 dp; 0 when whole is null or ≤ 0. */
    public static double pct(BigDecimal part, BigDecimal whole) {
        if (part == null || whole == null || whole.compareTo(BigDecimal.ZERO) <= 0) return 0.0;
        return part.multiply(BigDecimal.valueOf(100))
                .divide(whole, 1, RoundingMode.HALF_UP)
                .doubleValue();
    }

    /** 1_420_000 → "RM 1.42M"; 402_000 → "RM 402K"; smaller → "RM 950". */
    public static String format(BigDecimal amount) {
        double v = amount == null ? 0 : amount.doubleValue();
        if (v >= 1_000_000) return String.format(Locale.ENGLISH, "RM %.2fM", v / 1_000_000);
        if (v >= 1_000) return String.format(Locale.ENGLISH, "RM %.0fK", v / 1_000);
        return String.format(Locale.ENGLISH, "RM %.0f", v);
    }
}
