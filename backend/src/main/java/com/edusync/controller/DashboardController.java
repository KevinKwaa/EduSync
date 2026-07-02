package com.edusync.controller;

import com.edusync.dto.response.AttendanceWeekDto;
import com.edusync.dto.response.DashboardSummaryDto;
import com.edusync.dto.response.FeeCollectionDto;
import com.edusync.dto.response.KpiDto;
import com.edusync.dto.response.SubjectPerformanceDto;
import com.edusync.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@PreAuthorize("isAuthenticated()")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDto> summary() {
        return ResponseEntity.ok(dashboardService.getSummary());
    }

    @GetMapping("/kpis")
    public ResponseEntity<KpiDto> kpis() {
        return ResponseEntity.ok(dashboardService.getKpis());
    }

    @GetMapping("/attendance/week")
    public ResponseEntity<AttendanceWeekDto> weeklyAttendance() {
        return ResponseEntity.ok(dashboardService.getWeeklyAttendance());
    }

    /** Collected vs outstanding fees for the dashboard donut. */
    @GetMapping("/fees/collection")
    public ResponseEntity<FeeCollectionDto> feeCollection() {
        return ResponseEntity.ok(dashboardService.getFeeCollection());
    }

    /** Average score per subject (weakest highlighted) for the dashboard bar chart. */
    @GetMapping("/subjects/performance")
    public ResponseEntity<List<SubjectPerformanceDto>> subjectPerformance() {
        return ResponseEntity.ok(dashboardService.getSubjectPerformance());
    }
}
