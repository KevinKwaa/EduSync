package com.edusync.dto.response;

import java.time.LocalDateTime;

/**
 * A notice as shown in the board/list. {@code time} is a human relative label
 * ("2 hours ago"); raw timestamps are also included for clients that prefer them.
 */
public record NoticeResponse(
    Long id,
    String initials,
    String author,
    String title,
    String body,
    String audience,
    String status,
    String time,
    LocalDateTime publishedAt,
    LocalDateTime createdAt
) {}
