package com.disciplineos.backend.service;

import com.disciplineos.backend.dto.HabitDTO;
import com.disciplineos.backend.entity.Habit;
import com.disciplineos.backend.entity.User;
import com.disciplineos.backend.repository.HabitRepository;
import com.disciplineos.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HabitService {

    private final HabitRepository repository;
    private final UserRepository userRepository;

    public List<HabitDTO> getCurrentUserHabits() {
        User user = getCurrentUser();
        return repository.findByUser(user)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public HabitDTO createHabit(HabitDTO dto) {
        User user = getCurrentUser();
        Habit habit = Habit.builder()
                .title(dto.getTitle())
                .lifeArea(dto.getLifeArea())
                .targetFrequency(dto.getTargetFrequency())
                .completedToday(false)
                .streak(0)
                .baseWeight(dto.getBaseWeight() != null ? dto.getBaseWeight() : 1)
                .user(user)
                .build();

        return mapToDTO(repository.save(habit));
    }

    @Transactional
    public HabitDTO toggleHabit(UUID id) {
        User user = getCurrentUser();
        Habit habit = repository.findById(id)
                .filter(h -> h.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Habit not found"));

        habit.setCompletedToday(!habit.isCompletedToday());
        return mapToDTO(repository.save(habit));
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    private HabitDTO mapToDTO(Habit habit) {
        return HabitDTO.builder()
                .id(habit.getId())
                .title(habit.getTitle())
                .lifeArea(habit.getLifeArea())
                .targetFrequency(habit.getTargetFrequency())
                .completedToday(habit.isCompletedToday())
                .streak(habit.getStreak())
                .baseWeight(habit.getBaseWeight())
                .createdAt(habit.getCreatedAt())
                .build();
    }
}
