package com.edusync.dto.response;

import java.util.List;

/**
 * Teacher/staff directory row. {@code subjects} is split from the stored
 * comma-separated column; {@code load} is workload as a percentage of a full
 * teaching week; {@code status} is "active" or "on-leave".
 */
public record StaffResponse(
    Long id,
    String initials,
    String name,
    String role,
    List<String> subjects,
    long classes,
    Double hours,
    int load,
    String status
) {}
