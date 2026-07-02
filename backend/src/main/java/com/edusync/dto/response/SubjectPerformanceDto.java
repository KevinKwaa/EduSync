package com.edusync.dto.response;

/** Dashboard subject-performance bar: average score with the weakest subject highlighted. */
public record SubjectPerformanceDto(
    String subject,
    int score,
    boolean highlight
) {}
