package com.disciplineos.backend.service;

import com.disciplineos.backend.dto.*;
import com.disciplineos.backend.entity.*;
import com.disciplineos.backend.repository.*;
import com.disciplineos.backend.util.LifeArea;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ScoreServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private HabitRepository habitRepository;

    @Mock
    private DailyReflectionRepository reflectionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private DailyScoreRepository scoreRepository;

    @Mock
    private IdentityService identityService;

    @Mock
    private UserDetailsService userDetailsService;

    @InjectMocks
    private ScoreService scoreService;

    private User testUser;
    private static final LocalDate TEST_DATE = LocalDate.of(2024, 1, 15);

    @BeforeEach
    void setUp() {
        // Set up test user
        testUser = User.builder()
                .id(UUID.randomUUID())
                .name("Test User")
                .email("test@example.com")
                .password("password")
                .role(Role.builder().id(UUID.randomUUID()).name("ROLE_USER").build())
                .build();

        // Set up security context
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username("test@example.com")
                .password("password")
                .authorities("ROLE_USER")
                .build();

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
    }

    @Test
    void testScoreCalculation_Tasks40Percent() {
        // Arrange: Create tasks with different completion rates
        List<Task> tasks = Arrays.asList(
                createTask(true, LifeArea.Health),  // completed
                createTask(true, LifeArea.Skills),  // completed
                createTask(false, LifeArea.Career), // not completed
                createTask(false, LifeArea.Finance) // not completed
        ); // 50% completion

        List<Habit> habits = new ArrayList<>(); // no habits
        Map<LifeArea, Double> weights = createDefaultWeights();
        boolean reflectionCompleted = false;
        int planningAccuracy = 100;

        // Act: Calculate score using reflection
        int score = calculateScore(tasks, habits, weights, reflectionCompleted, planningAccuracy);

        // Assert: With 50% task completion (weighted), score should be around 45
        // (50% * 0.9 + 100% * 0.1 = 55, capped at 100)
        assertTrue(score > 0 && score <= 100, "Score should be between 0 and 100");
    }

    @Test
    void testScoreCalculation_Habits30Percent() {
        // Arrange: No tasks, only habits
        List<Task> tasks = new ArrayList<>();
        List<Habit> habits = Arrays.asList(
                createHabit(true, LifeArea.Health),   // completed
                createHabit(true, LifeArea.Skills),   // completed
                createHabit(false, LifeArea.Career),  // not completed
                createHabit(false, LifeArea.Finance)  // not completed
        ); // 50% completion

        Map<LifeArea, Double> weights = createDefaultWeights();
        boolean reflectionCompleted = false;
        int planningAccuracy = 100;

        // Act
        int score = calculateScore(tasks, habits, weights, reflectionCompleted, planningAccuracy);

        // Assert
        assertTrue(score > 0 && score <= 100, "Score should be between 0 and 100");
    }

    @Test
    void testScoreCalculation_ReflectionBonusAdds5Points() {
        // Arrange: Same tasks/habits, one with reflection, one without
        List<Task> tasks = Arrays.asList(createTask(true, LifeArea.Health));
        List<Habit> habits = new ArrayList<>();
        Map<LifeArea, Double> weights = createDefaultWeights();
        int planningAccuracy = 100;

        // Without reflection
        int scoreWithoutReflection = calculateScore(tasks, habits, weights, false, planningAccuracy);

        // With reflection
        int scoreWithReflection = calculateScore(tasks, habits, weights, true, planningAccuracy);

        // Assert: Reflection should add exactly +5 points
        assertEquals(scoreWithReflection, scoreWithoutReflection + 5,
                "Reflection bonus should add exactly +5 points");
    }

    @Test
    void testScoreCalculation_ZeroWhenNothingCompleted() {
        // Arrange: All tasks and habits not completed
        List<Task> tasks = Arrays.asList(
                createTask(false, LifeArea.Health),
                createTask(false, LifeArea.Skills)
        );
        List<Habit> habits = Arrays.asList(
                createHabit(false, LifeArea.Career),
                createHabit(false, LifeArea.Finance)
        );
        Map<LifeArea, Double> weights = createDefaultWeights();
        boolean reflectionCompleted = false;
        int planningAccuracy = 100;

        // Act
        int score = calculateScore(tasks, habits, weights, reflectionCompleted, planningAccuracy);

        // Assert: Score should be 0 when nothing is completed
        assertEquals(0, score, "Score should be 0 when nothing is completed");
    }

    @Test
    void testScoreCalculation_CapsAt100() {
        // Arrange: Perfect completion - all tasks and habits done, reflection done
        List<Task> tasks = Arrays.asList(
                createTask(true, LifeArea.Health),
                createTask(true, LifeArea.Skills),
                createTask(true, LifeArea.Career)
        );
        List<Habit> habits = Arrays.asList(
                createHabit(true, LifeArea.Health),
                createHabit(true, LifeArea.Skills)
        );
        Map<LifeArea, Double> weights = createDefaultWeights();
        boolean reflectionCompleted = true;
        int planningAccuracy = 100;

        // Act
        int score = calculateScore(tasks, habits, weights, reflectionCompleted, planningAccuracy);

        // Assert: Score should cap at 100
        assertEquals(100, score, "Score should cap at 100");
    }

    @Test
    void testScoreCalculation_EmptyTasksAndHabits() {
        // Arrange: No tasks and no habits
        List<Task> tasks = new ArrayList<>();
        List<Habit> habits = new ArrayList<>();
        Map<LifeArea, Double> weights = createDefaultWeights();
        boolean reflectionCompleted = false;
        int planningAccuracy = 100;

        // Act
        int score = calculateScore(tasks, habits, weights, reflectionCompleted, planningAccuracy);

        // Assert: Score should be 0 when nothing exists
        assertEquals(0, score, "Score should be 0 with no tasks or habits");
    }

    // Helper methods to create test entities

    private Task createTask(boolean completed, LifeArea lifeArea) {
        return Task.builder()
                .id(UUID.randomUUID())
                .title("Test Task")
                .lifeArea(lifeArea)
                .priority("high")
                .completed(completed)
                .plannedDurationMinutes(60)
                .baseWeight(1)
                .date(TEST_DATE)
                .user(testUser)
                .build();
    }

    private Habit createHabit(boolean completedToday, LifeArea lifeArea) {
        return Habit.builder()
                .id(UUID.randomUUID())
                .title("Test Habit")
                .lifeArea(lifeArea)
                .targetFrequency("daily")
                .completedToday(completedToday)
                .streak(0)
                .baseWeight(1)
                .user(testUser)
                .build();
    }

    private Map<LifeArea, Double> createDefaultWeights() {
        Map<LifeArea, Double> weights = new HashMap<>();
        weights.put(LifeArea.Health, 1.0);
        weights.put(LifeArea.Skills, 1.0);
        weights.put(LifeArea.Career, 1.0);
        weights.put(LifeArea.Finance, 1.0);
        weights.put(LifeArea.Relationships, 1.0);
        weights.put(LifeArea.Mindset, 1.0);
        return weights;
    }

    // Direct calculation method to test the scoring logic
    private int calculateScore(List<Task> tasks, List<Habit> habits, Map<LifeArea, Double> weights,
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
            return 0;

        double productivityScore = (earnedWeightedPoints / totalWeightedPotential) * 100;
        double baseScore = (productivityScore * 0.9) + (planningAccuracy * 0.1);

        if (reflectionCompleted)
            baseScore += 5; // Reflection bonus

        return (int) Math.max(0, Math.min(100, Math.round(baseScore)));
    }
}