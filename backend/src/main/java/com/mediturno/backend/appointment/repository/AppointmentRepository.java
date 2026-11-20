package com.mediturno.backend.appointment.repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mediturno.backend.appointment.domain.Appointment;
import com.mediturno.backend.appointment.domain.AppointmentStatus;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findAllByPatientUserIdOrderByStartAtDesc(Long userId);

    List<Appointment> findAllByDoctorIdOrderByStartAtDesc(Long doctorId);

    List<Appointment> findAllByOrderByStartAtDesc();

    long countByStartAtGreaterThanEqualAndStartAtLessThan(LocalDateTime from, LocalDateTime to);

    List<Appointment> findAllByDoctorIdAndStatusInAndStartAtLessThanAndEndAtGreaterThan(
            Long doctorId,
            Collection<AppointmentStatus> statuses,
            LocalDateTime requestedEnd,
            LocalDateTime requestedStart);

    @Query(value = """
            select status as label, count(*) as total_count
            from citas
            where start_at >= :from and start_at < :to
            group by status
            order by status
            """, nativeQuery = true)
    List<Object[]> countByStatusBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query(value = """
            select s.name as label, count(*) as total_count
            from citas a
            join doctors d on d.id = a.doctor_id
            join specialties s on s.id = d.specialty_id
            where a.start_at >= :from and a.start_at < :to
            group by s.name
            order by s.name
            """, nativeQuery = true)
    List<Object[]> countBySpecialtyBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query(value = """
            select concat(u.first_name, ' ', u.last_name) as label, count(*) as total_count
            from citas a
            join doctors d on d.id = a.doctor_id
            join users u on u.id = d.user_id
            where a.start_at >= :from and a.start_at < :to
            group by u.first_name, u.last_name
            order by total_count desc
            """, nativeQuery = true)
    List<Object[]> countByDoctorBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query(value = """
            select cast(start_at as date) as label, count(*) as total_count
            from citas
            where start_at >= :from and start_at < :to
            group by cast(start_at as date)
            order by cast(start_at as date)
            """, nativeQuery = true)
    List<Object[]> countByDayBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query("""
            select a from Appointment a
            where a.doctor.id = :doctorId
              and a.status in :statuses
              and a.startAt < :dayEnd
              and a.endAt > :dayStart
            """)
    List<Appointment> findBlockingAppointmentsForDoctorOnDay(
            @Param("doctorId") Long doctorId,
            @Param("statuses") Collection<AppointmentStatus> statuses,
            @Param("dayStart") LocalDateTime dayStart,
            @Param("dayEnd") LocalDateTime dayEnd);
}
