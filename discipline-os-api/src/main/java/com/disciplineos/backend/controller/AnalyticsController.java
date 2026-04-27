package com.disciplineos.backend.controller;

import com.disciplineos.backend.dto.RadarDataDTO;
import com.disciplineos.backend.dto.SummaryDTO;
import com.disciplineos.backend.dto.WeeklyScoreDTO;
import com.disciplineos.backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/summary")
    public ResponseEntity<SummaryDTO> getSummary() {
        return ResponseEntity.ok(analyticsService.getSummary());
    }

    @GetMapping("/weekly-scores")
    public ResponseEntity<List<WeeklyScoreDTO>> getWeeklyScores() {
        return ResponseEntity.ok(analyticsService.getWeeklyScores());
    }

    @GetMapping("/radar-data")
    public ResponseEntity<List<RadarDataDTO>> getRadarData() {
        return ResponseEntity.ok(analyticsService.getRadarData());
    }

    @GetMapping("/rolling-scores")
    public ResponseEntity<List<WeeklyScoreDTO>> getRollingScores() {
        return ResponseEntity.ok(analyticsService.getRollingScores());
    }

    @GetMapping("/failure-reasons")
    public ResponseEntity<List<Map<String, Object>>> getFailureReasons() {
        return ResponseEntity.ok(analyticsService.getFailureReasons());
    }
}
