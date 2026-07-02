package com.edusync.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 * In-memory token-bucket rate limiter (PASSDOWN §5.3).
 *
 * <ul>
 *   <li>{@code POST /api/v1/auth/login} — 5 requests / 15 min per IP (brute-force guard)</li>
 *   <li>other {@code /api/v1/**} — 200 requests / min, keyed per authenticated user
 *       (resolved from the bearer token) or per IP when anonymous</li>
 * </ul>
 *
 * Buckets are held in memory, which is fine for a single instance. A clustered
 * deployment should back this with the Bucket4j Redis/Hazelcast modules.
 */
@Component
@Order(1) // run before the security chain so abuse is rejected cheaply
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final String LOGIN_PATH = "/api/v1/auth/login";
    private static final String API_PREFIX = "/api/v1/";

    private final ConcurrentMap<String, Bucket> loginBuckets = new ConcurrentHashMap<>();
    private final ConcurrentMap<String, Bucket> apiBuckets = new ConcurrentHashMap<>();

    private final JwtUtil jwtUtil;

    public RateLimitingFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String path = request.getRequestURI();
        if (!path.startsWith(API_PREFIX)) {
            chain.doFilter(request, response);
            return;
        }

        Bucket bucket;
        if (LOGIN_PATH.equals(path)) {
            bucket = loginBuckets.computeIfAbsent(clientIp(request), k -> newLoginBucket());
        } else {
            bucket = apiBuckets.computeIfAbsent(resolveKey(request), k -> newApiBucket());
        }

        if (bucket.tryConsume(1)) {
            chain.doFilter(request, response);
        } else {
            response.setStatus(429); // Too Many Requests
            response.setContentType("application/json");
            response.getWriter().write(
                    "{\"error\":\"RATE_LIMITED\",\"message\":\"Too many requests — slow down and retry shortly\"}");
        }
    }

    @SuppressWarnings("deprecation") // classic/Refill API is stable on bucket4j 8.x
    private static Bucket newLoginBucket() {
        return Bucket.builder()
                .addLimit(Bandwidth.classic(5, Refill.intervally(5, Duration.ofMinutes(15))))
                .build();
    }

    @SuppressWarnings("deprecation")
    private static Bucket newApiBucket() {
        return Bucket.builder()
                .addLimit(Bandwidth.classic(200, Refill.intervally(200, Duration.ofMinutes(1))))
                .build();
    }

    /** Per-user key from a valid bearer token, else per-IP. */
    private String resolveKey(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            if (jwtUtil.isValid(token)) {
                return "user:" + jwtUtil.extractEmail(token);
            }
        }
        return "ip:" + clientIp(request);
    }

    private static String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
