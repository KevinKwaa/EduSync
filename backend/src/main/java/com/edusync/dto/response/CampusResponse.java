package com.edusync.dto.response;

/** Campus/site row. {@code status} is the kebab-cased operational status. */
public record CampusResponse(
    Long id,
    String name,
    Integer studentCount,
    Integer classroomCount,
    String status
) {}
