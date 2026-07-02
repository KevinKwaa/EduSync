package com.edusync.dto.response;

import java.util.List;

/** Payload for {@code GET /api/v1/students/at-risk} — the dashboard widget shortcut. */
public record AtRiskResponse(
    long totalFlagged,
    List<AtRiskStudent> students
) {
    public record AtRiskStudent(
        Long id,
        String initials,
        String name,
        String cls,
        String reason,
        String level
    ) {}
}
