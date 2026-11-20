package com.mediturno.backend.appointment.domain;

import java.time.LocalDateTime;

import com.mediturno.backend.doctor.domain.Doctor;
import com.mediturno.backend.patient.domain.Patient;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.Version;

@Entity
@Table(name = "citas", uniqueConstraints = @UniqueConstraint(
        name = "uk_citas_active_slot", columnNames = "active_slot_key"))
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_id", referencedColumnName = "user_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(name = "start_at", nullable = false)
    private LocalDateTime startAt;

    @Column(name = "end_at", nullable = false)
    private LocalDateTime endAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AppointmentStatus status;

    @Column(nullable = false, length = 255)
    private String reason;

    @Column(name = "active_slot_key", length = 64, unique = true)
    private String activeSlotKey;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Version
    @Column(nullable = false)
    private long version;

    protected Appointment() {
    }

    public Appointment(Patient patient, Doctor doctor, LocalDateTime startAt, LocalDateTime endAt, String reason) {
        this.patient = patient;
        this.doctor = doctor;
        this.startAt = startAt;
        this.endAt = endAt;
        this.reason = reason;
        this.status = AppointmentStatus.PENDING;
        this.activeSlotKey = slotKey(doctor.getId(), startAt);
    }

    public void reschedule(Doctor doctor, LocalDateTime startAt, LocalDateTime endAt, String reason) {
        this.doctor = doctor;
        this.startAt = startAt;
        this.endAt = endAt;
        this.reason = reason;
        this.activeSlotKey = slotKey(doctor.getId(), startAt);
    }

    public void cancel() {
        this.status = AppointmentStatus.CANCELLED;
        this.activeSlotKey = null;
    }

    public void confirm() {
        this.status = AppointmentStatus.CONFIRMED;
    }

    @PrePersist
    void setCreationTimestamps() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void updateTimestamp() {
        updatedAt = LocalDateTime.now();
    }

    private static String slotKey(Long doctorId, LocalDateTime startAt) {
        return doctorId + ":" + startAt;
    }

    public Long getId() {
        return id;
    }

    public Patient getPatient() {
        return patient;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public LocalDateTime getStartAt() {
        return startAt;
    }

    public LocalDateTime getEndAt() {
        return endAt;
    }

    public AppointmentStatus getStatus() {
        return status;
    }

    public String getReason() {
        return reason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
