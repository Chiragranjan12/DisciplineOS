package com.disciplineos.backend.controller;

import com.disciplineos.backend.dto.DailyLogDTO;
import com.disciplineos.backend.dto.ReflectionDTO;
import com.disciplineos.backend.service.ScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/daily-logs")
@RequiredArgsConstructor
public class DailyLogController {

    private final ScoreService scoreService;

    @GetMapping("/{date}")
    public ResponseEntity<DailyLogDTO> getDailyLog(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(scoreService.getDailyLog(date));
    }

    @PostMapping("/{date}/reflection")
    public ResponseEntity<ReflectionDTO> saveReflection(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestBody ReflectionDTO dto) {
        return ResponseEntity.ok(scoreService.saveReflection(date, dto));
    }
}
