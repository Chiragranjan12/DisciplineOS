package com.disciplineos.backend.repository;

import com.disciplineos.backend.entity.DailyReflection;
import com.disciplineos.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DailyReflectionRepository extends JpaRepository<DailyReflection, UUID> {
    Optional<DailyReflection> findByUserAndDate(User user, LocalDate date);
    List<DailyReflection> findByUser(User user);
}
