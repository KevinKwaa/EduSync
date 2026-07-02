package com.edusync.dto.response;

import java.util.List;

/**
 * Academic attainment page. {@code subjects} pivots average scores across forms
 * 1–5 (null where a subject is not offered for a form); {@code interventions}
 * lists low-scoring students who need support.
 */
public record AcademicsResponse(
    int overallAttainment,
    List<SubjectPerformance> subjects,
    List<Intervention> interventions
) {
    public record SubjectPerformance(
        String name,
        Integer f1, Integer f2, Integer f3, Integer f4, Integer f5,
        String trend
    ) {}

    public record Intervention(
        String initials,
        String name,
        String cls,
        String subject,
        int score,
        String teacher,
        String status
    ) {}
}
