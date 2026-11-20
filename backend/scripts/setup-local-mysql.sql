-- Local development bootstrap only. Run in MySQL Workbench as an administrator.
-- Replace the placeholder password below before executing; do not commit a real password.

CREATE DATABASE IF NOT EXISTS mediturno
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

CREATE USER IF NOT EXISTS 'mediturno_app'@'localhost'
    IDENTIFIED BY 'REPLACE_WITH_A_STRONG_LOCAL_PASSWORD';

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES
    ON mediturno.* TO 'mediturno_app'@'localhost';

USE mediturno;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(254) NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    active BOOLEAN NOT NULL,
    created_at TIMESTAMP(6) NOT NULL,
    updated_at TIMESTAMP(6) NOT NULL,
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT chk_users_role CHECK (role IN ('ADMIN', 'DOCTOR', 'PATIENT'))
);

CREATE TABLE IF NOT EXISTS patients (
    user_id BIGINT NOT NULL,
    document_number VARCHAR(8) NOT NULL,
    birth_date DATE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP(6) NOT NULL,
    updated_at TIMESTAMP(6) NOT NULL,
    CONSTRAINT pk_patients PRIMARY KEY (user_id),
    CONSTRAINT fk_patients_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT uk_patients_document_number UNIQUE (document_number),
    CONSTRAINT uk_patients_user_id UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS specialties (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    active BOOLEAN NOT NULL,
    created_at TIMESTAMP(6) NOT NULL,
    CONSTRAINT pk_specialties PRIMARY KEY (id),
    CONSTRAINT uk_specialties_name UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS doctors (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    specialty_id BIGINT NOT NULL,
    license_number VARCHAR(50) NOT NULL,
    biography VARCHAR(2000),
    active BOOLEAN NOT NULL,
    CONSTRAINT pk_doctors PRIMARY KEY (id),
    CONSTRAINT uk_doctor_user UNIQUE (user_id),
    CONSTRAINT uk_doctor_license UNIQUE (license_number),
    CONSTRAINT fk_doctors_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_doctors_specialty FOREIGN KEY (specialty_id) REFERENCES specialties (id)
);

CREATE TABLE IF NOT EXISTS doctor_schedules (
    id BIGINT NOT NULL AUTO_INCREMENT,
    doctor_id BIGINT NOT NULL,
    day_of_week VARCHAR(15) NOT NULL,
    start_time TIME(6) NOT NULL,
    end_time TIME(6) NOT NULL,
    slot_minutes INT NOT NULL,
    active BOOLEAN NOT NULL,
    CONSTRAINT pk_doctor_schedules PRIMARY KEY (id),
    CONSTRAINT fk_doctor_schedules_doctor FOREIGN KEY (doctor_id) REFERENCES doctors (id)
);

CREATE TABLE IF NOT EXISTS citas (
    id BIGINT NOT NULL AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    start_at DATETIME(6) NOT NULL,
    end_at DATETIME(6) NOT NULL,
    status VARCHAR(20) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    active_slot_key VARCHAR(64),
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    version BIGINT NOT NULL,
    CONSTRAINT pk_citas PRIMARY KEY (id),
    CONSTRAINT uk_citas_active_slot UNIQUE (active_slot_key),
    CONSTRAINT fk_citas_patient FOREIGN KEY (patient_id) REFERENCES patients (user_id),
    CONSTRAINT fk_citas_doctor FOREIGN KEY (doctor_id) REFERENCES doctors (id)
);
