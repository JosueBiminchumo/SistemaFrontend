package com.mediturno.backend.doctor.dto;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.mediturno.backend.doctor.domain.DoctorSchedule;

public record DoctorScheduleResponse(
        Long id,
        LocalDate date,
        DayOfWeek dayOfWeek,
        LocalTime startTime,
        LocalTime endTime,
        int slotMinutes,
        List<LocalTime> availableSlots) {

    public static DoctorScheduleResponse from(
            DoctorSchedule schedule, LocalDate date, List<LocalTime> availableSlots) {
        return new DoctorScheduleResponse(
                schedule.getId(),
                date,
                schedule.getDayOfWeek(),
                schedule.getStartTime(),
                schedule.getEndTime(),
                schedule.getSlotMinutes(),
                availableSlots);
    }
}
