package com.edusync.service;

import com.edusync.dto.request.LoginRequest;
import com.edusync.dto.response.LoginResponse;
import com.edusync.entity.User;
import com.edusync.repository.UserRepository;
import com.edusync.security.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class AuthService {

    private static final String REFRESH_COOKIE = "refreshToken";
    private static final String REFRESH_PATH = "/api/v1/auth/refresh";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Value("${app.cookie.secure}")
    private boolean cookieSecure;

    @Value("${app.cookie.same-site}")
    private String cookieSameSite;

    @Value("${jwt.refresh-token-expiry}")
    private long refreshTokenExpiry;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest request, HttpServletResponse response) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        return issueTokens(user, response);
    }

    /**
     * Exchange a valid refresh-token cookie for a fresh access token, rotating
     * the refresh token. Throws {@link BadCredentialsException} (→ 401) when the
     * cookie is missing, invalid, expired, or its user no longer exists.
     */
    public LoginResponse refresh(String refreshToken, HttpServletResponse response) {
        if (refreshToken == null || refreshToken.isBlank() || !jwtUtil.isValid(refreshToken)) {
            throw new BadCredentialsException("Invalid refresh token");
        }
        String email = jwtUtil.extractEmail(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Invalid refresh token"));
        return issueTokens(user, response);
    }

    public void logout(HttpServletResponse response) {
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie("", 0).toString());
    }

    // --- helpers -------------------------------------------------------------

    /** Generates an access token and sets a rotated refresh-token cookie. */
    private LoginResponse issueTokens(User user, HttpServletResponse response) {
        String accessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie(refreshToken, refreshTokenExpiry).toString());
        return new LoginResponse(accessToken, user.getRole().name(), user.getName());
    }

    /**
     * HttpOnly, path-scoped refresh cookie. {@code secure} and {@code SameSite}
     * are environment-driven (see application.properties) so production can
     * enforce TLS-only + strict cross-site behaviour without a code change.
     */
    private ResponseCookie refreshCookie(String value, long maxAgeSeconds) {
        return ResponseCookie.from(REFRESH_COOKIE, value)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(cookieSameSite)
                .path(REFRESH_PATH)
                .maxAge(Duration.ofSeconds(maxAgeSeconds))
                .build();
    }
}
