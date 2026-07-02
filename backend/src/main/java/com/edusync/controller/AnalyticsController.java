package com.edusync.controller;

import com.edusync.dto.response.AnalyticsResponse;
import com.edusync.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Cross-domain analytics. Leadership-oriented but readable by all staff. */
@RestController
@RequestMapping("/api/v1/analytics")
@PreAuthorize("isAuthenticated()")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    /** Full analytics aggregate. */
    @GetMapping
    public ResponseEntity<AnalyticsResponse> all() {
        return ResponseEntity.ok(analyticsService.getAll());
    }

    /** Headline signals. */
    @GetMapping("/signals")
    public ResponseEntity<List<AnalyticsResponse.Signal>> signals() {
        return ResponseEntity.ok(analyticsService.getSignals());
    }

    /** Monthly attendance + fee trend. */
    @GetMapping("/monthly")
    public ResponseEntity<List<AnalyticsResponse.MonthPoint>> monthly() {
        return ResponseEntity.ok(analyticsService.getMonthly());
    }

    /** Biggest subject/form movers. */
    @GetMapping("/movers")
    public ResponseEntity<List<AnalyticsResponse.Mover>> movers() {
        return ResponseEntity.ok(analyticsService.getMovers());
    }
}
