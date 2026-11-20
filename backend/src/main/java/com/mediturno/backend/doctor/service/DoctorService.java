package com.mediturno.backend.doctor.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Clock;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mediturno.backend.appointment.domain.Appointment;
import com.mediturno.backend.appointment.domain.AppointmentStatus;
import com.mediturno.backend.appointment.repository.AppointmentRepository;
import com.mediturno.backend.common.exception.ResourceConflictException;
import com.mediturno.backend.common.exception.ResourceNotFoundException;
import com.mediturno.backend.doctor.domain.Doctor;
import com.mediturno.backend.doctor.domain.DoctorSchedule;
import com.mediturno.backend.doctor.dto.DoctorResponse;
import com.mediturno.backend.doctor.dto.DoctorScheduleResponse;
import com.mediturno.backend.doctor.dto.DoctorScheduleUpdateRequest;
import com.mediturno.backend.doctor.repository.DoctorRepository;
import com.mediturno.backend.doctor.repository.DoctorScheduleRepository;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final DoctorScheduleRepository scheduleRepository;
    private final AppointmentRepository appointmentRepository;
    private final Clock clock;

    public DoctorService(
            DoctorRepository doctorRepository,
            DoctorScheduleRepository scheduleRepository,
            AppointmentRepository appointmentRepository,
            Clock clock) {
        this.doctorRepository = doctorRepository;
        this.scheduleRepository = scheduleRepository;
        this.appointmentRepository = appointmentRepository;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public List<DoctorResponse> list(Long specialtyId) {
        List<Doctor> doctors = specialtyId == null
                ? doctorRepository.findAllByActiveTrueOrderByUserLastNameAscUserFirstNameAsc()
                : doctorRepository.findAllByActiveTrueAndSpecialtyIdOrderByUserLastNameAscUserFirstNameAsc(
                        specialtyId);
        return doctors.stream().map(DoctorResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public DoctorResponse get(Long id) {
        return DoctorResponse.from(findActiveDoctor(id));
    }

    @Transactional(readOnly = true)
    public List<DoctorScheduleResponse> getSchedule(Long doctorId, LocalDate date) {
        findActiveDoctor(doctorId);
        LocalDateTime dayStart = date.atStartOfDay();
        LocalDateTime dayEnd = date.plusDays(1).atStartOfDay();
        List<Appointment> bookings = appointmentRepository.findBlockingAppointmentsForDoctorOnDay(
                doctorId,
                Set.of(AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED),
                dayStart,
                dayEnd);
        LocalDateTime now = LocalDateTime.now(clock);
        return scheduleRepository.findAllByDoctorIdAndDayOfWeekAndActiveTrueOrderByStartTimeAsc(
                        doctorId, date.getDayOfWeek())
                .stream()
                .map(schedule -> {
                    List<LocalTime> availableSlots = new java.util.ArrayList<>();
                    LocalTime slot = schedule.getStartTime();
                    while (!slot.plusMinutes(schedule.getSlotMinutes()).isAfter(schedule.getEndTime())) {
                        LocalDateTime slotStart = LocalDateTime.of(date, slot);
                        LocalDateTime slotEnd = slotStart.plusMinutes(schedule.getSlotMinutes());
                        boolean occupied = bookings.stream().anyMatch(appointment ->
                                appointment.getStartAt().isBefore(slotEnd)
                                        && appointment.getEndAt().isAfter(slotStart));
                        if (slotStart.isAfter(now) && !occupied) {
                            availableSlots.add(slot);
                        }
                        slot = slot.plusMinutes(schedule.getSlotMinutes());
                    }
                    return DoctorScheduleResponse.from(schedule, date, List.copyOf(availableSlots));
                })
                .toList();
    }

    @Transactional
    public void replaceOwnSchedule(String email, List<DoctorScheduleUpdateRequest> requests) {
        Doctor doctor = doctorRepository.findByUserEmail(email)
                .filter(Doctor::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("No existe un perfil activo para este médico."));
        for (int i = 0; i < requests.size(); i++) {
            DoctorScheduleUpdateRequest first = requests.get(i);
            if (!first.startTime().isBefore(first.endTime())) {
                throw new ResourceConflictException("La hora de inicio debe ser anterior a la hora de fin.");
            }
            for (int j = i + 1; j < requests.size(); j++) {
                DoctorScheduleUpdateRequest second = requests.get(j);
                if (first.dayOfWeek() == second.dayOfWeek()
                        && first.startTime().isBefore(second.endTime())
                        && second.startTime().isBefore(first.endTime())) {
                    throw new ResourceConflictException("Los horarios del médico no pueden superponerse.");
                }
            }
        }
        scheduleRepository.deleteAllByDoctorId(doctor.getId());
        scheduleRepository.saveAll(requests.stream()
                .map(request -> new DoctorSchedule(
                        doctor,
                        request.dayOfWeek(),
                        request.startTime(),
                        request.endTime(),
                        request.slotMinutes()))
                .toList());
    }

    private Doctor findActiveDoctor(Long id) {
        return doctorRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("No existe el médico solicitado."));
    }
}
