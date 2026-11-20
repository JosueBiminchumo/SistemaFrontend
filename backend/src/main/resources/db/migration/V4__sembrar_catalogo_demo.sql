INSERT INTO users (
    first_name, last_name, email, password_hash, role, active, created_at, updated_at
)
SELECT
    'Lucía', 'Médica Demo', 'demo.cardio@mediturno.invalid',
    '$2a$10$MMflg/17jPK5cTxphMBWG.TCH1k6og3XyYRWX6oIhg79oCA7uDHQK',
    'DOCTOR', TRUE, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6)
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'demo.cardio@mediturno.invalid'
);

INSERT INTO users (
    first_name, last_name, email, password_hash, role, active, created_at, updated_at
)
SELECT
    'Marco', 'Médico Demo', 'demo.general@mediturno.invalid',
    '$2a$10$MMflg/17jPK5cTxphMBWG.TCH1k6og3XyYRWX6oIhg79oCA7uDHQK',
    'DOCTOR', TRUE, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6)
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'demo.general@mediturno.invalid'
);

INSERT INTO specialties (name, description, active, created_at)
SELECT 'Cardiología', 'Especialidad de demostración', TRUE, CURRENT_TIMESTAMP(6)
WHERE NOT EXISTS (
    SELECT 1 FROM specialties WHERE name = 'Cardiología'
);

INSERT INTO specialties (name, description, active, created_at)
SELECT 'Medicina General', 'Especialidad de demostración', TRUE, CURRENT_TIMESTAMP(6)
WHERE NOT EXISTS (
    SELECT 1 FROM specialties WHERE name = 'Medicina General'
);

INSERT INTO doctors (user_id, specialty_id, license_number, biography, active)
SELECT u.id, s.id, 'CMP-DEMO-001', 'Médica de demostración', TRUE
FROM users u
JOIN specialties s ON s.name = 'Cardiología'
WHERE u.email = 'demo.cardio@mediturno.invalid'
  AND NOT EXISTS (
      SELECT 1 FROM doctors WHERE user_id = u.id OR license_number = 'CMP-DEMO-001'
  );

INSERT INTO doctors (user_id, specialty_id, license_number, biography, active)
SELECT u.id, s.id, 'CMP-DEMO-002', 'Médico de demostración', TRUE
FROM users u
JOIN specialties s ON s.name = 'Medicina General'
WHERE u.email = 'demo.general@mediturno.invalid'
  AND NOT EXISTS (
      SELECT 1 FROM doctors WHERE user_id = u.id OR license_number = 'CMP-DEMO-002'
  );

INSERT INTO doctor_schedules (
    doctor_id, day_of_week, start_time, end_time, slot_minutes, active
)
SELECT d.id, days.day_of_week, '08:00:00', '17:00:00', 30, TRUE
FROM doctors d
CROSS JOIN (
    SELECT 'MONDAY' AS day_of_week
    UNION ALL SELECT 'TUESDAY'
    UNION ALL SELECT 'WEDNESDAY'
    UNION ALL SELECT 'THURSDAY'
    UNION ALL SELECT 'FRIDAY'
) days
WHERE d.license_number IN ('CMP-DEMO-001', 'CMP-DEMO-002')
  AND NOT EXISTS (
      SELECT 1
      FROM doctor_schedules existing
      WHERE existing.doctor_id = d.id
        AND existing.day_of_week = days.day_of_week
        AND existing.start_time = '08:00:00'
        AND existing.end_time = '17:00:00'
  );
