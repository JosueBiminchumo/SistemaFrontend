package com.mediturno.backend.appointment.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.mediturno.backend.appointment.dto.AppointmentRequest;
import com.mediturno.backend.appointment.dto.AppointmentResponse;
import com.mediturno.backend.appointment.dto.AppointmentStatusRequest;
import com.mediturno.backend.appointment.service.AppointmentService;
import com.mediturno.backend.user.domain.User;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public List<AppointmentResponse> list(@AuthenticationPrincipal User user) {
        return appointmentService.list(user.getUsername(), user.getRole());
    }

    @GetMapping("/{id}")
    public AppointmentResponse get(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return appointmentService.get(id, user.getUsername(), user.getRole());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AppointmentResponse create(
            @Valid @RequestBody AppointmentRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return appointmentService.create(request, user.getUsername());
    }

    @PutMapping("/{id}")
    public AppointmentResponse reschedule(
            @PathVariable Long id,
            @Valid @RequestBody AppointmentRequest request,
            @AuthenticationPrincipal User user) {
        return appointmentService.reschedule(id, request, user.getUsername(), user.getRole());
    }

    @PatchMapping("/{id}/cancel")
    public AppointmentResponse cancel(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return appointmentService.cancel(id, user.getUsername(), user.getRole());
    }

    @PatchMapping("/{id}/status")
    public AppointmentResponse updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody AppointmentStatusRequest request,
            @AuthenticationPrincipal User user) {
        return appointmentService.updateStatus(id, request, user.getUsername(), user.getRole());
    }
}
