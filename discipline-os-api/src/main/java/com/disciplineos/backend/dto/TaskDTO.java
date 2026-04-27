package com.disciplineos.backend.dto;

import com.disciplineos.backend.util.LifeArea;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {
    private UUID id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Life area is required")
    private LifeArea lifeArea;

    @NotBlank(message = "Priority is required")
    private String priority;

    private boolean completed;

    @Positive(message = "Planned duration must be positive")
    private Integer plannedDurationMinutes;

    @Positive(message = "Base weight must be positive")
    private Integer baseWeight;

    @NotNull(message = "Date is required")
    private LocalDate date;
}
