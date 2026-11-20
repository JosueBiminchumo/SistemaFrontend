package com.mediturno.backend.doctor.dto;

import com.mediturno.backend.doctor.domain.Doctor;

public record DoctorResponse(
        Long id,
        Long userId,
        String firstName,
        String lastName,
        String specialty,
        Long specialtyId,
        String licenseNumber,
        String biography,
        boolean active) {

    public static DoctorResponse from(Doctor doctor) {
        return new DoctorResponse(
                doctor.getId(),
                doctor.getUser().getId(),
                doctor.getUser().getFirstName(),
                doctor.getUser().getLastName(),
                doctor.getSpecialty().getName(),
                doctor.getSpecialty().getId(),
                doctor.getLicenseNumber(),
                doctor.getBiography(),
                doctor.isActive());
    }
}
