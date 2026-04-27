package com.disciplineos.backend.repository;

import com.disciplineos.backend.entity.DailyScore;
import com.disciplineos.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DailyScoreRepository extends JpaRepository<DailyScore, UUID> {
    Optional<DailyScore> findByUserAndDate(User user, LocalDate date);

    List<DailyScore> findByUserAndDateBetweenOrderByDateAsc(User user, LocalDate startDate, LocalDate endDate);
}
