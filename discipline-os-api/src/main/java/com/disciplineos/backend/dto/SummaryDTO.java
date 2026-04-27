package com.disciplineos.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SummaryDTO {
    private Integer thirtyDayIndex;
    private Integer trend;
    private String weakestArea;
    private Integer alignmentScore;
    private Integer scoreChange;
}
