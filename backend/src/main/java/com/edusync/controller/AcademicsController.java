package com.edusync.controller;

import com.edusync.dto.response.AcademicsResponse;
import com.edusync.dto.response.ExamResultsResponse;
import com.edusync.service.AcademicsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Academic attainment, interventions, and exam result summaries. */
@RestController
@RequestMapping("/api/v1")
@PreAuthorize("isAuthenticated()")
public class AcademicsController {

    private final AcademicsService academicsService;

    public AcademicsController(AcademicsService academicsService) {
        this.academicsService = academicsService;
    }

    /** Full academics page aggregate (overall attainment + subjects + interventions). */
    @GetMapping("/academics")
    public ResponseEntity<AcademicsResponse> academics() {
        return ResponseEntity.ok(academicsService.getPage());
    }

    /** Per-subject average scores across forms. */
    @GetMapping("/academics/subjects")
    public ResponseEntity<List<AcademicsResponse.SubjectPerformance>> subjects() {
        return ResponseEntity.ok(academicsService.getSubjectPerformance());
    }

    /** Students flagged for academic intervention. */
    @GetMapping("/academics/interventions")
    public ResponseEntity<List<AcademicsResponse.Intervention>> interventions() {
        return ResponseEntity.ok(academicsService.getInterventions());
    }

    /** Exam result summaries grouped by exam type and form. */
    @GetMapping("/exams")
    public ResponseEntity<ExamResultsResponse> exams() {
        return ResponseEntity.ok(academicsService.getExams());
    }
}
