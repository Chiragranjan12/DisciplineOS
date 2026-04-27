"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import type { FailureReason } from "@/types";
import { CheckCircle2 } from "lucide-react";

const failureReasons: FailureReason[] = [
    "Distraction",
    "Fatigue",
    "Laziness",
    "Overplanning",
    "External Issue",
    "Unclear Goal",
];

export default function ReflectionPage() {
    const { reflection, reflectionCompleted, updateReflection, setFailureReason, saveReflection } =
        useAppStore();
    const [isSaving, setIsSaving] = useState(false);

    async function handleSave() {
        if (!reflection.wentWell.trim() || !reflection.distracted.trim()) return;
        setIsSaving(true);
        await saveReflection();
        setIsSaving(false);
    }

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className="max-w-[720px] mx-auto space-y-5 animate-slide-up">
            {/* Date header */}
            <div className="pb-2 border-b border-[#2A2D33]">
                <div className="text-xs uppercase tracking-widest text-[#5C5A57]">Daily Reflection</div>
                <div className="text-sm text-[#9A9693] mt-1">{today}</div>
            </div>

            {/* Completed banner */}
            {reflectionCompleted && (
                <div className="flex items-center gap-3 p-4 bg-[#4A7C59]/10 border border-[#4A7C59]/30 rounded">
                    <CheckCircle2 className="w-4 h-4 text-[#4A7C59] shrink-0" />
                    <div>
                        <div className="text-sm font-medium text-[#4A7C59]">Reflection saved</div>
                        <div className="text-xs text-[#5C5A57] mt-0.5">
                            +20 points added to your discipline score.
                        </div>
                    </div>
                </div>
            )}

            {/* What went well */}
            <Card>
                <SectionHeader
                    title="What Went Well"
                    subtitle="Moments of discipline, focus, or progress today"
                />
                <textarea
                    value={reflection.wentWell}
                    onChange={(e) => updateReflection("wentWell", e.target.value)}
                    placeholder="I maintained focus during the morning deep work session. I completed my top priority without interruption..."
                    rows={5}
                    disabled={reflectionCompleted}
                    className="w-full bg-[#111214] border border-[#2A2D33] rounded p-4 text-sm text-[#E8E6E1] leading-relaxed placeholder:text-[#3A3D43] resize-none focus:outline-none focus:border-[#C6A75E]/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div className="flex justify-end mt-2">
                    <span className="text-[10px] text-[#3A3D43]">
                        {reflection.wentWell.length} chars
                    </span>
                </div>
            </Card>

            {/* What distracted */}
            <Card>
                <SectionHeader
                    title="What Distracted You"
                    subtitle="Honest account of disruptions and deviations"
                />
                <textarea
                    value={reflection.distracted}
                    onChange={(e) => updateReflection("distracted", e.target.value)}
                    placeholder="Spent 40 minutes on social media after lunch. Got pulled into an unplanned meeting in the afternoon..."
                    rows={5}
                    disabled={reflectionCompleted}
                    className="w-full bg-[#111214] border border-[#2A2D33] rounded p-4 text-sm text-[#E8E6E1] leading-relaxed placeholder:text-[#3A3D43] resize-none focus:outline-none focus:border-[#C6A75E]/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div className="flex justify-end mt-2">
                    <span className="text-[10px] text-[#3A3D43]">
                        {reflection.distracted.length} chars
                    </span>
                </div>
            </Card>

            {/* Failure reason */}
            <Card>
                <SectionHeader
                    title="Primary Failure Reason"
                    subtitle="If today had a weak point, what caused it?"
                />
                <select
                    value={reflection.failureReason ?? ""}
                    onChange={(e) =>
                        setFailureReason((e.target.value as FailureReason) || null)
                    }
                    disabled={reflectionCompleted}
                    className="w-full bg-[#1E2024] border border-[#2A2D33] rounded px-4 py-3 text-sm text-[#9A9693] focus:outline-none focus:border-[#C6A75E]/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
                >
                    <option value="">— No significant failure today —</option>
                    {failureReasons.map((reason) => (
                        <option key={reason} value={reason}>
                            {reason}
                        </option>
                    ))}
                </select>
                {reflection.failureReason && !reflectionCompleted && (
                    <div className="mt-3 p-3 bg-[#8B3A3A]/10 border border-[#8B3A3A]/20 rounded text-xs text-[#9A9693]">
                        <span className="text-[#C97070] font-semibold">{reflection.failureReason}: </span>
                        Acknowledge this. Tomorrow, design a specific counter-measure.
                    </div>
                )}
            </Card>

            {/* Save */}
            {!reflectionCompleted && (
                <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-[#5C5A57]">
                        {!reflection.wentWell.trim() || !reflection.distracted.trim()
                            ? "Fill in both fields to save"
                            : "Ready to submit"}
                    </span>
                    <Button
                        onClick={handleSave}
                        isLoading={isSaving}
                        disabled={!reflection.wentWell.trim() || !reflection.distracted.trim()}
                        size="lg"
                    >
                        Save Reflection
                    </Button>
                </div>
            )}
        </div>
    );
}
