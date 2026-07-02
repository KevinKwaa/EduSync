package com.edusync.dto.response;

import java.time.LocalDate;

/** Echo of a persisted attendance record. */
public record AttendanceRecordResponse(
    Long id,
    Long studentId,
    String studentName,
    LocalDate date,
    String status
) {}
