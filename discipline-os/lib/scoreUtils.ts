import { LifeArea, Task, Habit } from "@/types";

export interface ScoreComponents {
    taskCompletionPercent: number; // 0–100
    habitCompletionPercent: number; // 0–100
    reflectionCompleted: boolean;
    planningAccuracy: number;
}

export function calculateDisciplineScore(components: ScoreComponents): number {
    const { taskCompletionPercent, habitCompletionPercent, reflectionCompleted, planningAccuracy } =
        components;

    const score =
        taskCompletionPercent * 0.4 +
        habitCompletionPercent * 0.3 +
        (reflectionCompleted ? 100 : 0) * 0.2 +
        planningAccuracy * 0.1;

    return Math.round(Math.min(100, Math.max(0, score)));
}

export function calculateTaskCompletionPercent(tasks: { completed: boolean }[]): number {
    if (!tasks.length) return 0;
    const done = tasks.filter((t) => t.completed).length;
    return Math.round((done / tasks.length) * 100);
}

export function calculateHabitCompletionPercent(
    habits: { completedToday: boolean }[]
): number {
    if (!habits.length) return 0;
    const done = habits.filter((h) => h.completedToday).length;
    return Math.round((done / habits.length) * 100);
}

export function getMomentum(currentScore: number, previousScore: number): "up" | "down" | "flat" {
    if (currentScore > previousScore) return "up";
    if (currentScore < previousScore) return "down";
    return "flat";
}

export function getScoreLabel(score: number): string {
    if (score >= 85) return "Elite";
    if (score >= 70) return "Strong";
    if (score >= 55) return "Moderate";
    if (score >= 40) return "Below Target";
    return "Critical";
}

export function getScoreColor(score: number): string {
    if (score >= 85) return "#C6A75E";
    if (score >= 70) return "#4A7C59";
    if (score >= 55) return "#8B6F2E";
    return "#8B3A3A";
}


export function getRadarInterpretation(radarData: { lifeArea: string; value: number }[]): string {
    if (!radarData.length) return "";

    const sorted = [...radarData].sort((a, b) => b.value - a.value);
    const top = sorted[0];
    const bottom = sorted[sorted.length - 1];

    if (top.value === 0) return "No effort recorded across life areas today.";

    let text = `Effort today concentrated on ${top.lifeArea}`;
    if (bottom.value < 20 && bottom.lifeArea !== top.lifeArea) {
        text += `; ${bottom.lifeArea} received minimal focus.`;
    } else {
        text += ". Balance is maintained across active areas.";
    }

    return text;
}

export function getRollingAverage(data: { score: number }[], windowSize: number = 7): number {
    if (!data.length) return 0;
    const slice = data.slice(-windowSize);
    const sum = slice.reduce((acc, d) => acc + d.score, 0);
    return Math.round(sum / slice.length);
}
