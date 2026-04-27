package com.disciplineos.backend.dto;

import com.disciplineos.backend.util.FailureReason;
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
public class ReflectionDTO {
    private UUID id;
    private String wentWell;
    private String distracted;
    private FailureReason failureReason;
    private LocalDateTime completedAt;
}
