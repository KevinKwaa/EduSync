package com.edusync.dto.response;

import java.util.List;

/**
 * Exam results summary derived from recorded {@code ExamResult} rows.
 *
 * <p>Note: "upcoming" and "marking" queues require a dedicated exam-schedule
 * entity that is not part of the current schema, so they are returned empty.
 * Extend with an {@code Exam} entity to populate them.
 */
public record ExamResultsResponse(
    List<ResultRow> upcoming,
    List<ResultRow> marking,
    List<ResultRow> results
) {
    public record ResultRow(
        String name,
        String form,
        int avg,
        long count,
        String trend
    ) {}
}
