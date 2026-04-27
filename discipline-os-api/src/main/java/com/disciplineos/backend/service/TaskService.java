package com.disciplineos.backend.service;

import com.disciplineos.backend.dto.TaskDTO;
import com.disciplineos.backend.entity.Task;
import com.disciplineos.backend.entity.User;
import com.disciplineos.backend.repository.TaskRepository;
import java.util.UUID;
import com.disciplineos.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository repository;
    private final UserRepository userRepository;

    public List<TaskDTO> getTasksByDate(LocalDate date) {
        User user = getCurrentUser();
        return repository.findByUserAndDate(user, date != null ? date : LocalDate.now())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskDTO createTask(TaskDTO dto) {
        User user = getCurrentUser();
        Task task = Task.builder()
                .title(dto.getTitle())
                .lifeArea(dto.getLifeArea())
                .priority(dto.getPriority())
                .completed(false)
                .plannedDurationMinutes(dto.getPlannedDurationMinutes())
                .baseWeight(dto.getBaseWeight() != null ? dto.getBaseWeight() : 1)
                .date(dto.getDate() != null ? dto.getDate() : LocalDate.now())
                .user(user)
                .build();

        return mapToDTO(repository.save(task));
    }

    @Transactional
    public TaskDTO toggleTask(UUID id) {
        User user = getCurrentUser();
        Task task = repository.findById(id)
                .filter(t -> t.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setCompleted(!task.isCompleted());
        return mapToDTO(repository.save(task));
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    private TaskDTO mapToDTO(Task task) {
        return TaskDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .lifeArea(task.getLifeArea())
                .priority(task.getPriority())
                .completed(task.isCompleted())
                .plannedDurationMinutes(task.getPlannedDurationMinutes())
                .baseWeight(task.getBaseWeight())
                .date(task.getDate())
                .build();
    }
}
