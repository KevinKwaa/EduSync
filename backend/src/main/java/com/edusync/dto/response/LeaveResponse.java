package com.edusync.dto.response;

import java.util.List;

/** Staff leave overview: pending approvals, approved leave, and who is out today. */
public record LeaveResponse(
    List<LeaveItem> pending,
    List<LeaveItem> approved,
    List<OnLeaveToday> onLeaveToday
) {
    public record LeaveItem(
        Long id,
        Long staffId,
        String initials,
        String name,
        String type,
        String dates,
        long days,
        String status
    ) {}

    public record OnLeaveToday(
        String initials,
        String name,
        String subjects,
        String returnDate
    ) {}
}
