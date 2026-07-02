package com.edusync.dto.response;

public record LoginResponse(
    String accessToken,
    String tokenType,
    String role,
    String name
) {
    public LoginResponse(String accessToken, String role, String name) {
        this(accessToken, "Bearer", role, name);
    }
}
