package com.edusync.service;

import com.edusync.dto.request.NoticeRequest;
import com.edusync.dto.response.NoticeResponse;
import com.edusync.dto.response.NoticesPageResponse;
import com.edusync.entity.Notice;
import com.edusync.entity.NoticeStatus;
import com.edusync.entity.User;
import com.edusync.exception.ResourceNotFoundException;
import com.edusync.repository.NoticeRepository;
import com.edusync.repository.UserRepository;
import com.edusync.util.DisplayMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/** Notice board CRUD with lifecycle (DRAFT -> PUBLISHED -> ARCHIVED). */
@Service
@Transactional(readOnly = true)
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    public NoticeService(NoticeRepository noticeRepository, UserRepository userRepository,
                         AuditService auditService) {
        this.noticeRepository = noticeRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    /** Flat list, optionally filtered by status; newest first. */
    public List<NoticeResponse> list(String status) {
        List<Notice> notices = (status == null || status.isBlank())
                ? noticeRepository.findAllByOrderByCreatedAtDesc()
                : noticeRepository.findByStatusOrderByCreatedAtDesc(parseStatus(status));
        return notices.stream().map(this::toResponse).toList();
    }

    /** Notices grouped by lifecycle for the notices page. */
    public NoticesPageResponse page() {
        return new NoticesPageResponse(
                mapStatus(NoticeStatus.PUBLISHED),
                mapStatus(NoticeStatus.DRAFT),
                mapStatus(NoticeStatus.ARCHIVED));
    }

    /** Create a notice authored by the current user. Publishing stamps publishedAt. */
    @Transactional
    public NoticeResponse create(NoticeRequest req) {
        NoticeStatus status = req.status() == null ? NoticeStatus.DRAFT : parseStatus(req.status());
        Notice notice = Notice.builder()
                .author(currentUser().orElse(null))
                .title(req.title())
                .body(req.body())
                .audience(req.audience())
                .status(status)
                .publishedAt(status == NoticeStatus.PUBLISHED ? LocalDateTime.now() : null)
                .build();
        Notice saved = noticeRepository.save(notice);
        auditService.record("Notice", saved.getId(), "CREATE", "title=" + saved.getTitle());
        return toResponse(saved);
    }

    /** Update an existing notice; transitioning to PUBLISHED stamps publishedAt once. */
    @Transactional
    public NoticeResponse update(Long id, NoticeRequest req) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notice", id));
        notice.setTitle(req.title());
        notice.setBody(req.body());
        notice.setAudience(req.audience());
        if (req.status() != null) {
            NoticeStatus newStatus = parseStatus(req.status());
            if (newStatus == NoticeStatus.PUBLISHED && notice.getPublishedAt() == null) {
                notice.setPublishedAt(LocalDateTime.now());
            }
            notice.setStatus(newStatus);
        }
        Notice saved = noticeRepository.save(notice);
        auditService.record("Notice", saved.getId(), "UPDATE", "title=" + saved.getTitle());
        return toResponse(saved);
    }

    /** Delete a notice; 404 if it does not exist. */
    @Transactional
    public void delete(Long id) {
        if (!noticeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Notice", id);
        }
        noticeRepository.deleteById(id);
        auditService.record("Notice", id, "DELETE", null);
    }

    // --- helpers -------------------------------------------------------------

    private List<NoticeResponse> mapStatus(NoticeStatus status) {
        return noticeRepository.findByStatusOrderByCreatedAtDesc(status).stream()
                .map(this::toResponse).toList();
    }

    private NoticeResponse toResponse(Notice n) {
        String authorName = n.getAuthor() != null ? n.getAuthor().getName() : "Admin";
        LocalDateTime reference = n.getPublishedAt() != null ? n.getPublishedAt() : n.getCreatedAt();
        return new NoticeResponse(
                n.getId(),
                DisplayMapper.initials(authorName),
                authorName,
                n.getTitle(),
                n.getBody(),
                n.getAudience(),
                DisplayMapper.kebab(n.getStatus()),
                DisplayMapper.relativeTime(reference),
                n.getPublishedAt(),
                n.getCreatedAt());
    }

    private Optional<User> currentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) return Optional.empty();
        return userRepository.findByEmail(auth.getName());
    }

    private static NoticeStatus parseStatus(String status) {
        String normalized = status.trim().toUpperCase();
        if (normalized.equals("ARCHIVE")) normalized = "ARCHIVED";
        if (normalized.equals("DRAFTS")) normalized = "DRAFT";
        try {
            return NoticeStatus.valueOf(normalized);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Unknown notice status: " + status);
        }
    }
}
