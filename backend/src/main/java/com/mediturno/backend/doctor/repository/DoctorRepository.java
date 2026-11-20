package com.mediturno.backend.doctor.repository;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mediturno.backend.doctor.domain.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    List<Doctor> findAllByActiveTrueOrderByUserLastNameAscUserFirstNameAsc();

    List<Doctor> findAllByActiveTrueAndSpecialtyIdOrderByUserLastNameAscUserFirstNameAsc(Long specialtyId);

    Optional<Doctor> findByIdAndActiveTrue(Long id);

    Optional<Doctor> findByUserEmail(String email);

    long countByActiveTrue();

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select d from Doctor d where d.id = :id and d.active = true")
    Optional<Doctor> findActiveByIdForUpdate(@Param("id") Long id);
}
