package com.edusync.controller;

import com.edusync.dto.response.CampusResponse;
import com.edusync.service.CampusService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Campus/site listing. */
@RestController
@RequestMapping("/api/v1/campus")
@PreAuthorize("isAuthenticated()")
public class CampusController {

    private final CampusService campusService;

    public CampusController(CampusService campusService) {
        this.campusService = campusService;
    }

    /** All campuses/sites. */
    @GetMapping
    public ResponseEntity<List<CampusResponse>> all() {
        return ResponseEntity.ok(campusService.getAll());
    }
}
