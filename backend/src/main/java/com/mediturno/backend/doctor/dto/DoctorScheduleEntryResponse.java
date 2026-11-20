package com.mediturno.backend.doctor.dto;

import java.time.DayOfWeek;
import java.time.LocalTime;

import com.mediturno.backend.doctor.domain.DoctorSchedule;

public record DoctorScheduleEntryResponse(
        Long id,
        DayOfWeek dayOfWeek,
        LocalTime startTime,
        LocalTime endTime,
        int slotMinutes) {

    public static DoctorScheduleEntryResponse from(DoctorSchedule schedule) {
        return new DoctorScheduleEntryResponse(
                schedule.getId(),
                schedule.getDayOfWeek(),
                schedule.getStartTime(),
                schedule.getEndTime(),
                schedule.getSlotMinutes());
    }
}
