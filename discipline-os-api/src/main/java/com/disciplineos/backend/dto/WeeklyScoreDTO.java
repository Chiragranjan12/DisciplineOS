package com.disciplineos.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class WeeklyScoreDTO {
    private LocalDate date;
    private Integer score;
}
