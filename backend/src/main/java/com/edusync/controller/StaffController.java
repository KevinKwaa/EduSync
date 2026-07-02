package com.edusync.controller;

import com.edusync.dto.response.LeaveResponse;
import com.edusync.dto.response.StaffResponse;
import com.edusync.service.StaffService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Staff directory and leave management. Read endpoints open to all staff roles. */
@RestController
@RequestMapping("/api/v1/staff")
@PreAuthorize("isAuthenticated()")
public class StaffController {

    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    /** Full teaching/support staff directory. */
    @GetMapping
    public ResponseEntity<List<StaffResponse>> directory() {
        return ResponseEntity.ok(staffService.getDirectory());
    }

    /** Leave overview: pending, approved, and on-leave-today. */
    @GetMapping("/leave")
    public ResponseEntity<LeaveResponse> leaveOverview() {
        return ResponseEntity.ok(staffService.getLeaveOverview());
    }

    /** Leave requests awaiting approval (dashboard shortcut). */
    @GetMapping("/leave/pending")
    public ResponseEntity<List<LeaveResponse.LeaveItem>> pendingLeave() {
        return ResponseEntity.ok(staffService.getPendingLeave());
    }

    /** Single staff member by id. 404 if not found. */
    @GetMapping("/{id}")
    public ResponseEntity<StaffResponse> byId(@PathVariable Long id) {
        return ResponseEntity.ok(staffService.getById(id));
    }
}
