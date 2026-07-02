package com.edusync.exception;

/**
 * Thrown when a requested entity cannot be found by id (or another unique key).
 * Mapped to HTTP 404 by {@link GlobalExceptionHandler}.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resource, Object id) {
        super(resource + " not found with id " + id);
    }
}
