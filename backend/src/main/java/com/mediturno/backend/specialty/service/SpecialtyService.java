package com.mediturno.backend.specialty.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mediturno.backend.common.exception.ResourceConflictException;
import com.mediturno.backend.common.exception.ResourceNotFoundException;
import com.mediturno.backend.specialty.domain.Specialty;
import com.mediturno.backend.specialty.dto.SpecialtyRequest;
import com.mediturno.backend.specialty.dto.SpecialtyResponse;
import com.mediturno.backend.specialty.repository.SpecialtyRepository;

@Service
public class SpecialtyService {

    private final SpecialtyRepository specialtyRepository;

    public SpecialtyService(SpecialtyRepository specialtyRepository) {
        this.specialtyRepository = specialtyRepository;
    }

    @Transactional(readOnly = true)
    public List<SpecialtyResponse> listActive() {
        return specialtyRepository.findAllByActiveTrueOrderByNameAsc().stream()
                .map(SpecialtyResponse::from)
                .toList();
    }

    @Transactional
    public SpecialtyResponse create(SpecialtyRequest request) {
        String name = request.name().trim();
        ensureNameAvailable(name, null);
        return SpecialtyResponse.from(specialtyRepository.saveAndFlush(
                new Specialty(name, normalizeDescription(request.description()))));
    }

    @Transactional
    public SpecialtyResponse update(Long id, SpecialtyRequest request) {
        Specialty specialty = findById(id);
        String name = request.name().trim();
        ensureNameAvailable(name, id);
        specialty.update(name, normalizeDescription(request.description()));
        return SpecialtyResponse.from(specialtyRepository.saveAndFlush(specialty));
    }

    @Transactional
    public void deactivate(Long id) {
        Specialty specialty = findById(id);
        specialty.deactivate();
    }

    private Specialty findById(Long id) {
        return specialtyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No existe la especialidad solicitada."));
    }

    private void ensureNameAvailable(String name, Long currentId) {
        boolean exists = currentId == null
                ? specialtyRepository.existsByNameIgnoreCase(name)
                : specialtyRepository.existsByNameIgnoreCaseAndIdNot(name, currentId);
        if (exists) {
            throw new ResourceConflictException("Ya existe una especialidad con ese nombre.");
        }
    }

    private String normalizeDescription(String description) {
        return description == null || description.isBlank() ? null : description.trim();
    }
}
