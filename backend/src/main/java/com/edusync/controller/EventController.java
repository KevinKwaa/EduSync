package com.edusync.controller;

import com.edusync.dto.request.EventRequest;
import com.edusync.dto.response.EventResponse;
import com.edusync.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * School calendar events. Reads open to all staff; writes restricted to
 * PRINCIPAL and ADMIN.
 */
@RestController
@RequestMapping("/api/v1/events")
@PreAuthorize("isAuthenticated()")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    /** Events for {@code ?year=2026&month=6}, or upcoming events when omitted. */
    @GetMapping
    public ResponseEntity<List<EventResponse>> list(@RequestParam(required = false) Integer year,
                                                    @RequestParam(required = false) Integer month) {
        return ResponseEntity.ok(eventService.list(year, month));
    }

    /** Next few upcoming events (dashboard widget). */
    @GetMapping("/upcoming")
    public ResponseEntity<List<EventResponse>> upcoming() {
        return ResponseEntity.ok(eventService.upcoming());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('PRINCIPAL','ADMIN')")
    public ResponseEntity<EventResponse> create(@Valid @RequestBody EventRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('PRINCIPAL','ADMIN')")
    public ResponseEntity<EventResponse> update(@PathVariable Long id,
                                                @Valid @RequestBody EventRequest request) {
        return ResponseEntity.ok(eventService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('PRINCIPAL','ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        eventService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
