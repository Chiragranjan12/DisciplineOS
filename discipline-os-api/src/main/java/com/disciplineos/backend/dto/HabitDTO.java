package com.disciplineos.backend.dto;

import com.disciplineos.backend.util.LifeArea;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HabitDTO {
    private UUID id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Life area is required")
    private LifeArea lifeArea;

    @NotBlank(message = "Target frequency is required")
    private String targetFrequency;

    private boolean completedToday;
    private Integer streak;

    @Positive(message = "Base weight must be positive")
    private Integer baseWeight;

    private LocalDateTime createdAt;
}
