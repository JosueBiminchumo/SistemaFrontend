package com.mediturno.backend.doctor.domain;

import com.mediturno.backend.specialty.domain.Specialty;
import com.mediturno.backend.user.domain.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "doctors", uniqueConstraints = {
        @UniqueConstraint(name = "uk_doctor_user", columnNames = "user_id"),
        @UniqueConstraint(name = "uk_doctor_license", columnNames = "license_number")
})
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "specialty_id", nullable = false)
    private Specialty specialty;

    @Column(name = "license_number", nullable = false, length = 50, unique = true)
    private String licenseNumber;

    @Column(length = 2000)
    private String biography;

    @Column(nullable = false)
    private boolean active;

    protected Doctor() {
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Specialty getSpecialty() {
        return specialty;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public String getBiography() {
        return biography;
    }

    public boolean isActive() {
        return active;
    }
}
