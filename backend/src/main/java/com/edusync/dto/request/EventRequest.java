package com.edusync.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/** Create/update payload for a calendar event. */
public record EventRequest(
    @NotBlank @Size(max = 255) String title,
    @NotNull LocalDate date,
    @Size(max = 255) String location,
    @Size(max = 100) String type
) {}
