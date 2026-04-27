package com.disciplineos.backend.controller;

import com.disciplineos.backend.dto.HabitDTO;
import java.util.UUID;
import com.disciplineos.backend.service.HabitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/habits")
@RequiredArgsConstructor
public class HabitController {

    private final HabitService service;

    @GetMapping
    public ResponseEntity<List<HabitDTO>> getHabits() {
        return ResponseEntity.ok(service.getCurrentUserHabits());
    }

    @PostMapping
    public ResponseEntity<HabitDTO> createHabit(@RequestBody HabitDTO dto) {
        return ResponseEntity.ok(service.createHabit(dto));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<HabitDTO> toggleHabit(@PathVariable UUID id) {
        return ResponseEntity.ok(service.toggleHabit(id));
    }
}
