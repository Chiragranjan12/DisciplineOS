package com.disciplineos.backend.dto;

import com.disciplineos.backend.util.LifeArea;
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
    private String title;
    private LifeArea lifeArea;
    private String targetFrequency;
    private boolean completedToday;
    private Integer streak;
    private Integer baseWeight;
    private LocalDateTime createdAt;
}
