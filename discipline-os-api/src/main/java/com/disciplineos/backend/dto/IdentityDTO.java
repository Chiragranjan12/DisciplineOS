package com.disciplineos.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IdentityDTO {
    private UUID id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private LocalDate targetDate;
    private Double progressPercent;
    private List<UUID> linkedHabitIds;
    private List<UUID> linkedTaskIds;
    private LocalDateTime createdAt;
    private Double healthWeight;
    private Double skillsWeight;
    private Double careerWeight;
    private Double financeWeight;
    private Double relationshipsWeight;
    private Double mindsetWeight;
}
