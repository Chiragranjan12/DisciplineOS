package com.disciplineos.backend.util;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class FailureReasonConverter implements AttributeConverter<FailureReason, String> {

    @Override
    public String convertToDatabaseColumn(FailureReason attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.name();
    }

    @Override
    public FailureReason convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return null;
        }

        try {
            // Fast path for correct new values (e.g. "Distraction", "External_Issue")
            return FailureReason.valueOf(dbData);
        } catch (IllegalArgumentException e) {
            // Handle corrupted/legacy values in the DB gracefully so it doesn't crash the api
            String upper = dbData.toUpperCase().trim();
            if (upper.contains("OVER") || upper.contains("PLAN")) return FailureReason.Overplanning;
            if (upper.contains("UNDER")) return FailureReason.Unclear_Goal;
            if (upper.contains("EXTERNAL")) return FailureReason.External_Issue;
            if (upper.contains("CLEAR") || upper.contains("GOAL")) return FailureReason.Unclear_Goal;
            if (upper.contains("LAZY")) return FailureReason.Laziness;
            if (upper.contains("FATIGUE")) return FailureReason.Fatigue;
            if (upper.contains("DISTRACT")) return FailureReason.Distraction;

            // If completely unknown, default to null rather than throwing 500
            return null;
        }
    }
}
