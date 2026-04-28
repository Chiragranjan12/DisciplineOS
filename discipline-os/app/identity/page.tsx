"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { Target, Edit3, X, Check } from "lucide-react";
import type { LifeArea } from "@/types";

// ─── Life area config ────────────────────────────────────────────────
const LIFE_AREAS: { key: keyof typeof WEIGHT_KEYS; label: LifeArea; color: string; emoji: string }[] = [
    { key: "healthWeight",        label: "Health",        color: "#4A7C59", emoji: "🏃" },
    { key: "skillsWeight",        label: "Skills",        color: "#C6A75E", emoji: "🧠" },
    { key: "careerWeight",        label: "Career",        color: "#5C7A9A", emoji: "💼" },
    { key: "financeWeight",       label: "Finance",       color: "#7A6C4A", emoji: "💰" },
    { key: "relationshipsWeight", label: "Relationships", color: "#7A4A6C", emoji: "🤝" },
    { key: "mindsetWeight",       label: "Mindset",       color: "#4A6C7A", emoji: "🧘" },
];

// Lookup used only for TypeScript key typing
const WEIGHT_KEYS = {
    healthWeight: true,
    skillsWeight: true,
    careerWeight: true,
    financeWeight: true,
    relationshipsWeight: true,
    mindsetWeight: true,
};

type WeightKey = keyof typeof WEIGHT_KEYS;

type Weights = Record<WeightKey, number>;

function getWeightLabel(v: number) {
    if (v <= 1) return "Low";
    if (v === 2) return "Normal";
    if (v === 3) return "Important";
    if (v === 4) return "Priority";
    return "Critical";
}

function getWeightColor(v: number) {
    if (v <= 1) return "#3A3D43";
    if (v === 2) return "#5C5A57";
    if (v === 3) return "#C6A75E";
    if (v === 4) return "#4A7C59";
    return "#8B3A3A";
}

export default function IdentityPage() {
    const { identity, habits, updateIdentity, fetchIdentity } = useAppStore();
    const [isEditing, setIsEditing] = useState(false);

    const [editTitle, setEditTitle]               = useState(identity.title);
    const [editDescription, setEditDescription]   = useState(identity.description);
    const [editTargetDate, setEditTargetDate]      = useState(identity.targetDate);
    const [weights, setWeights] = useState<Weights>({
        healthWeight:        identity.healthWeight        ?? 1,
        skillsWeight:        identity.skillsWeight        ?? 1,
        careerWeight:        identity.careerWeight        ?? 1,
        financeWeight:       identity.financeWeight       ?? 1,
        relationshipsWeight: identity.relationshipsWeight ?? 1,
        mindsetWeight:       identity.mindsetWeight       ?? 1,
    });

    useEffect(() => {
        fetchIdentity();
    }, [fetchIdentity]);

    // Sync local state when store identity loads
    useEffect(() => {
        setEditTitle(identity.title);
        setEditDescription(identity.description);
        setEditTargetDate(identity.targetDate);
        setWeights({
            healthWeight:        identity.healthWeight        ?? 1,
            skillsWeight:        identity.skillsWeight        ?? 1,
            careerWeight:        identity.careerWeight        ?? 1,
            financeWeight:       identity.financeWeight       ?? 1,
            relationshipsWeight: identity.relationshipsWeight ?? 1,
            mindsetWeight:       identity.mindsetWeight       ?? 1,
        });
    }, [identity]);

    async function handleSave() {
        await updateIdentity({
            title:       editTitle,
            description: editDescription,
            targetDate:  editTargetDate,
            ...weights,
        });
        setIsEditing(false);
    }

    function handleCancel() {
        setEditTitle(identity.title);
        setEditDescription(identity.description);
        setEditTargetDate(identity.targetDate);
        setWeights({
            healthWeight:        identity.healthWeight        ?? 1,
            skillsWeight:        identity.skillsWeight        ?? 1,
            careerWeight:        identity.careerWeight        ?? 1,
            financeWeight:       identity.financeWeight       ?? 1,
            relationshipsWeight: identity.relationshipsWeight ?? 1,
            mindsetWeight:       identity.mindsetWeight       ?? 1,
        });
        setIsEditing(false);
    }

    const linkedHabits = habits.filter((h) =>
        identity.linkedHabitIds?.includes(h.id) ?? false
    );

    const daysLeft = Math.max(
        0,
        Math.floor(
            (new Date(identity.targetDate || Date.now()).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
    );

    return (
        <div className="flex flex-col h-full w-full p-6 gap-6">
            {/* ── Identity Statement Card ─────────────────────────────── */}
            <Card className="flex-1">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-[#1F1A11] border border-[#8B7241]/30 rounded flex items-center justify-center shrink-0 mt-0.5">
                            <Target className="w-5 h-5 text-[#C6A75E]" />
                        </div>
                        {isEditing ? (
                            <div className="flex-1 min-w-0 space-y-3">
                                <input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="text-lg font-bold bg-[#1E2024] border border-[#C6A75E]/40 rounded px-3 py-2 w-full text-[#E8E6E1] focus:outline-none"
                                    placeholder="Your primary identity..."
                                />
                                <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    className="text-sm bg-[#1E2024] border border-[#2A2D33] rounded px-3 py-2 w-full text-[#9A9693] resize-none focus:outline-none focus:border-[#C6A75E]/40"
                                    rows={4}
                                    placeholder="Describe your identity statement..."
                                />
                                <div>
                                    <label className="text-xs text-[#5C5A57] block mb-1">Target Date</label>
                                    <input
                                        type="date"
                                        value={editTargetDate}
                                        onChange={(e) => setEditTargetDate(e.target.value)}
                                        className="text-sm bg-[#1E2024] border border-[#2A2D33] rounded px-3 py-2 w-auto text-[#9A9693] focus:outline-none focus:border-[#C6A75E]/40"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 min-w-0">
                                {identity.title ? (
                                    <>
                                        <h2 className="text-xl font-bold text-[#E8E6E1] leading-snug">
                                            {identity.title}
                                        </h2>
                                        <p className="text-sm text-[#9A9693] mt-2 leading-relaxed">
                                            {identity.description}
                                        </p>
                                    </>
                                ) : (
                                    <div className="py-2">
                                        <h2 className="text-lg font-medium text-[#5C5A57] leading-snug">
                                            No identity set yet
                                        </h2>
                                        <p className="text-sm text-[#3A3D43] mt-1 leading-relaxed">
                                            Click Edit to define who you want to become
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="shrink-0">
                        {isEditing ? (
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={handleCancel}>
                                    <X className="w-3.5 h-3.5" />
                                </Button>
                                <Button size="sm" onClick={handleSave}>
                                    <Check className="w-3.5 h-3.5" />
                                    Save
                                </Button>
                            </div>
                        ) : (
                            <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                                <Edit3 className="w-3.5 h-3.5" />
                                Edit
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            {/* ── Life Area Weights ────────────────────────────────────── */}
            <Card className="flex-1">
                <SectionHeader
                    title="Life Area Priorities"
                    subtitle={isEditing ? "Drag each slider to set how much each area impacts your score" : "How much each area affects your Discipline Score"}
                />

                <div className="space-y-4 mt-2">
                    {LIFE_AREAS.map(({ key, label, color, emoji }) => {
                        const value = isEditing ? weights[key] : (identity[key] ?? 1);
                        const weightLabel = getWeightLabel(value);
                        const labelColor  = getWeightColor(value);

                        return (
                            <div key={key}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-base">{emoji}</span>
                                        <span className="text-sm font-medium text-[#E8E6E1]">{label}</span>
                                    </div>
                                    <span
                                        className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                                        style={{ color: labelColor, backgroundColor: `${labelColor}18` }}
                                    >
                                        {weightLabel}
                                    </span>
                                </div>

                                {isEditing ? (
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-[#3A3D43] w-4 text-center">1</span>
                                        <input
                                            type="range"
                                            min={1}
                                            max={5}
                                            step={1}
                                            value={weights[key]}
                                            onChange={(e) =>
                                                setWeights((prev) => ({
                                                    ...prev,
                                                    [key]: Number(e.target.value),
                                                }))
                                            }
                                            className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                                            style={{ accentColor: color }}
                                        />
                                        <span className="text-xs text-[#3A3D43] w-4 text-center">5</span>
                                        <span
                                            className="text-sm font-bold w-4 text-center tabular-nums"
                                            style={{ color }}
                                        >
                                            {weights[key]}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="relative h-1.5 bg-[#1E2024] rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                width: `${((value - 1) / 4) * 100}%`,
                                                backgroundColor: color,
                                                opacity: 0.8,
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {!isEditing && (
                    <p className="text-xs text-[#3A3D43] mt-5 border-t border-[#1E2024] pt-3">
                        Click <span className="text-[#5C5A57] font-medium">Edit</span> on the identity card above to adjust these priorities.
                    </p>
                )}
            </Card>

            {/* ── Progress Card ────────────────────────────────────────── */}
            <Card>
                <SectionHeader title="Identity Progress" />
                <div className="flex items-end gap-4 mb-4">
                    <span className="text-5xl font-black text-[#C6A75E] tabular-nums leading-none">
                        {identity.progressPercent}
                    </span>
                    <span className="text-lg text-[#5C5A57] mb-0.5">%</span>
                    <div className="ml-auto text-right">
                        <div className="text-xs text-[#5C5A57]">Target</div>
                        <div className="text-sm font-medium text-[#9A9693]">
                            {new Date(identity.targetDate || Date.now()).toLocaleDateString("en-US", {
                                month: "short",
                                day:   "numeric",
                                year:  "numeric",
                            })}
                        </div>
                    </div>
                </div>
                <ProgressBar value={identity.progressPercent} height="md" showLabel={false} />
                <div className="mt-3 text-xs text-[#5C5A57]">
                    {daysLeft} days remaining to target date
                </div>
            </Card>

            {/* ── Supporting Habits ────────────────────────────────────── */}
            <Card>
                <SectionHeader
                    title="Supporting Habits"
                    subtitle="Daily behaviors that reinforce this identity"
                />
                <div className="space-y-2">
                    {linkedHabits.length === 0 ? (
                        <p className="text-xs text-[#3A3D43] italic">
                            No habits linked to this identity yet.
                        </p>
                    ) : linkedHabits.map((habit) => (
                        <div
                            key={habit.id}
                            className="flex items-center justify-between py-3 border-b border-[#1E2024] last:border-0"
                        >
                            <div>
                                <div className="text-sm text-[#E8E6E1]">{habit.title}</div>
                                <div className="text-xs text-[#5C5A57] mt-0.5">
                                    {habit.lifeArea} · {habit.targetFrequency}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <div className="text-xs text-[#5C5A57]">Streak</div>
                                    <div className="text-sm font-semibold text-[#C6A75E]">{habit.streak}d</div>
                                </div>
                                <div
                                    className={`w-2 h-2 rounded-full ${habit.completedToday ? "bg-[#4A7C59]" : "bg-[#2A2D33]"}`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* ── Stats Row ────────────────────────────────────────────── */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="text-center">
                    <div className="text-[10px] uppercase tracking-widest text-[#5C5A57] mb-2">Linked Habits</div>
                    <div className="text-2xl font-bold text-[#E8E6E1]">{linkedHabits.length}</div>
                </Card>
                <Card className="text-center">
                    <div className="text-[10px] uppercase tracking-widest text-[#5C5A57] mb-2">Active Since</div>
                    <div className="text-sm font-semibold text-[#9A9693]">
                        {new Date(identity.createdAt || Date.now()).toLocaleDateString("en-US", {
                            month: "short",
                            year:  "numeric",
                        })}
                    </div>
                </Card>
                <Card className="text-center">
                    <div className="text-[10px] uppercase tracking-widest text-[#5C5A57] mb-2">Days Left</div>
                    <div className="text-2xl font-bold text-[#E8E6E1]">{daysLeft}</div>
                </Card>
            </div>
        </div>
    );
}
