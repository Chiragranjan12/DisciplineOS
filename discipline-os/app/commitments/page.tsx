"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { MetricDisplay } from "@/components/ui/MetricDisplay";
import { CheckCircle2, Circle, Activity, Plus } from "lucide-react";
import { getScoreColor, getScoreLabel } from "@/lib/scoreUtils";
import type { LifeArea } from "@/types";

const lifeAreaColors: Record<LifeArea, string> = {
    Health: "#4A7C59",
    Skills: "#C6A75E",
    Career: "#5C7A9A",
    Finance: "#7A6C4A",
    Relationships: "#7A4A6C",
    Mindset: "#4A6C7A",
};

const priorityLabels = {
    high: { label: "High", color: "#C97070" },
    medium: { label: "Med", color: "#C6A75E" },
    low: { label: "Low", color: "#5C5A57" },
};

export default function CommitmentsPage() {
    const {
        tasks,
        habits,
        disciplineScore,
        taskCompletionPercent,
        habitCompletionPercent,
        toggleTask,
        toggleHabit,
        fetchDailyLog,
        addTask,
        addHabit,
    } = useAppStore();

    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskLifeArea, setNewTaskLifeArea] = useState<string>("Skills");
    const [newTaskPriority, setNewTaskPriority] = useState<string>("medium");
    const [newTaskDuration, setNewTaskDuration] = useState<number>(30);
    const [showTaskForm, setShowTaskForm] = useState(false);

    const [newHabitTitle, setNewHabitTitle] = useState("");
    const [newHabitLifeArea, setNewHabitLifeArea] = useState<string>("Health");
    const [newHabitFrequency, setNewHabitFrequency] = useState<string>("daily");
    const [showHabitForm, setShowHabitForm] = useState(false);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        fetchDailyLog(today);
    }, [fetchDailyLog]);

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        await addTask({
            title: newTaskTitle,
            lifeArea: newTaskLifeArea as import("@/types").LifeArea,
            priority: newTaskPriority as import("@/types").Priority,
            plannedDurationMinutes: newTaskDuration,
            date: new Date().toISOString().split('T')[0],
        });
        setNewTaskTitle("");
        setNewTaskLifeArea("Skills");
        setNewTaskPriority("medium");
        setNewTaskDuration(30);
        setShowTaskForm(false);
    };

    const handleAddHabit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newHabitTitle.trim()) return;
        await addHabit({
            title: newHabitTitle,
            lifeArea: newHabitLifeArea as import("@/types").LifeArea,
            targetFrequency: newHabitFrequency as "daily" | "weekly",
        });
        setNewHabitTitle("");
        setNewHabitLifeArea("Health");
        setNewHabitFrequency("daily");
        setShowHabitForm(false);
    };

    const top3 = tasks.filter((t) => t.priority === "high").slice(0, 3);
    const remaining = tasks.filter((t) => !top3.find((p) => p.id === t.id));

    const scoreColor = getScoreColor(disciplineScore);
    const scoreLabel = getScoreLabel(disciplineScore);

    return (
        <div className="max-w-[1080px] mx-auto space-y-5 animate-slide-up">
            {/* Live Score Banner */}
            <div className="flex items-center gap-5 p-4 bg-[#18191C] border border-[#2A2D33] rounded">
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4" style={{ color: scoreColor }} />
                    <span className="text-xs uppercase tracking-widest text-[#5C5A57]">Live Score</span>
                </div>
                <span
                    className="text-3xl font-black tabular-nums leading-none"
                    style={{ color: scoreColor }}
                >
                    {disciplineScore}
                </span>
                <span className="text-xs font-semibold uppercase" style={{ color: scoreColor }}>
                    {scoreLabel}
                </span>
                <div className="ml-auto flex items-center gap-6">
                    <div className="text-center">
                        <div className="text-xs text-[#5C5A57]">Tasks</div>
                        <div className="text-sm font-bold text-[#E8E6E1] tabular-nums">
                            {taskCompletionPercent}%
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-[#5C5A57]">Habits</div>
                        <div className="text-sm font-bold text-[#E8E6E1] tabular-nums">
                            {habitCompletionPercent}%
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                {/* Tasks column */}
                <div className="lg:col-span-3 space-y-4">
                    {/* Top 3 */}
                    <Card>
                        <SectionHeader
                            title="Top Priorities"
                            subtitle="High-impact commitments for today"
                            action={
                                <span className="text-xs text-[#5C5A57]">
                                    {top3.filter((t) => t.completed).length}/{top3.length} done
                                </span>
                            }
                        />
                        <div className="space-y-1">
                            {top3.map((task) => (
                                <button
                                    key={task.id}
                                    onClick={() => toggleTask(task.id)}
                                    className="w-full flex items-start gap-3 p-3 rounded hover:bg-[#1E2024] transition-colors duration-150 text-left group"
                                >
                                    <div className="mt-0.5 shrink-0">
                                        {task.completed ? (
                                            <CheckCircle2 className="w-4 h-4 text-[#4A7C59]" />
                                        ) : (
                                            <Circle className="w-4 h-4 text-[#3A3D43] group-hover:text-[#5C5A57]" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div
                                            className={`text-sm font-medium leading-snug ${task.completed
                                                ? "line-through text-[#5C5A57]"
                                                : "text-[#E8E6E1]"
                                                }`}
                                        >
                                            {task.title}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span
                                                className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                                                style={{
                                                    color: lifeAreaColors[task.lifeArea as LifeArea] || "#5C5A57",
                                                    backgroundColor: `${lifeAreaColors[task.lifeArea as LifeArea] || "#5C5A57"}18`,
                                                }}
                                            >
                                                {task.lifeArea}
                                            </span>
                                            <span
                                                className="text-[10px] font-medium"
                                                style={{ color: priorityLabels[task.priority as keyof typeof priorityLabels]?.color || "#5C5A57" }}
                                            >
                                                {priorityLabels[task.priority as keyof typeof priorityLabels]?.label || task.priority}
                                            </span>
                                            <span className="text-[10px] text-[#3A3D43]">
                                                {task.plannedDurationMinutes}m
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </Card>

                    {/* Other tasks & Quick Add */}
                    <Card>
                        <SectionHeader title="Additional Tasks" />
                        <div className="space-y-1 mb-4">
                            {remaining.map((task) => (
                                <button
                                    key={task.id}
                                    onClick={() => toggleTask(task.id)}
                                    className="w-full flex items-start gap-3 p-3 rounded hover:bg-[#1E2024] transition-colors duration-150 text-left group"
                                >
                                    <div className="mt-0.5 shrink-0">
                                        {task.completed ? (
                                            <CheckCircle2 className="w-4 h-4 text-[#4A7C59]" />
                                        ) : (
                                            <Circle className="w-4 h-4 text-[#3A3D43] group-hover:text-[#5C5A57]" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div
                                            className={`text-sm leading-snug ${task.completed
                                                ? "line-through text-[#5C5A57]"
                                                : "text-[#9A9693]"
                                                }`}
                                        >
                                            {task.title}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span
                                                className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                                                style={{
                                                    color: lifeAreaColors[task.lifeArea as LifeArea] || "#5C5A57",
                                                    backgroundColor: `${lifeAreaColors[task.lifeArea as LifeArea] || "#5C5A57"}18`,
                                                }}
                                            >
                                                {task.lifeArea}
                                            </span>
                                            <span className="text-[10px] text-[#3A3D43]">
                                                {task.plannedDurationMinutes}m
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Add Task Form */}
                        {showTaskForm ? (
                            <form onSubmit={handleAddTask} className="mt-3 space-y-3 p-3 bg-[#111214] border border-[#C6A75E]/20 rounded">
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Task title..."
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    className="w-full bg-[#1E2024] border border-[#2A2D33] rounded px-3 py-2 text-sm text-[#E8E6E1] focus:outline-none focus:border-[#C6A75E]/40 placeholder-[#3A3D43]"
                                />
                                <div className="grid grid-cols-3 gap-2">
                                    {/* Life Area */}
                                    <div>
                                        <label className="text-[10px] uppercase tracking-wider text-[#5C5A57] block mb-1">Life Area</label>
                                        <select
                                            value={newTaskLifeArea}
                                            onChange={(e) => setNewTaskLifeArea(e.target.value)}
                                            className="w-full bg-[#1E2024] border border-[#2A2D33] rounded px-2 py-1.5 text-xs text-[#E8E6E1] focus:outline-none focus:border-[#C6A75E]/40"
                                        >
                                            {["Health","Skills","Career","Finance","Relationships","Mindset"].map(a => (
                                                <option key={a} value={a}>{a}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Priority */}
                                    <div>
                                        <label className="text-[10px] uppercase tracking-wider text-[#5C5A57] block mb-1">Priority</label>
                                        <select
                                            value={newTaskPriority}
                                            onChange={(e) => setNewTaskPriority(e.target.value)}
                                            className="w-full bg-[#1E2024] border border-[#2A2D33] rounded px-2 py-1.5 text-xs text-[#E8E6E1] focus:outline-none focus:border-[#C6A75E]/40"
                                        >
                                            <option value="high">🔴 High</option>
                                            <option value="medium">🟡 Medium</option>
                                            <option value="low">⚪ Low</option>
                                        </select>
                                    </div>
                                    {/* Duration */}
                                    <div>
                                        <label className="text-[10px] uppercase tracking-wider text-[#5C5A57] block mb-1">Duration</label>
                                        <select
                                            value={newTaskDuration}
                                            onChange={(e) => setNewTaskDuration(Number(e.target.value))}
                                            className="w-full bg-[#1E2024] border border-[#2A2D33] rounded px-2 py-1.5 text-xs text-[#E8E6E1] focus:outline-none focus:border-[#C6A75E]/40"
                                        >
                                            {[15,30,45,60,90,120].map(m => (
                                                <option key={m} value={m}>{m} min</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => setShowTaskForm(false)}
                                        className="flex-1 py-1.5 text-xs text-[#5C5A57] hover:text-[#9A9693] border border-[#2A2D33] rounded transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-1.5 text-xs font-bold bg-[#C6A75E] hover:bg-[#D4BC82] text-[#111214] rounded transition-colors"
                                    >
                                        Add Task
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <button
                                onClick={() => setShowTaskForm(true)}
                                className="mt-3 w-full flex items-center gap-2 px-3 py-2 border border-dashed border-[#2A2D33] rounded text-xs text-[#3A3D43] hover:text-[#C6A75E] hover:border-[#C6A75E]/30 transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Add task
                            </button>
                        )}
                    </Card>
                </div>

                {/* Habits column */}
                <div className="lg:col-span-2 space-y-4">
                    <Card>
                        <SectionHeader
                            title="Daily Habits"
                            action={
                                <span className="text-xs text-[#5C5A57]">
                                    {habits.filter((h) => h.completedToday).length}/{habits.length}
                                </span>
                            }
                        />
                        <ProgressBar value={habitCompletionPercent} height="xs" className="mb-5" />
                        <div className="space-y-2 mb-6">
                            {habits.map((habit) => (
                                <button
                                    key={habit.id}
                                    onClick={() => toggleHabit(habit.id)}
                                    className="w-full flex items-center gap-3 p-3 rounded border border-transparent hover:border-[#2A2D33] hover:bg-[#1E2024] transition-colors duration-150 text-left"
                                >
                                    <div
                                        className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-150 ${habit.completedToday
                                            ? "bg-[#4A7C59] border-[#4A7C59]"
                                            : "border-[#3A3D43]"
                                            }`}
                                    >
                                        {habit.completedToday && (
                                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div
                                            className={`text-sm leading-snug ${habit.completedToday
                                                ? "line-through text-[#5C5A57]"
                                                : "text-[#9A9693]"
                                                }`}
                                        >
                                            {habit.title}
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span
                                                className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                                style={{
                                                    color: lifeAreaColors[habit.lifeArea as LifeArea] || "#5C5A57",
                                                    backgroundColor: `${lifeAreaColors[habit.lifeArea as LifeArea] || "#5C5A57"}18`,
                                                }}
                                            >
                                                {habit.lifeArea}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <div className="text-xs text-[#5C5A57]">
                                            {habit.streak}d
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Add Habit Form */}
                        {showHabitForm ? (
                            <form onSubmit={handleAddHabit} className="space-y-3 p-3 bg-[#111214] border border-[#C6A75E]/20 rounded">
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Habit title..."
                                    value={newHabitTitle}
                                    onChange={(e) => setNewHabitTitle(e.target.value)}
                                    className="w-full bg-[#1E2024] border border-[#2A2D33] rounded px-3 py-2 text-sm text-[#E8E6E1] focus:outline-none focus:border-[#C6A75E]/40 placeholder-[#3A3D43]"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-wider text-[#5C5A57] block mb-1">Life Area</label>
                                        <select
                                            value={newHabitLifeArea}
                                            onChange={(e) => setNewHabitLifeArea(e.target.value)}
                                            className="w-full bg-[#1E2024] border border-[#2A2D33] rounded px-2 py-1.5 text-xs text-[#E8E6E1] focus:outline-none focus:border-[#C6A75E]/40"
                                        >
                                            {["Health","Skills","Career","Finance","Relationships","Mindset"].map(a => (
                                                <option key={a} value={a}>{a}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-wider text-[#5C5A57] block mb-1">Frequency</label>
                                        <select
                                            value={newHabitFrequency}
                                            onChange={(e) => setNewHabitFrequency(e.target.value)}
                                            className="w-full bg-[#1E2024] border border-[#2A2D33] rounded px-2 py-1.5 text-xs text-[#E8E6E1] focus:outline-none focus:border-[#C6A75E]/40"
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => setShowHabitForm(false)}
                                        className="flex-1 py-1.5 text-xs text-[#5C5A57] hover:text-[#9A9693] border border-[#2A2D33] rounded transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-1.5 text-xs font-bold bg-[#C6A75E] hover:bg-[#D4BC82] text-[#111214] rounded transition-colors"
                                    >
                                        Add Habit
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <button
                                onClick={() => setShowHabitForm(true)}
                                className="w-full flex items-center gap-2 px-3 py-2 border border-dashed border-[#2A2D33] rounded text-xs text-[#3A3D43] hover:text-[#C6A75E] hover:border-[#C6A75E]/30 transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Add habit
                            </button>
                        )}
                    </Card>

                    {/* Summary metrics */}
                    <div className="grid grid-cols-2 gap-3">
                        <Card>
                            <MetricDisplay
                                label="Completion"
                                value={`${Math.round((taskCompletionPercent * 0.4 + habitCompletionPercent * 0.3) / 0.7)}%`}
                                size="sm"
                                valueColor="#C6A75E"
                            />
                        </Card>
                        <Card>
                            <MetricDisplay
                                label="Remaining"
                                value={tasks.filter((t) => !t.completed).length}
                                unit="tasks"
                                size="sm"
                            />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
