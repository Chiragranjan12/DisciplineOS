package com.disciplineos.backend.service;

import com.disciplineos.backend.dto.RadarDataDTO;
import com.disciplineos.backend.dto.SummaryDTO;
import com.disciplineos.backend.dto.WeeklyScoreDTO;
import com.disciplineos.backend.entity.DailyScore;
import com.disciplineos.backend.entity.Habit;
import com.disciplineos.backend.entity.Task;
import com.disciplineos.backend.entity.User;
import com.disciplineos.backend.repository.DailyScoreRepository;
import com.disciplineos.backend.repository.HabitRepository;
import com.disciplineos.backend.repository.TaskRepository;
import com.disciplineos.backend.repository.UserRepository;
import com.disciplineos.backend.util.LifeArea;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.disciplineos.backend.entity.DailyReflection;
import com.disciplineos.backend.repository.DailyReflectionRepository;
import com.disciplineos.backend.util.FailureReason;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final DailyScoreRepository scoreRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final HabitRepository habitRepository;
    private final DailyReflectionRepository reflectionRepository;

    public SummaryDTO getSummary() {
        User user = getCurrentUser();
        LocalDate today = LocalDate.now();

        List<DailyScore> last30Days = scoreRepository.findByUserAndDateBetweenOrderByDateAsc(
                user, today.minusDays(30), today);

        double averageScore = last30Days.stream().mapToInt(DailyScore::getScore).average().orElse(0);

        // Today vs Yesterday
        DailyScore todayScore = scoreRepository.findByUserAndDate(user, today).orElse(null);
        DailyScore yesterdayScore = scoreRepository.findByUserAndDate(user, today.minusDays(1)).orElse(null);

        int scoreChange = 0;
        if (todayScore != null && yesterdayScore != null) {
            scoreChange = todayScore.getScore() - yesterdayScore.getScore();
        }

        // Trend (Last 7 vs Previous 7)
        double last7Avg = last30Days.stream()
                .filter(s -> !s.getDate().isBefore(today.minusDays(6)))
                .mapToInt(DailyScore::getScore).average().orElse(0);

        double prev7Avg = last30Days.stream()
                .filter(s -> s.getDate().isBefore(today.minusDays(6)) && !s.getDate().isBefore(today.minusDays(13)))
                .mapToInt(DailyScore::getScore).average().orElse(0);

        int trend = (int) Math.round(last7Avg - prev7Avg);

        // Fetch today's tasks/habits once — reused by calculateWeakestArea
        List<Task> todayTasks = taskRepository.findByUserAndDate(user, today);
        List<Habit> userHabits  = habitRepository.findByUser(user);

        return SummaryDTO.builder()
                .thirtyDayIndex((int) Math.round(averageScore))
                .trend(trend)
                .scoreChange(scoreChange)
                .alignmentScore(calculateAlignmentScore(todayScore))
                .weakestArea(calculateWeakestArea(todayTasks, userHabits))
                .build();
    }

    /** Returns the last 30 days of scores for the rolling trend chart */
    public List<WeeklyScoreDTO> getRollingScores() {
        User user = getCurrentUser();
        LocalDate today = LocalDate.now();
        List<DailyScore> last30 = scoreRepository.findByUserAndDateBetweenOrderByDateAsc(
                user, today.minusDays(29), today);

        return last30.stream()
                .map(s -> WeeklyScoreDTO.builder().date(s.getDate()).score(s.getScore()).build())
                .collect(Collectors.toList());
    }

    public List<WeeklyScoreDTO> getWeeklyScores() {
        User user = getCurrentUser();
        LocalDate today = LocalDate.now();
        List<DailyScore> last7 = scoreRepository.findByUserAndDateBetweenOrderByDateAsc(
                user, today.minusDays(6), today);

        return last7.stream()
                .map(s -> WeeklyScoreDTO.builder().date(s.getDate()).score(s.getScore()).build())
                .collect(Collectors.toList());
    }

    public List<RadarDataDTO> getRadarData() {
        User user = getCurrentUser();
        LocalDate today = LocalDate.now();
        List<Task> tasks = taskRepository.findByUserAndDate(user, today);
        List<Habit> habits = habitRepository.findByUser(user);

        return java.util.Arrays.stream(LifeArea.values())
                .map(area -> {
                    long totalAreaActions = tasks.stream().filter(t -> t.getLifeArea() == area).count() +
                            habits.stream().filter(h -> h.getLifeArea() == area).count();

                    int completionScore = 0;
                    if (totalAreaActions > 0) {
                        long completed = tasks.stream().filter(t -> t.getLifeArea() == area && t.isCompleted()).count()
                                +
                                habits.stream().filter(h -> h.getLifeArea() == area && h.isCompletedToday()).count();
                        completionScore = (int) Math.round(((double) completed / totalAreaActions) * 100);
                    }

                    return RadarDataDTO.builder()
                            .lifeArea(area.name())
                            .value(completionScore)
                            .fullMark(100)
                            .build();
                })
                .collect(Collectors.toList());
    }

    /** Returns failure reason counts as [{"reason":"Distraction","count":5}, ...] sorted descending */
    public List<Map<String, Object>> getFailureReasons() {
        User user = getCurrentUser();
        List<DailyReflection> reflections = reflectionRepository.findByUser(user);

        // Count occurrences of each FailureReason
        Map<FailureReason, Long> counts = reflections.stream()
                .filter(r -> r.getFailureReason() != null)
                .collect(Collectors.groupingBy(DailyReflection::getFailureReason, Collectors.counting()));

        // Sort descending by count, convert to List<Map> for clean JSON
        return counts.entrySet().stream()
                .sorted(Map.Entry.<FailureReason, Long>comparingByValue().reversed())
                .map(e -> {
                    Map<String, Object> item = new LinkedHashMap<>();
                    // Replace underscores so "External_Issue" → "External Issue" in the UI
                    item.put("reason", e.getKey().name().replace("_", " "));
                    item.put("count", e.getValue());
                    return item;
                })
                .collect(Collectors.toCollection(ArrayList::new));
    }

    private int calculateAlignmentScore(DailyScore score) {
        if (score == null)
            return 0;
        // Simplified alignment: How much of the score survived the penalty?
        double potential = score.getScore() + (score.getPenaltyApplied() != null ? score.getPenaltyApplied() : 0);
        if (potential == 0)
            return 0;
        return (int) Math.round((score.getScore() / potential) * 100);
    }

    /** Finds the life area with the lowest completion % using already-fetched data (no extra DB call) */
    private String calculateWeakestArea(List<Task> tasks, List<Habit> habits) {
        String weakest = "None";
        double lowestPct = Double.MAX_VALUE;

        for (LifeArea area : LifeArea.values()) {
            long total = tasks.stream().filter(t -> t.getLifeArea() == area).count()
                    + habits.stream().filter(h -> h.getLifeArea() == area).count();
            if (total == 0) continue;
            long completed = tasks.stream().filter(t -> t.getLifeArea() == area && t.isCompleted()).count()
                    + habits.stream().filter(h -> h.getLifeArea() == area && h.isCompletedToday()).count();
            double pct = (double) completed / total;
            if (pct < lowestPct) {
                lowestPct = pct;
                weakest = area.name();
            }
        }
        return weakest;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
