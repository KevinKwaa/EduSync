package com.edusync.dto.response;

import java.util.List;

/** Aggregated attendance page payload (today + trends + breakdowns). */
public record AttendancePageResponse(
    Today today,
    List<DayRate> weekTrend,
    List<FormAttendance> byForm,
    List<AbsentStudent> absentToday,
    List<MonthRate> monthly
) {
    public record Today(String date, double rate, long present, long absent, long late) {}

    public record DayRate(String day, String date, double rate) {}

    public record FormAttendance(String form, long present, long total, double rate) {}

    public record AbsentStudent(String initials, String name, String cls, long streak) {}

    public record MonthRate(String month, double rate) {}
}
