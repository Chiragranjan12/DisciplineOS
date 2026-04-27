// ─────────────────────────────────────────────
// Core domain types for DisciplineOS
// ─────────────────────────────────────────────

export interface User {
    id: string;
    name: string;
    primaryIdentity: string;
    joinedAt: string;
    timezone: string;
}

export interface Identity {
    id: string;
    title: string;
    description: string;
    targetDate: string;
    progressPercent: number;
    linkedHabitIds: string[];
    linkedTaskIds: string[];
    createdAt: string;
    // Life area weights (1 = default, higher = more impact on score)
    healthWeight: number;
    skillsWeight: number;
    careerWeight: number;
    financeWeight: number;
    relationshipsWeight: number;
    mindsetWeight: number;
}

export type LifeArea =
    | "Health"
    | "Skills"
    | "Career"
    | "Finance"
    | "Relationships"
    | "Mindset";

export type Priority = "high" | "medium" | "low";

export interface Task {
    id: string;
    title: string;
    lifeArea: LifeArea;
    priority: Priority;
    completed: boolean;
    date: string; // YYYY-MM-DD
    plannedDurationMinutes: number;
    actualDurationMinutes?: number;
}

export interface Habit {
    id: string;
    title: string;
    lifeArea: LifeArea;
    targetFrequency: "daily" | "weekly";
    completedToday: boolean;
    streak: number;
    createdAt: string;
}

export type FailureReason =
    | "Overplanning"
    | "Distraction"
    | "Laziness"
    | "External Issue"
    | "Unclear Goal"
    | "Fatigue";

export interface DailyReflection {
    id: string;
    date: string; // YYYY-MM-DD
    wentWell: string;
    distracted: string;
    failureReason: FailureReason | null;
    completedAt: string | null;
}

export interface DailyLog {
    date: string; // YYYY-MM-DD
    tasks: Task[];
    habits: Habit[];
    reflection: DailyReflection | null;
    disciplineScore: number;
    taskCompletionPercent: number;
    habitCompletionPercent: number;
    reflectionCompleted: boolean;
    planningAccuracy: number;
    normalizedWeights: Record<LifeArea, number>;
}

export interface Summary {
    thirtyDayIndex: number;
    trend: number;
    weakestArea: string;
    alignmentScore: number;
    scoreChange: number;
}

export interface RadarDataPoint {
    lifeArea: string;
    value: number;
    fullMark: number;
}

export interface WeeklyScore {
    date: string; // YYYY-MM-DD
    score: number;
}
