package com.edusync.controller;

import com.edusync.dto.request.NoticeRequest;
import com.edusync.dto.response.NoticeResponse;
import com.edusync.dto.response.NoticesPageResponse;
import com.edusync.service.NoticeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Notice board. Reads are open to all staff; create/update/delete are restricted
 * to PRINCIPAL and ADMIN (per the RBAC matrix).
 */
@RestController
@RequestMapping("/api/v1/notices")
@PreAuthorize("isAuthenticated()")
public class NoticeController {

    private final NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    /** Flat list, optional {@code ?status=published|draft|archived}. */
    @GetMapping
    public ResponseEntity<List<NoticeResponse>> list(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(noticeService.list(status));
    }

    /** Notices grouped by lifecycle for the notices page. */
    @GetMapping("/page")
    public ResponseEntity<NoticesPageResponse> page() {
        return ResponseEntity.ok(noticeService.page());
    }

    /** Create a notice. Returns 201. */
    @PostMapping
    @PreAuthorize("hasAnyRole('PRINCIPAL','ADMIN')")
    public ResponseEntity<NoticeResponse> create(@Valid @RequestBody NoticeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(noticeService.create(request));
    }

    /** Update an existing notice. 404 if not found. */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('PRINCIPAL','ADMIN')")
    public ResponseEntity<NoticeResponse> update(@PathVariable Long id,
                                                 @Valid @RequestBody NoticeRequest request) {
        return ResponseEntity.ok(noticeService.update(id, request));
    }

    /** Delete a notice. Returns 204; 404 if not found. */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('PRINCIPAL','ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        noticeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
