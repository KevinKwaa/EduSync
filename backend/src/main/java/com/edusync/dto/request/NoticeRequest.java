package com.edusync.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Create/update payload for a notice. {@code status} is optional
 * (DRAFT | PUBLISHED | ARCHIVED); defaults to DRAFT on create.
 */
public record NoticeRequest(
    @NotBlank @Size(max = 255) String title,
    String body,
    @Size(max = 100) String audience,
    String status
) {}
