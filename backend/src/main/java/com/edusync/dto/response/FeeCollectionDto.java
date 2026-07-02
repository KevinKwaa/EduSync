package com.edusync.dto.response;

/** Dashboard fee donut: collected percentage plus pre-formatted RM labels. */
public record FeeCollectionDto(
    double collectedPct,
    String collectedLabel,
    String outstandingLabel
) {}
