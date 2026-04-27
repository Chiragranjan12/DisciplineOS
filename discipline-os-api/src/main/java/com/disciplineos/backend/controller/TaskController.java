package com.disciplineos.backend.controller;

import com.disciplineos.backend.dto.TaskDTO;
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
public class TaskController {

    private final TaskService service;

    @GetMapping
    public ResponseEntity<List<TaskDTO>> getTasks(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(service.getTasksByDate(date));
    }

    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@RequestBody TaskDTO dto) {
        return ResponseEntity.ok(service.createTask(dto));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<TaskDTO> toggleTask(@PathVariable UUID id) {
        return ResponseEntity.ok(service.toggleTask(id));
    }
}
