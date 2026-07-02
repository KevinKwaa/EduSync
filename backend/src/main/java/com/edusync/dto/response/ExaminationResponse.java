package com.edusync.dto.response;

import java.util.List;

/** Examinations page: upcoming schedule, marking-in-progress, and past results. */
public record ExaminationResponse(
    List<Upcoming> upcoming,
    List<Marking> marking,
    List<Result> results
) {
    public record Upcoming(Long id, String name, String date, String form, int subjects, long daysLeft) {}

    public record Marking(Long id, String name, String form, int subjects,
                          int submitted, int total, String deadline, String teacher) {}

    public record Result(Long id, String name, String form, int avg, String date, String trend, String delta) {}
}
