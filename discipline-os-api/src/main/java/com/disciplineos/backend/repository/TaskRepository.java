package com.disciplineos.backend.repository;

import com.disciplineos.backend.entity.Task;
import com.disciplineos.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findByUserAndDate(User user, LocalDate date);

    List<Task> findByUser(User user);
}
