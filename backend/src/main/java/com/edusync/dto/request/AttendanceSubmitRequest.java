package com.edusync.dto.request;

import com.edusync.entity.AttendanceStatus;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

/** A single roll-call entry submitted by a teacher. */
public record AttendanceSubmitRequest(
    @NotNull Long studentId,
    @NotNull LocalDate date,
    @NotNull AttendanceStatus status
) {}
