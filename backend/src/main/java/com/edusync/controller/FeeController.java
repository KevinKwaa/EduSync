package com.edusync.controller;

import com.edusync.dto.response.FeePageResponse;
import com.edusync.service.FeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Fee collection reporting and bursaries. Read-only; visible to all staff roles. */
@RestController
@RequestMapping("/api/v1/fees")
@PreAuthorize("isAuthenticated()")
public class FeeController {

    private final FeeService feeService;

    public FeeController(FeeService feeService) {
        this.feeService = feeService;
    }

    /** Full fees page aggregate. */
    @GetMapping
    public ResponseEntity<FeePageResponse> page() {
        return ResponseEntity.ok(feeService.getPage());
    }

    /** Collected vs target vs outstanding. */
    @GetMapping("/summary")
    public ResponseEntity<FeePageResponse.Summary> summary() {
        return ResponseEntity.ok(feeService.getSummary());
    }

    /** Collection breakdown per form. */
    @GetMapping("/by-form")
    public ResponseEntity<List<FeePageResponse.ByForm>> byForm() {
        return ResponseEntity.ok(feeService.getByForm());
    }

    /** Overdue fee accounts with urgency banding. */
    @GetMapping("/overdue")
    public ResponseEntity<List<FeePageResponse.Overdue>> overdue() {
        return ResponseEntity.ok(feeService.getOverdue());
    }

    /** Bursary awards and applications. */
    @GetMapping("/bursaries")
    public ResponseEntity<List<FeePageResponse.Bursary>> bursaries() {
        return ResponseEntity.ok(feeService.getBursaries());
    }
}
