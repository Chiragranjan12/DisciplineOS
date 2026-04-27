package com.disciplineos.backend.controller;

import com.disciplineos.backend.dto.TaskDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import com.disciplineos.backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks", description = "Task management endpoints")
public class TaskController {

    private final TaskService service;

    @GetMapping
    @Operation(summary = "Get tasks", description = "Retrieves tasks for the current user, optionally filtered by date")
    public ResponseEntity<List<TaskDTO>> getTasks(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(service.getTasksByDate(date));
    }

    @PostMapping
    @Operation(summary = "Create task", description = "Creates a new task for the current user")
    public ResponseEntity<TaskDTO> createTask(@Valid @RequestBody TaskDTO dto) {
        return ResponseEntity.ok(service.createTask(dto));
    }

    @PatchMapping("/{id}/toggle")
    @Operation(summary = "Toggle task completion", description = "Toggles the completion status of a task")
    public ResponseEntity<TaskDTO> toggleTask(@PathVariable UUID id) {
        return ResponseEntity.ok(service.toggleTask(id));
    }
}
