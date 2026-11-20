package com.mediturno.backend.statistics.dto;

import java.time.LocalDate;
import java.util.List;

public record AppointmentSeriesResponse(
        String groupBy,
        LocalDate from,
        LocalDate to,
        List<SeriesValue> values) {

    public record SeriesValue(String label, long value) {
    }
}
