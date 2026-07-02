package com.edusync.service;

import com.edusync.entity.AuditLog;
import com.edusync.repository.AuditLogRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Writes audit-log rows for mutating operations. Captures who (from the security
 * context), what, and when. Called explicitly from mutating service methods so
 * the audit trail is obvious at each write site.
 */
@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    /** Record a mutation, e.g. record("Notice", 12L, "CREATE", "title=Fee deadline"). */
    public void record(String entityType, Long entityId, String action, String details) {
        AuditLog entry = AuditLog.builder()
                .entityType(entityType)
                .entityId(entityId)
                .action(action)
                .performedBy(currentActor())
                .changedAt(LocalDateTime.now())
                .details(details)
                .build();
        auditLogRepository.save(entry);
    }

    private String currentActor() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (auth != null && auth.getName() != null) ? auth.getName() : "system";
    }
}
