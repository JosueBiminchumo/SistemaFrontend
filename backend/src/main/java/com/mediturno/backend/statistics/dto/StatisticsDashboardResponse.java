package com.mediturno.backend.statistics.dto;

import java.time.LocalDate;

public record StatisticsDashboardResponse(
        LocalDate from,
        LocalDate to,
        long appointments,
        long patients,
        long doctors,
        long specialties) {
}
