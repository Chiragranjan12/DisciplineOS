package com.disciplineos.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RadarDataDTO {
    private String lifeArea;
    private Integer value;
    private Integer fullMark;
}
