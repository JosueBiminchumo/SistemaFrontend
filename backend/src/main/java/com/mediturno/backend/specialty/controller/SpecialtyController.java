package com.mediturno.backend.specialty.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.mediturno.backend.specialty.dto.SpecialtyRequest;
import com.mediturno.backend.specialty.dto.SpecialtyResponse;
import com.mediturno.backend.specialty.service.SpecialtyService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/specialties")
public class SpecialtyController {

    private final SpecialtyService specialtyService;

    public SpecialtyController(SpecialtyService specialtyService) {
        this.specialtyService = specialtyService;
    }

    @GetMapping
    public List<SpecialtyResponse> list() {
        return specialtyService.listActive();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SpecialtyResponse create(@Valid @RequestBody SpecialtyRequest request) {
        return specialtyService.create(request);
    }

    @PutMapping("/{id}")
    public SpecialtyResponse update(@PathVariable Long id, @Valid @RequestBody SpecialtyRequest request) {
        return specialtyService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deactivate(@PathVariable Long id) {
        specialtyService.deactivate(id);
    }
}
