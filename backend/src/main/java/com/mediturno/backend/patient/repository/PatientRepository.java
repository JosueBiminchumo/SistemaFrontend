package com.mediturno.backend.patient.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mediturno.backend.patient.domain.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    java.util.Optional<Patient> findByUserEmail(String email);

    boolean existsByDocumentNumberAndUserIdNot(String documentNumber, Long userId);
}
