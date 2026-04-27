"use client";

import { useAppStore } from "@/store/useAppStore";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

export function NarrativeFeedback() {
    const { radarData, failureReasons } = useAppStore();

    // 1. Sort life areas to find strongest and weakest today
    const sortedAreas = [...radarData].sort((a, b) => a.value - b.value);
    const weakest = sortedAreas[0] ?? null;
    const strongest = sortedAreas[sortedAreas.length - 1] ?? null;
    const topFailure = failureReasons[0] ?? null;

    const highlights: { type: "positive" | "negative" | "neutral", text: string }[] = [];

    // Strength
    if (strongest && strongest.value >= 60) {
        highlights.push({
            type: "positive",
            text: `High realization in ${strongest.lifeArea} (${strongest.value}% complete). Excellent alignment with intent.`,
        });
    }

    // Weakness
    if (weakest && weakest.value < 40) {
        highlights.push({
            type: "negative",
            text: `${weakest.lifeArea} is receiving critically low effort (${weakest.value}%). Identity drift detected.`,
        });
    } else if (weakest) {
        highlights.push({
            type: "neutral",
            text: `Balance maintained. Lowest area is ${weakest.lifeArea} at ${weakest.value}%.`,
        });
    }

    // Failure Insight
    if (topFailure) {
        highlights.push({
            type: "neutral",
            text: `Pattern recognized: ${topFailure.reason} is your most frequent failure mode (${topFailure.count}×). Build a counter-measure.`,
        });
    }

    if (highlights.length === 0) {
        return (
            <div className="flex items-center gap-2 p-3 rounded bg-[#18191C] border border-[#2A2D33] text-[#5C5A57] text-xs italic">
                <Info className="w-4 h-4" />
                <span>Maintain current momentum to calibrate baseline.</span>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {highlights.map((h, i) => (
                <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded border transition-all duration-300 ${h.type === "positive"
                        ? "bg-[#4A7C59]/10 border-[#4A7C59]/20 text-[#4A7C59]"
                        : h.type === "negative"
                            ? "bg-[#8B3A3A]/10 border-[#8B3A3A]/20 text-[#8B3A3A]"
                            : "bg-[#18191C] border-[#2A2D33] text-[#E8E6E1]"
                        }`}
                >
                    {h.type === "positive" ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : h.type === "negative" ? (
                        <AlertCircle className="w-4 h-4 shrink-0" />
                    ) : (
                        <Info className="w-4 h-4 shrink-0" />
                    )}
                    <span className="text-sm font-medium leading-none">{h.text}</span>
                </div>
            ))}
        </div>
    );
}
