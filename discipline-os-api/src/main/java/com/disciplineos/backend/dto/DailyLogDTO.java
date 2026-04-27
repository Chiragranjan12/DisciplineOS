package com.disciplineos.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class DailyLogDTO {
    private LocalDate date;
    private List<TaskDTO> tasks;
    private List<HabitDTO> habits;
    private ReflectionDTO reflection;
    private Integer disciplineScore;
    private Integer taskCompletionPercent;
    private Integer habitCompletionPercent;
    private boolean reflectionCompleted;
    private Integer planningAccuracy;
    private Map<String, Double> normalizedWeights;
}
