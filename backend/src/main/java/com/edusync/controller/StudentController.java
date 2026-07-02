package com.edusync.controller;

import com.edusync.dto.response.AtRiskResponse;
import com.edusync.dto.response.StudentRosterResponse;
import com.edusync.dto.response.StudentSummary;
import com.edusync.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/** Student roster, at-risk widget and detail lookups. Read-only for all staff roles. */
@RestController
@RequestMapping("/api/v1/students")
@PreAuthorize("isAuthenticated()")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    /** Roster with optional filters, e.g. {@code /students?form=5&status=at-risk}. */
    @GetMapping
    public ResponseEntity<StudentRosterResponse> roster(
            @RequestParam(required = false) Integer form,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(studentService.getRoster(form, status));
    }

    /** Dashboard shortcut: students currently flagged at-risk. */
    @GetMapping("/at-risk")
    public ResponseEntity<AtRiskResponse> atRisk() {
        return ResponseEntity.ok(studentService.getAtRisk());
    }

    /** Single student by id. Returns 404 if not found or soft-deleted. */
    @GetMapping("/{id}")
    public ResponseEntity<StudentSummary> byId(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getById(id));
    }
}
