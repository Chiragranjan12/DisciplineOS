import { DailyLog, DailyReflection, Habit, Identity, RadarDataPoint, Task, User, WeeklyScore } from "@/types";

// ─── User ───────────────────────────────────────────────────────────────────
export const mockUser: User = {
    id: "u-001",
    name: "Marcus Cole",
    primaryIdentity: "High-Performance Software Engineer",
    joinedAt: "2024-01-01",
    timezone: "UTC+5:30",
};

// ─── Identity ───────────────────────────────────────────────────────────────
export const mockIdentity: Identity = {
    id: "id-001",
    title: "High-Performance Software Engineer",
    description:
        "Build deep technical expertise in distributed systems while maintaining disciplined daily output. Ship work that matters. Think in systems, not features.",
    targetDate: "2025-12-31",
    progressPercent: 62,
    linkedHabitIds: ["h-001", "h-002", "h-003"],
    linkedTaskIds: ["t-001", "t-002"],
    createdAt: "2024-01-01",
    healthWeight: 1,
    skillsWeight: 3,
    careerWeight: 3,
    financeWeight: 1,
    relationshipsWeight: 1,
    mindsetWeight: 2,
};

// ─── Habits ─────────────────────────────────────────────────────────────────
export const mockHabits: Habit[] = [
    {
        id: "h-001",
        title: "Deep work session (90 min)",
        lifeArea: "Skills",
        targetFrequency: "daily",
        completedToday: true,
        streak: 12,
        createdAt: "2024-01-01",
    },
    {
        id: "h-002",
        title: "Physical training",
        lifeArea: "Health",
        targetFrequency: "daily",
        completedToday: true,
        streak: 8,
        createdAt: "2024-01-05",
    },
    {
        id: "h-003",
        title: "Read technical material (30 min)",
        lifeArea: "Skills",
        targetFrequency: "daily",
        completedToday: false,
        streak: 0,
        createdAt: "2024-01-05",
    },
    {
        id: "h-004",
        title: "Financial review",
        lifeArea: "Finance",
        targetFrequency: "weekly",
        completedToday: false,
        streak: 3,
        createdAt: "2024-01-10",
    },
    {
        id: "h-005",
        title: "Mindfulness — 10 min",
        lifeArea: "Mindset",
        targetFrequency: "daily",
        completedToday: true,
        streak: 5,
        createdAt: "2024-01-15",
    },
];

// ─── Tasks ──────────────────────────────────────────────────────────────────
export const mockTasks: Task[] = [
    {
        id: "t-001",
        title: "Architect the data pipeline for analytics module",
        lifeArea: "Career",
        priority: "high",
        completed: true,
        date: "2025-02-23",
        plannedDurationMinutes: 120,
        actualDurationMinutes: 130,
    },
    {
        id: "t-002",
        title: "Complete distributed systems chapter 5",
        lifeArea: "Skills",
        priority: "high",
        completed: true,
        date: "2025-02-23",
        plannedDurationMinutes: 60,
        actualDurationMinutes: 55,
    },
    {
        id: "t-003",
        title: "Review investment portfolio allocation",
        lifeArea: "Finance",
        priority: "medium",
        completed: false,
        date: "2025-02-23",
        plannedDurationMinutes: 30,
    },
    {
        id: "t-004",
        title: "Draft quarterly self-performance report",
        lifeArea: "Career",
        priority: "medium",
        completed: false,
        date: "2025-02-23",
        plannedDurationMinutes: 45,
    },
    {
        id: "t-005",
        title: "Plan week's training schedule",
        lifeArea: "Health",
        priority: "low",
        completed: true,
        date: "2025-02-23",
        plannedDurationMinutes: 20,
        actualDurationMinutes: 15,
    },
];

// ─── Top 3 Priorities ────────────────────────────────────────────────────────
export const mockTop3: Task[] = mockTasks
    .filter((t) => t.priority === "high" || t.priority === "medium")
    .slice(0, 3);

// ─── Daily Reflection ───────────────────────────────────────────────────────
export const mockReflection: DailyReflection = {
    id: "r-001",
    date: "2025-02-23",
    wentWell: "",
    distracted: "",
    failureReason: null,
    completedAt: null,
};

// ─── Radar Data ─────────────────────────────────────────────────────────────
export const mockRadarData: RadarDataPoint[] = [
    { lifeArea: "Health", value: 74, fullMark: 100 },
    { lifeArea: "Skills", value: 88, fullMark: 100 },
    { lifeArea: "Career", value: 80, fullMark: 100 },
    { lifeArea: "Finance", value: 58, fullMark: 100 },
    { lifeArea: "Relationships", value: 45, fullMark: 100 },
    { lifeArea: "Mindset", value: 70, fullMark: 100 },
];

// ─── Weekly Scores ───────────────────────────────────────────────────────────
export const mockWeeklyScores: WeeklyScore[] = [
    { date: "2025-02-17", score: 71 },
    { date: "2025-02-18", score: 64 },
    { date: "2025-02-19", score: 78 },
    { date: "2025-02-20", score: 82 },
    { date: "2025-02-21", score: 75 },
    { date: "2025-02-22", score: 60 },
    { date: "2025-02-23", score: 79 },
];

// ─── 30-Day Rolling Scores ────────────────────────────────────────────────────
export const mockRollingScores: { score: number }[] = [
    68, 72, 55, 80, 74, 66, 71, 83, 77, 69, 64, 78, 82, 75, 71, 60, 79, 73, 68,
    81, 74, 70, 65, 77, 80, 72, 69, 75, 79, 79,
].map(s => ({ score: s }));

// ─── Daily Log (Today) ────────────────────────────────────────────────────────
export const mockTodayLog: DailyLog = {
    date: "2025-02-23",
    tasks: mockTasks,
    habits: mockHabits,
    reflection: mockReflection,
    disciplineScore: 79,
    taskCompletionPercent: 60,
    habitCompletionPercent: 60,
    reflectionCompleted: false,
    planningAccuracy: 85,
    normalizedWeights: {
        Health: 1,
        Skills: 1,
        Career: 1,
        Finance: 1,
        Relationships: 1,
        Mindset: 1
    }
};

// ─── Failure Reasons Breakdown ────────────────────────────────────────────────
export const mockFailureReasons: { reason: string; count: number }[] = [
    { reason: "Distraction", count: 8 },
    { reason: "Overplanning", count: 5 },
    { reason: "Laziness", count: 4 },
    { reason: "External Issue", count: 3 },
    { reason: "Fatigue", count: 2 },
    { reason: "Unclear Goal", count: 1 },
];

// ─── Life Area Performance ────────────────────────────────────────────────────
export const mockLifeAreaPerformance: { area: string; avgScore: number; failures: number }[] = [
    { area: "Health", avgScore: 74, failures: 5 },
    { area: "Skills", avgScore: 88, failures: 2 },
    { area: "Career", avgScore: 80, failures: 3 },
    { area: "Finance", avgScore: 58, failures: 8 },
    { area: "Relationships", avgScore: 45, failures: 12 },
    { area: "Mindset", avgScore: 70, failures: 4 },
];
