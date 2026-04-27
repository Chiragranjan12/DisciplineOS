package com.disciplineos.backend.repository;

import com.disciplineos.backend.entity.Habit;
import com.disciplineos.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface HabitRepository extends JpaRepository<Habit, UUID> {
    List<Habit> findByUser(User user);
}
