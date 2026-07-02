package com.edusync.dto.response;

import java.util.List;

/**
 * Classes grouped by form. Per-class attendance/avgScore are aggregated from the
 * students whose {@code className} matches the classroom name.
 */
public record ClassGroupResponse(
    String form,
    int count,
    List<ClassInfo> classes
) {
    public record ClassInfo(
        Long id,
        String name,
        String teacher,
        int size,
        int attendance,
        int avgScore,
        String status
    ) {}
}
