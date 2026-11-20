package com.mediturno.backend.appointment.dto;

import java.time.LocalDateTime;

import com.mediturno.backend.appointment.domain.Appointment;
import com.mediturno.backend.appointment.domain.AppointmentStatus;

public record AppointmentResponse(
        Long id,
        Long patientId,
        String patientName,
        Long doctorId,
        String doctorName,
        String specialty,
        LocalDateTime startAt,
        LocalDateTime endAt,
        AppointmentStatus status,
        String reason) {

    public static AppointmentResponse from(Appointment appointment) {
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getPatient().getUserId(),
                appointment.getPatient().getUser().getFirstName() + " "
                        + appointment.getPatient().getUser().getLastName(),
                appointment.getDoctor().getId(),
                appointment.getDoctor().getUser().getFirstName() + " "
                        + appointment.getDoctor().getUser().getLastName(),
                appointment.getDoctor().getSpecialty().getName(),
                appointment.getStartAt(),
                appointment.getEndAt(),
                appointment.getStatus(),
                appointment.getReason());
    }
}
