package com.edusync.controller;

import com.edusync.dto.response.PeopleResponse;
import com.edusync.service.PeopleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Cross-role people overview (headcount, recent activity, watchlist). */
@RestController
@RequestMapping("/api/v1/people")
@PreAuthorize("isAuthenticated()")
public class PeopleController {

    private final PeopleService peopleService;

    public PeopleController(PeopleService peopleService) {
        this.peopleService = peopleService;
    }

    @GetMapping
    public ResponseEntity<PeopleResponse> people() {
        return ResponseEntity.ok(peopleService.getPeople());
    }
}
