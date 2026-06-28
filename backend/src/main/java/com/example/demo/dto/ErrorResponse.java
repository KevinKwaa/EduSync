package com.example.demo.dto;

import java.time.Instant;

public record ErrorResponse(
    String error,
    String message,
    String timestamp
) {
    public ErrorResponse(String error, String message) {
        this(error, message, Instant.now().toString());
    }
}
