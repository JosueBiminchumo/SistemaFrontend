package com.mediturno.backend.statistics.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mediturno.backend.appointment.repository.AppointmentRepository;
import com.mediturno.backend.common.exception.InvalidRequestException;
import com.mediturno.backend.doctor.repository.DoctorRepository;
import com.mediturno.backend.patient.repository.PatientRepository;
import com.mediturno.backend.specialty.repository.SpecialtyRepository;
import com.mediturno.backend.statistics.dto.AppointmentSeriesResponse;
import com.mediturno.backend.statistics.dto.StatisticsDashboardResponse;

@Service
public class StatisticsService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final SpecialtyRepository specialtyRepository;

    public StatisticsService(
            AppointmentRepository appointmentRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            SpecialtyRepository specialtyRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.specialtyRepository = specialtyRepository;
    }

    @Transactional(readOnly = true)
    public StatisticsDashboardResponse dashboard(LocalDate from, LocalDate to) {
        validateRange(from, to);
        return new StatisticsDashboardResponse(
                from,
                to,
                appointmentRepository.countByStartAtGreaterThanEqualAndStartAtLessThan(
                        from.atStartOfDay(), to.plusDays(1).atStartOfDay()),
                patientRepository.count(),
                doctorRepository.countByActiveTrue(),
                specialtyRepository.countByActiveTrue());
    }

    @Transactional(readOnly = true)
    public AppointmentSeriesResponse appointments(String grouping, LocalDate from, LocalDate to) {
        validateRange(from, to);
        String normalizedGrouping = grouping == null ? "day" : grouping.toLowerCase(Locale.ROOT);
        LocalDateTime fromDateTime = from.atStartOfDay();
        LocalDateTime toDateTime = to.plusDays(1).atStartOfDay();
        List<Object[]> rows = switch (normalizedGrouping) {
            case "day" -> appointmentRepository.countByDayBetween(fromDateTime, toDateTime);
            case "status" -> appointmentRepository.countByStatusBetween(fromDateTime, toDateTime);
            case "specialty" -> appointmentRepository.countBySpecialtyBetween(fromDateTime, toDateTime);
            case "doctor" -> appointmentRepository.countByDoctorBetween(fromDateTime, toDateTime);
            default -> throw new InvalidRequestException(
                    "groupBy debe ser day, status, specialty o doctor.");
        };
        List<AppointmentSeriesResponse.SeriesValue> values = rows.stream()
                .map(row -> new AppointmentSeriesResponse.SeriesValue(
                        String.valueOf(row[0]), ((Number) row[1]).longValue()))
                .toList();
        return new AppointmentSeriesResponse(normalizedGrouping, from, to, values);
    }

    private void validateRange(LocalDate from, LocalDate to) {
        if (from == null || to == null || from.isAfter(to)) {
            throw new InvalidRequestException("El rango de fechas es inválido.");
        }
    }
}
