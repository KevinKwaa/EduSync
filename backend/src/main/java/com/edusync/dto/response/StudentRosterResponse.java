package com.edusync.dto.response;

import java.util.List;

/** Roster payload for {@code GET /api/v1/students}: headline counts + the rows. */
public record StudentRosterResponse(
    long total,
    RosterStats stats,
    List<StudentSummary> students
) {
    public record RosterStats(
        long atRisk,
        long absentToday,
        long honourRoll,
        long newThisTerm
    ) {}
}
