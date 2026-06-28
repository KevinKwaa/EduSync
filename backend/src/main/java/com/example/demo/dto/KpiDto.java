package com.example.demo.dto;

public record KpiDto(
    long totalStudents,
    long atRiskStudents,
    double todayAttendancePct,
    double feeCollectionPct
) {}
