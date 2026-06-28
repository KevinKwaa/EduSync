package com.example.demo.controller;

import com.example.demo.dto.AttendanceWeekDto;
import com.example.demo.dto.DashboardSummaryDto;
import com.example.demo.dto.KpiDto;
import com.example.demo.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
