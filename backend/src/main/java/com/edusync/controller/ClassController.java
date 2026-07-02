package com.edusync.controller;

import com.edusync.dto.response.ClassGroupResponse;
import com.edusync.service.ClassService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Classes grouped by form with aggregated per-class stats. */
@RestController
@RequestMapping("/api/v1/classes")
@PreAuthorize("isAuthenticated()")
public class ClassController {

    private final ClassService classService;

    public ClassController(ClassService classService) {
        this.classService = classService;
    }

    /** All classes grouped by form. */
    @GetMapping
    public ResponseEntity<List<ClassGroupResponse>> classes() {
        return ResponseEntity.ok(classService.getClassGroups());
    }
}
