package com.edusync.dto.response;

/**
 * One row of the student roster, shaped to match the frontend roster table.
 * {@code form} is a label ("Form 5") and {@code status} is a kebab-case display
 * band ("at-risk", "honour", "support", "normal").
 */
public record StudentSummary(
    Long id,
    String initials,
    String name,
    String form,
    String cls,
    int attendance,
    int score,
    String status
) {}
