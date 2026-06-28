package com.example.demo.dto;

import java.util.List;

public record AttendanceWeekDto(
    List<DayAttendance> days
) {
    public record DayAttendance(String day, long present, long absent) {}
}
