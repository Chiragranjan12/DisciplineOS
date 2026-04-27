package com.disciplineos.backend.dto;

import com.disciplineos.backend.util.LifeArea;
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
    private String title;
    private LifeArea lifeArea;
    private String priority;
    private boolean completed;
    private Integer plannedDurationMinutes;
    private Integer baseWeight;
    private LocalDate date;
}
