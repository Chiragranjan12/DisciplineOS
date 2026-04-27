import { create } from "zustand";
import { Habit, DailyReflection, Task, Identity, FailureReason } from "@/types";
import {
    calculateDisciplineScore,
    calculateHabitCompletionPercent,
    calculateTaskCompletionPercent,
} from "@/lib/scoreUtils";
import { identityService, taskService, habitService, dailyLogService, analyticsService } from "@/lib/apiClient";

interface AppState {
    // Data
    tasks: Task[];
    habits: Habit[];
    reflection: DailyReflection;
    identity: Identity;

    // Computed
    disciplineScore: number;
    taskCompletionPercent: number;
    habitCompletionPercent: number;
    reflectionCompleted: boolean;
    thirtyDayIndex: number;
    trend: number;
    scoreChange: number;
    alignmentScore: number;
    weeklyScores: { date: string; score: number }[];
    rollingScores: { date: string; score: number }[];
    radarData: { lifeArea: string; value: number; fullMark: number }[];
    failureReasons: { reason: string; count: number }[];
    planningAccuracy: number;
    normalizedWeights: Record<string, number>;

    // Actions — Tasks
    fetchTasks: (date?: string) => Promise<void>;
    addTask: (task: Partial<Task>) => Promise<void>;
    toggleTask: (id: string) => Promise<void>;

    // Actions — Habits
    fetchHabits: () => Promise<void>;
    addHabit: (habit: Partial<Habit>) => Promise<void>;
    toggleHabit: (id: string) => Promise<void>;

    // Actions — Daily Log & Reflection
    fetchDailyLog: (date: string) => Promise<void>;
    updateReflection: (field: keyof Pick<DailyReflection, "wentWell" | "distracted">, value: string) => void;
    setFailureReason: (reason: FailureReason | null) => void;
    saveReflection: () => Promise<void>;

    // Actions — Identity
    fetchIdentity: () => Promise<void>;
    updateIdentity: (updates: Partial<Identity>) => Promise<void>;

    // Actions — Analytics
    fetchAnalyticsSummary: () => Promise<void>;
    fetchWeeklyScores: () => Promise<void>;
    fetchRollingScores: () => Promise<void>;
    fetchRadarData: () => Promise<void>;
    fetchFailureReasons: () => Promise<void>;
}

function computeScore(
    tasks: Task[],
    habits: Habit[],
    reflectionCompleted: boolean,
    planningAccuracy: number
): { score: number; taskPct: number; habitPct: number } {
    const taskPct = calculateTaskCompletionPercent(tasks);
    const habitPct = calculateHabitCompletionPercent(habits);
    const score = calculateDisciplineScore({
        taskCompletionPercent: taskPct,
        habitCompletionPercent: habitPct,
        reflectionCompleted,
        planningAccuracy,
    });
    return { score, taskPct, habitPct };
}

const PLANNING_ACCURACY = Number(process.env.NEXT_PUBLIC_PLANNING_ACCURACY) || 85;

export const useAppStore = create<AppState>((set, get) => {
    return {
        tasks: [],
        habits: [],
        reflection: {
            id: "1",
            date: new Date().toISOString().split('T')[0],
            wentWell: "",
            distracted: "",
            failureReason: null,
            completedAt: null
        },
        identity: {
            id: "0",
            title: "Loading...",
            description: "Please wait...",
            targetDate: new Date().toISOString().split('T')[0],
            progressPercent: 0,
            linkedHabitIds: [],
            linkedTaskIds: [],
            createdAt: new Date().toISOString(),
            healthWeight: 1,
            skillsWeight: 1,
            careerWeight: 1,
            financeWeight: 1,
            relationshipsWeight: 1,
            mindsetWeight: 1,
        },

        disciplineScore: 0,
        taskCompletionPercent: 0,
        habitCompletionPercent: 0,
        reflectionCompleted: false,
        thirtyDayIndex: 0,
        trend: 0,
        scoreChange: 0,
        alignmentScore: 0,
        weeklyScores: [],
        rollingScores: [],
        radarData: [],
        failureReasons: [],
        planningAccuracy: 85,
        normalizedWeights: {},

        fetchTasks: async (date) => {
            try {
                const { data } = await taskService.list(date);
                set((state) => {
                    const { score, taskPct, habitPct } = computeScore(
                        data,
                        state.habits,
                        state.reflectionCompleted,
                        PLANNING_ACCURACY
                    );
                    return { tasks: data, disciplineScore: score, taskCompletionPercent: taskPct, habitCompletionPercent: habitPct };
                });
            } catch (error) {
                console.error("Failed to fetch tasks:", error);
            }
        },

        addTask: async (task) => {
            try {
                await taskService.create(task);
                get().fetchTasks(task.date);
            } catch (error) {
                console.error("Failed to add task:", error);
            }
        },

        toggleTask: async (id) => {
            const previousTasks = get().tasks;
            // Optimistic update
            const updatedTasks = previousTasks.map((t) =>
                t.id === String(id) ? { ...t, completed: !t.completed } : t
            );
            const { score, taskPct, habitPct } = computeScore(
                updatedTasks,
                get().habits,
                get().reflectionCompleted,
                PLANNING_ACCURACY
            );
            set({ tasks: updatedTasks, disciplineScore: score, taskCompletionPercent: taskPct, habitCompletionPercent: habitPct });

            try {
                await taskService.toggle(id);
            } catch (error) {
                console.error("Failed to toggle task:", error);
                set({ tasks: previousTasks });
            }
        },

        fetchHabits: async () => {
            try {
                const { data } = await habitService.list();
                set((state) => {
                    const { score, taskPct, habitPct } = computeScore(
                        state.tasks,
                        data,
                        state.reflectionCompleted,
                        PLANNING_ACCURACY
                    );
                    return { habits: data, disciplineScore: score, taskCompletionPercent: taskPct, habitCompletionPercent: habitPct };
                });
            } catch (error) {
                console.error("Failed to fetch habits:", error);
            }
        },

        addHabit: async (habit) => {
            try {
                await habitService.create(habit);
                get().fetchHabits();
            } catch (error) {
                console.error("Failed to add habit:", error);
            }
        },

        toggleHabit: async (id) => {
            const previousHabits = get().habits;
            // Optimistic update
            const updatedHabits = previousHabits.map((h) =>
                h.id === String(id) ? { ...h, completedToday: !h.completedToday } : h
            );
            const { score, taskPct, habitPct } = computeScore(
                get().tasks,
                updatedHabits,
                get().reflectionCompleted,
                PLANNING_ACCURACY
            );
            set({ habits: updatedHabits, disciplineScore: score, taskCompletionPercent: taskPct, habitCompletionPercent: habitPct });

            try {
                await habitService.toggle(id);
            } catch (error) {
                console.error("Failed to toggle habit:", error);
                set({ habits: previousHabits });
            }
        },

        fetchDailyLog: async (date) => {
            try {
                const { data } = await dailyLogService.get(date);
                set({
                    tasks: data.tasks,
                    habits: data.habits,
                    reflection: data.reflection || {
                        id: String(Math.random()),
                        date,
                        wentWell: "",
                        distracted: "",
                        failureReason: null,
                        completedAt: null
                    },
                    disciplineScore: data.disciplineScore,
                    taskCompletionPercent: data.taskCompletionPercent,
                    habitCompletionPercent: data.habitCompletionPercent,
                    reflectionCompleted: data.reflectionCompleted,
                    planningAccuracy: data.planningAccuracy,
                    normalizedWeights: data.normalizedWeights
                });
            } catch (error) {
                console.error("Failed to fetch daily log:", error);
            }
        },

        updateReflection: (field, value) =>
            set((state) => ({
                reflection: { ...state.reflection, [field]: value },
            })),

        setFailureReason: (reason) =>
            set((state) => ({
                reflection: { ...state.reflection, failureReason: reason },
            })),

        saveReflection: async () => {
            const state = get();
            const date = state.reflection.date;
            try {
                await dailyLogService.saveReflection(date, state.reflection);
                // Refresh data to get new score
                await get().fetchDailyLog(date);
            } catch (error) {
                console.error("Failed to save reflection:", error);
            }
        },

        fetchIdentity: async () => {
            try {
                const { data } = await identityService.get();
                set((state) => ({
                    identity: { ...state.identity, ...data }
                }));
            } catch (error) {
                console.error("Failed to fetch identity:", error);
            }
        },

        updateIdentity: async (updates) => {
            // Optimistic update
            const previousIdentity = get().identity;
            set((state) => ({
                identity: { ...state.identity, ...updates },
            }));

            try {
                const { data } = await identityService.update(updates);
                set((state) => ({
                    identity: { ...state.identity, ...data }
                }));
            } catch (error) {
                console.error("Failed to update identity:", error);
                // Rollback on failure
                set({ identity: previousIdentity });
            }
        },

        fetchAnalyticsSummary: async () => {
            try {
                const { data } = await analyticsService.getSummary();
                set({
                    thirtyDayIndex: data.thirtyDayIndex,
                    trend: data.trend,
                    scoreChange: data.scoreChange,
                    alignmentScore: data.alignmentScore
                });
            } catch (error) {
                console.error("Failed to fetch analytics summary:", error);
            }
        },

        fetchWeeklyScores: async () => {
            try {
                const { data } = await analyticsService.getWeeklyScores();
                set({ weeklyScores: data });
            } catch (error) {
                console.error("Failed to fetch weekly scores:", error);
            }
        },

        fetchRollingScores: async () => {
            try {
                const { data } = await analyticsService.getRollingScores();
                set({ rollingScores: data });
            } catch (error) {
                console.error("Failed to fetch rolling scores:", error);
            }
        },
        fetchRadarData: async () => {
            try {
                const { data } = await analyticsService.getRadarData();
                set({ radarData: data });
            } catch (error) {
                console.error("Failed to fetch radar data:", error);
            }
        },

        fetchFailureReasons: async () => {
            try {
                const { data } = await analyticsService.getFailureReasons();
                set({ failureReasons: data });
            } catch (error) {
                console.error("Failed to fetch failure reasons:", error);
            }
        },
    };
});
