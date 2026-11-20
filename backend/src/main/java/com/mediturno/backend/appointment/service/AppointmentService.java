package com.mediturno.backend.appointment.service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Clock;
import java.util.List;
import java.util.Set;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mediturno.backend.appointment.domain.Appointment;
import com.mediturno.backend.appointment.domain.AppointmentStatus;
import com.mediturno.backend.appointment.dto.AppointmentRequest;
import com.mediturno.backend.appointment.dto.AppointmentResponse;
import com.mediturno.backend.appointment.repository.AppointmentRepository;
import com.mediturno.backend.common.exception.ResourceConflictException;
import com.mediturno.backend.common.exception.ResourceNotFoundException;
import com.mediturno.backend.doctor.domain.Doctor;
import com.mediturno.backend.doctor.domain.DoctorSchedule;
import com.mediturno.backend.doctor.repository.DoctorRepository;
import com.mediturno.backend.doctor.repository.DoctorScheduleRepository;
import com.mediturno.backend.patient.domain.Patient;
import com.mediturno.backend.patient.repository.PatientRepository;
import com.mediturno.backend.user.domain.UserRole;

@Service
public class AppointmentService {

    private static final Set<AppointmentStatus> BLOCKING_STATUSES =
            Set.of(AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED);

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final DoctorScheduleRepository scheduleRepository;
    private final PatientRepository patientRepository;
    private final Clock clock;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            DoctorRepository doctorRepository,
            DoctorScheduleRepository scheduleRepository,
            PatientRepository patientRepository,
            Clock clock) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.scheduleRepository = scheduleRepository;
        this.patientRepository = patientRepository;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> list(String email, UserRole role) {
        List<Appointment> appointments = switch (role) {
            case ADMIN -> appointmentRepository.findAllByOrderByStartAtDesc();
            case DOCTOR -> doctorRepository.findByUserEmail(email)
                    .map(doctor -> appointmentRepository.findAllByDoctorIdOrderByStartAtDesc(doctor.getId()))
                    .orElseThrow(() -> new ResourceNotFoundException("No existe un perfil para este médico."));
            case PATIENT -> patientRepository.findByUserEmail(email)
                    .map(patient -> appointmentRepository.findAllByPatientUserIdOrderByStartAtDesc(
                            patient.getUserId()))
                    .orElseThrow(() -> new ResourceNotFoundException("No existe un perfil para este paciente."));
        };
        return appointments.stream().map(AppointmentResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public AppointmentResponse get(Long id, String email, UserRole role) {
        return AppointmentResponse.from(authorizedAppointment(id, email, role));
    }

    @Transactional
    public AppointmentResponse create(AppointmentRequest request, String email) {
        Patient patient = patientRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No existe un perfil para este paciente."));
        Doctor doctor = lockDoctor(request.doctorId());
        LocalDateTime endAt = validateSlot(doctor, request.startAt(), null);
        Appointment saved = appointmentRepository.saveAndFlush(
                new Appointment(patient, doctor, request.startAt(), endAt, request.reason().trim()));
        return AppointmentResponse.from(saved);
    }

    @Transactional
    public AppointmentResponse reschedule(Long id, AppointmentRequest request, String email, UserRole role) {
        Appointment appointment = authorizedAppointment(id, email, role);
        ensureReschedulable(appointment);
        Doctor doctor = lockDoctor(request.doctorId());
        LocalDateTime endAt = validateSlot(doctor, request.startAt(), id);
        appointment.reschedule(doctor, request.startAt(), endAt, request.reason().trim());
        return AppointmentResponse.from(appointmentRepository.saveAndFlush(appointment));
    }

    @Transactional
    public AppointmentResponse cancel(Long id, String email, UserRole role) {
        Appointment appointment = authorizedAppointment(id, email, role);
        ensureReschedulable(appointment);
        appointment.cancel();
        return AppointmentResponse.from(appointmentRepository.saveAndFlush(appointment));
    }

    private Appointment authorizedAppointment(Long id, String email, UserRole role) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No existe la cita solicitada."));
        boolean allowed = switch (role) {
            case ADMIN -> true;
            case PATIENT -> appointment.getPatient().getUser().getEmail().equalsIgnoreCase(email);
            case DOCTOR -> appointment.getDoctor().getUser().getEmail().equalsIgnoreCase(email);
        };
        if (!allowed) {
            throw new AccessDeniedException("No tienes permiso para acceder a esta cita.");
        }
        return appointment;
    }

    private Doctor lockDoctor(Long doctorId) {
        return doctorRepository.findActiveByIdForUpdate(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("No existe un médico activo con ese identificador."));
    }

    private LocalDateTime validateSlot(Doctor doctor, LocalDateTime startAt, Long ignoredAppointmentId) {
        LocalDateTime now = LocalDateTime.now(clock);
        if (!startAt.isAfter(now)) {
            throw new ResourceConflictException("No se puede reservar una cita en el pasado.");
        }
        List<DoctorSchedule> schedules = scheduleRepository
                .findAllByDoctorIdAndDayOfWeekAndActiveTrueOrderByStartTimeAsc(
                        doctor.getId(), startAt.getDayOfWeek());
        DoctorSchedule matching = schedules.stream()
                .filter(schedule -> withinSchedule(schedule, startAt))
                .findFirst()
                .orElseThrow(() -> new ResourceConflictException(
                        "El horario solicitado no está dentro de la disponibilidad del médico."));

        LocalDateTime endAt = startAt.plusMinutes(matching.getSlotMinutes());
        if (endAt.toLocalTime().isAfter(matching.getEndTime())) {
            throw new ResourceConflictException("La cita excede el horario disponible.");
        }

        List<Appointment> conflicts = appointmentRepository
                .findAllByDoctorIdAndStatusInAndStartAtLessThanAndEndAtGreaterThan(
                        doctor.getId(), BLOCKING_STATUSES, endAt, startAt);
        if (conflicts.stream().anyMatch(existing -> !existing.getId().equals(ignoredAppointmentId))) {
            throw new ResourceConflictException("El horario solicitado ya está ocupado.");
        }
        return endAt;
    }

    private boolean withinSchedule(DoctorSchedule schedule, LocalDateTime startAt) {
        LocalTime start = startAt.toLocalTime();
        if (start.isBefore(schedule.getStartTime()) || !start.isBefore(schedule.getEndTime())) {
            return false;
        }
        long offsetMinutes = java.time.Duration.between(schedule.getStartTime(), start).toMinutes();
        return offsetMinutes % schedule.getSlotMinutes() == 0
                && start.getSecond() == 0
                && start.getNano() == 0;
    }

    private void ensureReschedulable(Appointment appointment) {
        if (!BLOCKING_STATUSES.contains(appointment.getStatus())) {
            throw new ResourceConflictException("Solo se pueden modificar citas pendientes o confirmadas.");
        }
    }
}
