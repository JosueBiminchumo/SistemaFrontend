package com.mediturno.backend.doctor.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mediturno.backend.doctor.dto.DoctorResponse;
import com.mediturno.backend.doctor.dto.DoctorScheduleEntryResponse;
import com.mediturno.backend.doctor.dto.DoctorScheduleResponse;
import com.mediturno.backend.doctor.dto.DoctorScheduleUpdateRequest;
import com.mediturno.backend.doctor.service.DoctorService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    public List<DoctorResponse> list(@RequestParam(required = false) Long specialtyId) {
        return doctorService.list(specialtyId);
    }

    @GetMapping("/{id}")
    public DoctorResponse get(@PathVariable Long id) {
        return doctorService.get(id);
    }

    @GetMapping("/{id}/schedule")
    public List<DoctorScheduleResponse> schedule(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return doctorService.getSchedule(id, date);
    }

    @GetMapping("/me/schedule")
    public List<DoctorScheduleEntryResponse> ownSchedule(@AuthenticationPrincipal UserDetails user) {
        return doctorService.getOwnSchedule(user.getUsername());
    }

    @PutMapping("/me/schedule")
    public void replaceOwnSchedule(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody List<@Valid DoctorScheduleUpdateRequest> requests) {
        doctorService.replaceOwnSchedule(user.getUsername(), requests);
    }
}
