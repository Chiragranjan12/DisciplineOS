package com.disciplineos.backend.controller;

import com.disciplineos.backend.dto.DailyLogDTO;
import com.disciplineos.backend.dto.ReflectionDTO;
import com.disciplineos.backend.service.ScoreService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/daily-logs")
@RequiredArgsConstructor
@Tag(name = "Daily Logs", description = "Daily discipline tracking and reflection endpoints")
public class DailyLogController {

    private final ScoreService scoreService;

    @GetMapping("/{date}")
    @Operation(summary = "Get daily log", description = "Retrieves the complete daily log including tasks, habits, and score")
    public ResponseEntity<DailyLogDTO> getDailyLog(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(scoreService.getDailyLog(date));
    }

    @PostMapping("/{date}/reflection")
    @Operation(summary = "Save reflection", description = "Saves the daily reflection for the given date")
    public ResponseEntity<ReflectionDTO> saveReflection(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestBody ReflectionDTO dto) {
        return ResponseEntity.ok(scoreService.saveReflection(date, dto));
    }
}
