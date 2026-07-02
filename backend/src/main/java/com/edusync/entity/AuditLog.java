package com.edusync.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Append-only record of a mutating operation (PDPA accountability — see PASSDOWN §5.11).
 * Maps the {@code audit_log} table created in the V1 migration.
 */
@Entity
@Table(name = "audit_log")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class AuditLog {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entity_type", length = 100)
    private String entityType;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(length = 50)
    private String action;

    @Column(name = "performed_by")
    private String performedBy;

    @Column(name = "changed_at")
    private LocalDateTime changedAt;

    @Column(columnDefinition = "TEXT")
    private String details;
}
