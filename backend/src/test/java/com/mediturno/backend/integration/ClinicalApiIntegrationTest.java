package com.mediturno.backend.integration;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mediturno.backend.appointment.repository.AppointmentRepository;
import com.mediturno.backend.auth.security.JwtService;
import com.mediturno.backend.doctor.repository.DoctorRepository;
import com.mediturno.backend.doctor.repository.DoctorScheduleRepository;
import com.mediturno.backend.patient.domain.Patient;
import com.mediturno.backend.patient.repository.PatientRepository;
import com.mediturno.backend.specialty.domain.Specialty;
import com.mediturno.backend.specialty.repository.SpecialtyRepository;
import com.mediturno.backend.user.domain.User;
import com.mediturno.backend.user.domain.UserRole;
import com.mediturno.backend.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ClinicalApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private SpecialtyRepository specialtyRepository;
    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private DoctorScheduleRepository scheduleRepository;
    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private JwtService jwtService;

    private User admin;
    private User patientUser;
    private User doctorUser;
    private long doctorId;
    private long specialtyId;
    private LocalDate appointmentDate;
    private String doctorToken;
    private String patientToken;
    private String adminToken;

    @BeforeEach
    void setUp() {
        appointmentRepository.deleteAll();
        scheduleRepository.deleteAll();
        doctorRepository.deleteAll();
        patientRepository.deleteAll();
        specialtyRepository.deleteAll();
        userRepository.deleteAll();

        admin = saveUser("admin@mediturno.test", UserRole.ADMIN);
        patientUser = saveUser("patient@mediturno.test", UserRole.PATIENT);
        doctorUser = saveUser("doctor@mediturno.test", UserRole.DOCTOR);
        jdbcTemplate.update(
                "insert into patients (user_id, document_number, birth_date, phone, created_at, updated_at) "
                        + "values (?, ?, ?, ?, current_timestamp, current_timestamp)",
                patientUser.getId(), "12345678", LocalDate.of(1990, 1, 1), "999999999");
        Specialty specialty = specialtyRepository.save(new Specialty("Cardiología", "Corazón"));
        specialtyId = specialty.getId();
        jdbcTemplate.update(
                "insert into doctors (user_id, specialty_id, license_number, biography, active) "
                        + "values (?, ?, ?, ?, ?)",
                doctorUser.getId(), specialty.getId(), "CMP-12345", "Especialista", true);
        doctorId = doctorRepository.findByUserEmail(doctorUser.getUsername()).orElseThrow().getId();
        appointmentDate = LocalDate.now().plusDays(2);
        jdbcTemplate.update(
                "insert into doctor_schedules (doctor_id, day_of_week, start_time, end_time, slot_minutes, active) "
                        + "values (?, ?, ?, ?, ?, ?)",
                doctorId,
                appointmentDate.getDayOfWeek().name(),
                LocalTime.of(9, 0),
                LocalTime.of(12, 0),
                30,
                true);

        adminToken = jwtService.generateToken(admin);
        patientToken = jwtService.generateToken(patientUser);
        doctorToken = jwtService.generateToken(doctorUser);
    }

    @Test
    void specialtyWritesRequireAdminAndAppointmentSlotsCannotBeDoubleBooked() throws Exception {
        mockMvc.perform(get("/api/v1/specialties"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Cardiología"));

        mockMvc.perform(post("/api/v1/specialties")
                        .header("Authorization", bearer(patientToken))
                        .contentType("application/json")
                        .content("""
                                {"name":"Neurología","description":"Sistema nervioso"}
                                """))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/v1/doctors")
                        .param("specialtyId", Long.toString(specialtyId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].firstName").value("doctor"));
        mockMvc.perform(get("/api/v1/doctors/{id}/schedule", doctorId)
                        .param("date", appointmentDate.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].availableSlots[0]").value("09:00:00"));

        String request = objectMapper.writeValueAsString(new AppointmentPayload(
                doctorId, appointmentDate.atTime(9, 0), "Consulta de control"));
        mockMvc.perform(post("/api/v1/appointments")
                        .header("Authorization", bearer(patientToken))
                        .contentType("application/json")
                        .content(request))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("PENDING"));

        mockMvc.perform(post("/api/v1/appointments")
                        .header("Authorization", bearer(patientToken))
                        .contentType("application/json")
                        .content(request))
                .andExpect(status().isConflict());

        mockMvc.perform(get("/api/v1/appointments")
                        .header("Authorization", bearer(doctorToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].patientName").value("patient patient"));

        mockMvc.perform(get("/api/v1/doctors/{id}/schedule", doctorId)
                        .param("date", appointmentDate.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].availableSlots[0]").value("09:30:00"));

        mockMvc.perform(get("/api/v1/statistics/dashboard")
                        .header("Authorization", bearer(adminToken))
                        .param("from", appointmentDate.toString())
                        .param("to", appointmentDate.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.appointments").value(1));
        mockMvc.perform(get("/api/v1/statistics/dashboard")
                        .header("Authorization", bearer(patientToken))
                        .param("from", appointmentDate.toString())
                        .param("to", appointmentDate.toString()))
                .andExpect(status().isForbidden());
        mockMvc.perform(get("/api/v1/statistics/appointments")
                        .header("Authorization", bearer(adminToken))
                        .param("groupBy", "status")
                        .param("from", appointmentDate.toString())
                        .param("to", appointmentDate.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.values[0].label").value("PENDING"));
        mockMvc.perform(get("/api/v1/statistics/dashboard")
                        .header("Authorization", bearer(adminToken))
                        .param("from", appointmentDate.toString())
                        .param("to", appointmentDate.minusDays(1).toString()))
                .andExpect(status().isBadRequest());
    }

    @Test
    void doctorCanPersistAppointmentStatusTransitions() throws Exception {
        String request = objectMapper.writeValueAsString(new AppointmentPayload(
                doctorId, appointmentDate.atTime(9, 0), "Consulta de control"));
        var created = mockMvc.perform(post("/api/v1/appointments")
                        .header("Authorization", bearer(patientToken))
                        .contentType("application/json")
                        .content(request))
                .andExpect(status().isCreated())
                .andReturn();
        long appointmentId = objectMapper.readTree(created.getResponse().getContentAsString())
                .get("id").asLong();

        mockMvc.perform(patch("/api/v1/appointments/{id}/status", appointmentId)
                        .header("Authorization", bearer(doctorToken))
                        .contentType("application/json")
                        .content("{\"status\":\"CONFIRMED\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONFIRMED"));

        mockMvc.perform(patch("/api/v1/appointments/{id}/status", appointmentId)
                        .header("Authorization", bearer(doctorToken))
                        .contentType("application/json")
                        .content("{\"status\":\"COMPLETED\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"));

        mockMvc.perform(patch("/api/v1/appointments/{id}/status", appointmentId)
                        .header("Authorization", bearer(doctorToken))
                        .contentType("application/json")
                        .content("{\"status\":\"CONFIRMED\"}"))
                .andExpect(status().isConflict());
    }

    @Test
    void doctorScheduleManagementRequiresAuthenticationAndReadsPersistedSchedule() throws Exception {
        mockMvc.perform(get("/api/v1/doctors/me/schedule"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/v1/doctors/me/schedule")
                        .header("Authorization", bearer(doctorToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].dayOfWeek").value(appointmentDate.getDayOfWeek().name()))
                .andExpect(jsonPath("$[0].startTime").value("09:00:00"));
    }

    @Test
    void specialtiesCanBeCreatedAndDeactivatedByAdmin() throws Exception {
        mockMvc.perform(post("/api/v1/specialties")
                        .header("Authorization", bearer(adminToken))
                        .contentType("application/json")
                        .content("""
                                {"name":"Neurología","description":"Sistema nervioso"}
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.active").value(true));

        long specialtyId = specialtyRepository.findAll().stream()
                .filter(specialty -> specialty.getName().equals("Neurología"))
                .findFirst().orElseThrow().getId();

        mockMvc.perform(patch("/api/v1/specialties/{id}", specialtyId)
                        .header("Authorization", bearer(adminToken)))
                .andExpect(status().isMethodNotAllowed());
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                        .delete("/api/v1/specialties/{id}", specialtyId)
                        .header("Authorization", bearer(adminToken)))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/v1/specialties"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.name == 'Neurología')]").doesNotExist());
    }

    private User saveUser(String email, UserRole role) {
        return userRepository.save(User.create(
                email.substring(0, email.indexOf('@')),
                "patient",
                email,
                "$2a$10$abcdefghijklmnopqrstuv",
                role,
                true));
    }

    private String bearer(String token) {
        return "Bearer " + token;
    }

    private record AppointmentPayload(long doctorId, LocalDateTime startAt, String reason) {
    }
}
