package com.disciplineos.backend.util;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum FailureReason {
    Overplanning,
    Distraction,
    Laziness,
    External_Issue,
    Unclear_Goal,
    Fatigue;

    /** Accepts both "External_Issue" (enum name) and "External Issue" (display name) */
    @JsonCreator
    public static FailureReason fromValue(String value) {
        if (value == null || value.isBlank()) return null;
        return Arrays.stream(values())
                .filter(r -> r.name().equalsIgnoreCase(value)
                        || r.name().replace("_", " ").equalsIgnoreCase(value))
                .findFirst()
                .orElse(null);
    }

    /** Serializes as display name: "External Issue" instead of "External_Issue" */
    @JsonValue
    public String toDisplayName() {
        return this.name().replace("_", " ");
    }
}
