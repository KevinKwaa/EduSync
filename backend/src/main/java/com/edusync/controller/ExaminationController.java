package com.edusync.controller;

import com.edusync.dto.response.ExaminationResponse;
import com.edusync.service.ExaminationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Exam schedule: upcoming, marking-in-progress, and results. */
@RestController
@RequestMapping("/api/v1/examinations")
@PreAuthorize("isAuthenticated()")
public class ExaminationController {

    private final ExaminationService examinationService;

    public ExaminationController(ExaminationService examinationService) {
        this.examinationService = examinationService;
    }

    @GetMapping
    public ResponseEntity<ExaminationResponse> examinations() {
        return ResponseEntity.ok(examinationService.getPage());
    }
}
