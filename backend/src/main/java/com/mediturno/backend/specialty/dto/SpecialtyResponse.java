package com.mediturno.backend.specialty.dto;

import java.time.Instant;

import com.mediturno.backend.specialty.domain.Specialty;

public record SpecialtyResponse(Long id, String name, String description, boolean active, Instant createdAt) {

    public static SpecialtyResponse from(Specialty specialty) {
        return new SpecialtyResponse(
                specialty.getId(),
                specialty.getName(),
                specialty.getDescription(),
                specialty.isActive(),
                specialty.getCreatedAt());
    }
}
