package com.edusync.dto.response;

public record KpiDto(
    long totalStudents,
    long atRiskStudents,
    double todayAttendancePct,
    double feeCollectionPct,
    long teachingStaff
) {}
