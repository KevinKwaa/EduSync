package com.edusync.exception;

/**
 * Thrown when an operation would create a duplicate of a uniquely-constrained
 * resource (e.g. a second attendance record for the same student on the same day).
 * Mapped to HTTP 409 by {@link GlobalExceptionHandler}.
 */
public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String message) {
        super(message);
    }
}
