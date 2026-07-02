package com.edusync.controller;

import com.edusync.dto.request.AttendanceSubmitRequest;
import com.edusync.dto.response.AttendancePageResponse;
import com.edusync.dto.response.AttendanceRecordResponse;
import com.edusync.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Attendance reporting and roll-call submission. */
@RestController
@RequestMapping("/api/v1/attendance")
@PreAuthorize("isAuthenticated()")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    /** Full attendance page aggregate (today + trends + breakdowns). */
    @GetMapping
    public ResponseEntity<AttendancePageResponse> page() {
        return ResponseEntity.ok(attendanceService.getPage());
    }

    /** Today's headline attendance numbers. */
    @GetMapping("/today")
    public ResponseEntity<AttendancePageResponse.Today> today() {
        return ResponseEntity.ok(attendanceService.getToday());
    }

    /** Mon–Fri attendance rates for the current week. */
    @GetMapping("/weekly")
    public ResponseEntity<List<AttendancePageResponse.DayRate>> weekly() {
        return ResponseEntity.ok(attendanceService.getWeekTrend());
    }

    /** Monthly attendance rates for the trailing 6 months. */
    @GetMapping("/monthly")
    public ResponseEntity<List<AttendancePageResponse.MonthRate>> monthly() {
        return ResponseEntity.ok(attendanceService.getMonthly());
    }

    /**
     * Submit a single roll-call entry. Teachers and the principal only.
     * Returns 201 with the persisted record, or 409 if a record already exists
     * for that student on that date.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER','PRINCIPAL')")
    public ResponseEntity<AttendanceRecordResponse> submit(@Valid @RequestBody AttendanceSubmitRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(attendanceService.submit(request));
    }
}
