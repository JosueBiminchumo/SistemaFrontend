package com.mediturno.backend.doctor.repository;

import java.time.DayOfWeek;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mediturno.backend.doctor.domain.DoctorSchedule;

public interface DoctorScheduleRepository extends JpaRepository<DoctorSchedule, Long> {

    List<DoctorSchedule> findAllByDoctorIdAndDayOfWeekAndActiveTrueOrderByStartTimeAsc(
            Long doctorId, DayOfWeek dayOfWeek);

    List<DoctorSchedule> findAllByDoctorIdAndActiveTrueOrderByDayOfWeekAscStartTimeAsc(Long doctorId);

    void deleteAllByDoctorId(Long doctorId);
}
