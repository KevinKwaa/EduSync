package com.edusync.util;

/** Small numeric helpers for rounding and percentage display. */
public final class Numbers {

    private Numbers() {}

    /** Round to 1 decimal place. */
    public static double round1(double value) {
        return Math.round(value * 10) / 10.0;
    }

    /** {@code part/whole} as a percentage rounded to 1 dp; 0 when whole is 0. */
    public static double pct(long part, long whole) {
        return whole == 0 ? 0.0 : round1(part * 100.0 / whole);
    }

    /** Null-safe rounding of a boxed double to int (0 for null). */
    public static int roundToInt(Double value) {
        return value == null ? 0 : (int) Math.round(value);
    }
}
