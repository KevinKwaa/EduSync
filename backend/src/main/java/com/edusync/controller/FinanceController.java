package com.edusync.controller;

import com.edusync.dto.response.FinanceResponse;
import com.edusync.service.FinanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Finance overview: summary, monthly collections, and per-form breakdown. */
@RestController
@RequestMapping("/api/v1/finance")
@PreAuthorize("isAuthenticated()")
public class FinanceController {

    private final FinanceService financeService;

    public FinanceController(FinanceService financeService) {
        this.financeService = financeService;
    }

    @GetMapping
    public ResponseEntity<FinanceResponse> finance() {
        return ResponseEntity.ok(financeService.getPage());
    }
}
