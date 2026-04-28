package com.disciplineos.backend.controller;

import com.disciplineos.backend.dto.HabitDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import com.disciplineos.backend.service.HabitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/habits")
@RequiredArgsConstructor
@Tag(name = "Habits", description = "Habit tracking endpoints")
public class HabitController {

    private final HabitService service;

    @GetMapping
    @Operation(summary = "Get habits", description = "Retrieves all habits for the current user")
    public ResponseEntity<List<HabitDTO>> getHabits() {
        return ResponseEntity.ok(service.getCurrentUserHabits());
    }

    @PostMapping
    @Operation(summary = "Create habit", description = "Creates a new habit for the current user")
    public ResponseEntity<HabitDTO> createHabit(@Valid @RequestBody HabitDTO dto) {
        return ResponseEntity.ok(service.createHabit(dto));
    }

    @PatchMapping("/{id}/toggle")
    @Operation(summary = "Toggle habit completion", description = "Toggles today's completion status of a habit")
    public ResponseEntity<HabitDTO> toggleHabit(@PathVariable UUID id) {
        return ResponseEntity.ok(service.toggleHabit(id));
    }
}
