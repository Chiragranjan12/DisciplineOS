package com.disciplineos.backend.service;

import com.disciplineos.backend.dto.*;
import com.disciplineos.backend.entity.*;
import com.disciplineos.backend.repository.*;
import com.disciplineos.backend.util.LifeArea;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScoreService {

    private final TaskRepository taskRepository;
    private final HabitRepository habitRepository;
    private final DailyReflectionRepository reflectionRepository;
    private final UserRepository userRepository;
    private final DailyScoreRepository scoreRepository;
    private final IdentityService identityService;

    @Transactional
    public DailyLogDTO getDailyLog(LocalDate date) {
        User user = getCurrentUser();
        List<Task> tasks = taskRepository.findByUserAndDate(user, date);
        List<Habit> habits = habitRepository.findByUser(user);
        Optional<DailyReflection> reflectionOpt = reflectionRepository.findByUserAndDate(user, date);
        Map<LifeArea, Double> weights = identityService.getNormalizedWeights(user);

        int taskPct = calculateTaskCompletionPercent(tasks);
        int habitPct = calculateHabitCompletionPercent(habits);
        boolean reflectionCompleted = reflectionOpt.isPresent();
        int planningAccuracy = calculatePlanningAccuracy(tasks);

        ScoreResult result = calculateWeightedScore(tasks, habits, weights, reflectionCompleted, planningAccuracy);

        // Persist/Update score
        DailyScore dailyScore = scoreRepository.findByUserAndDate(user, date)
                .orElse(DailyScore.builder().user(user).date(date).build());

        dailyScore.setScore(result.score);
        dailyScore.setTaskCompletionPercent(taskPct);
        dailyScore.setHabitCompletionPercent(habitPct);
        dailyScore.setPlanningAccuracy(planningAccuracy);
        dailyScore.setReflectionCompleted(reflectionCompleted);

        // Snapshot Weights
        dailyScore.setHealthWeight(weights.get(LifeArea.Health));
        dailyScore.setSkillsWeight(weights.get(LifeArea.Skills));
        dailyScore.setCareerWeight(weights.get(LifeArea.Career));
        dailyScore.setFinanceWeight(weights.get(LifeArea.Finance));
        dailyScore.setRelationshipsWeight(weights.get(LifeArea.Relationships));
        dailyScore.setMindsetWeight(weights.get(LifeArea.Mindset));
        dailyScore.setPenaltyApplied(result.penalty);

        scoreRepository.save(dailyScore);

        return DailyLogDTO.builder()
                .date(date)
                .tasks(tasks.stream().map(this::mapToTaskDTO).collect(Collectors.toList()))
                .habits(habits.stream().map(this::mapToHabitDTO).collect(Collectors.toList()))
                .reflection(reflectionOpt.map(this::mapToReflectionDTO).orElse(null))
                .disciplineScore(result.score)
                .taskCompletionPercent(taskPct)
                .habitCompletionPercent(habitPct)
                .reflectionCompleted(reflectionCompleted)
                .planningAccuracy(planningAccuracy)
                .normalizedWeights(weights.entrySet().stream()
                        .collect(Collectors.toMap(e -> e.getKey().name(), Map.Entry::getValue)))
                .build();
    }

    @Transactional
    public ReflectionDTO saveReflection(LocalDate date, ReflectionDTO dto) {
        User user = getCurrentUser();
        DailyReflection reflection = reflectionRepository.findByUserAndDate(user, date)
                .orElse(new DailyReflection());

        reflection.setDate(date);
        reflection.setUser(user);
        reflection.setWentWell(dto.getWentWell());
        reflection.setDistracted(dto.getDistracted());
        reflection.setFailureReason(dto.getFailureReason());
        reflection.setCompletedAt(LocalDateTime.now());

        return mapToReflectionDTO(reflectionRepository.save(reflection));
    }

    private static class ScoreResult {
        int score;
        double penalty;

        ScoreResult(int score, double penalty) {
            this.score = score;
            this.penalty = penalty;
        }
    }

    private ScoreResult calculateWeightedScore(List<Task> tasks, List<Habit> habits, Map<LifeArea, Double> weights,
            boolean reflectionCompleted, int planningAccuracy) {
        double totalWeightedPotential = 0;
        double earnedWeightedPoints = 0;

        for (Task task : tasks) {
            double weightArea = weights.getOrDefault(task.getLifeArea(), 1.0);
            double weightAction = (task.getBaseWeight() != null ? task.getBaseWeight() : 1);
            double totalWeight = weightArea * weightAction;

            totalWeightedPotential += 100 * totalWeight;
            if (task.isCompleted()) {
                earnedWeightedPoints += 100 * totalWeight;
            }
        }

        for (Habit habit : habits) {
            double weightArea = weights.getOrDefault(habit.getLifeArea(), 1.0);
            double weightAction = (habit.getBaseWeight() != null ? habit.getBaseWeight() : 1);
            double totalWeight = weightArea * weightAction;

            totalWeightedPotential += 100 * totalWeight;
            if (habit.isCompletedToday()) {
                earnedWeightedPoints += 100 * totalWeight;
            }
        }

        if (totalWeightedPotential == 0)
            return new ScoreResult(0, 0);

        double productivityScore = (earnedWeightedPoints / totalWeightedPotential) * 100;
        double baseScore = (productivityScore * 0.9) + (planningAccuracy * 0.1);

        if (reflectionCompleted)
            baseScore += 5; // Reflection bonus

        // Proportional Balance Penalty
        double rawPenalty = 0;
        for (Map.Entry<LifeArea, Double> entry : weights.entrySet()) {
            LifeArea area = entry.getKey();
            Double areaWeight = entry.getValue();

            // Only penalize if it's a priority area (normalized weight > 1.0)
            if (areaWeight > 1.0) {
                long totalInArea = tasks.stream().filter(t -> t.getLifeArea() == area).count() +
                        habits.stream().filter(h -> h.getLifeArea() == area).count();

                if (totalInArea > 0) {
                    long completedInArea = tasks.stream().filter(t -> t.getLifeArea() == area && t.isCompleted())
                            .count() +
                            habits.stream().filter(h -> h.getLifeArea() == area && h.isCompletedToday()).count();

                    if (completedInArea == 0) {
                        rawPenalty += areaWeight * 5; // Proportional penalty
                    }
                }
            }
        }

        double penaltyToApply = Math.min(rawPenalty, 25.0); // Capped at 25 points
        int finalScore = (int) Math.max(0, Math.min(100, Math.round(baseScore - penaltyToApply)));

        return new ScoreResult(finalScore, penaltyToApply);
    }

    private int calculatePlanningAccuracy(List<Task> tasks) {
        if (tasks.isEmpty())
            return 100;
        return 85;
    }

    private int calculateTaskCompletionPercent(List<Task> tasks) {
        if (tasks.isEmpty())
            return 0;
        long completedCount = tasks.stream().filter(Task::isCompleted).count();
        return (int) Math.round((double) completedCount / tasks.size() * 100);
    }

    private int calculateHabitCompletionPercent(List<Habit> habits) {
        if (habits.isEmpty())
            return 0;
        long completedCount = habits.stream().filter(Habit::isCompletedToday).count();
        return (int) Math.round((double) completedCount / habits.size() * 100);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private TaskDTO mapToTaskDTO(Task task) {
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

    private HabitDTO mapToHabitDTO(Habit habit) {
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

    private ReflectionDTO mapToReflectionDTO(DailyReflection reflection) {
        return ReflectionDTO.builder()
                .id(reflection.getId())
                .wentWell(reflection.getWentWell())
                .distracted(reflection.getDistracted())
                .failureReason(reflection.getFailureReason())
                .completedAt(reflection.getCompletedAt())
                .build();
    }
}
