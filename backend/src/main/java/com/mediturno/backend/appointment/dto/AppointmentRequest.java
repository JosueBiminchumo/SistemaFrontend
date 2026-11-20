package com.mediturno.backend.appointment.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record AppointmentRequest(
        @NotNull @Positive Long doctorId,
        @NotNull LocalDateTime startAt,
        @jakarta.validation.constraints.NotBlank @Size(max = 255) String reason) {
}
