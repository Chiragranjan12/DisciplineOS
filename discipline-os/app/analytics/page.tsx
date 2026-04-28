"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MetricDisplay } from "@/components/ui/MetricDisplay";
import {
    WeeklyBarChart,
    RollingTrendChart,
    FailureReasonsChart,
    LifeAreaBarChart,
} from "@/components/features/charts/AnalyticsCharts";
import { getRollingAverage, getScoreColor, getScoreLabel } from "@/lib/scoreUtils";
import { AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function AnalyticsPage() {
    const {
        thirtyDayIndex,
        trend,
        weeklyScores,
        rollingScores,
        radarData,
        failureReasons,
        fetchAnalyticsSummary,
        fetchWeeklyScores,
        fetchRollingScores,
        fetchRadarData,
        fetchFailureReasons,
    } = useAppStore();

    useEffect(() => {
        fetchAnalyticsSummary();
        fetchWeeklyScores();
        fetchRollingScores();
        fetchRadarData();
        fetchFailureReasons();
    }, [fetchAnalyticsSummary, fetchWeeklyScores, fetchRollingScores, fetchRadarData, fetchFailureReasons]);

    // ── Derived values ─────────────────────────────────────────────
    const displayIndex = thirtyDayIndex || (weeklyScores.length > 0
        ? getRollingAverage(weeklyScores.map(d => ({ score: d.score })), weeklyScores.length)
        : 0);

    const avgColor = getScoreColor(displayIndex);
    const avgLabel = getScoreLabel(displayIndex);

    const trendLabel = trend > 0 ? "Upward" : trend < 0 ? "Downward" : "Stable";
    const trendColor = trend > 0 ? "#4A7C59" : trend < 0 ? "#8B3A3A" : "#5C5A57";
    const TrendIcon  = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;

    // Weakest life area from today's radar data
    const sortedAreas = [...radarData].sort((a, b) => a.value - b.value);
    const weakest = sortedAreas[0] ?? null;
    const strongest = sortedAreas[sortedAreas.length - 1] ?? null;

    // Top failure reason
    const topFailure = failureReasons[0] ?? null;

    // Dynamic Trend Summary text
    const strengthText = strongest
        ? `${strongest.lifeArea} is your strongest area today with ${strongest.value}% completion.`
        : "Complete tasks and habits today to see your strongest area.";

    const weaknessText = weakest && weakest.value < 60
        ? `${weakest.lifeArea} is critically low at ${weakest.value}% today. It needs more attention.`
        : weakest
        ? `${weakest.lifeArea} is your lowest area at ${weakest.value}% — still within an acceptable range.`
        : "No life area data yet. Add tasks and habits to start tracking.";

    const insightText = topFailure
        ? `Your most common failure mode is ${topFailure.reason} (${topFailure.count}× this month). Design a specific counter-measure to prevent it tomorrow.`
        : weeklyScores.length === 0
        ? "Start logging your daily work to unlock pattern insights."
        : "No failure modes recorded yet — great consistency! Keep logging reflections to track patterns.";

    return (
        <div className="max-w-[1200px] mx-auto space-y-5 animate-slide-up">

            {/* ── KPI Cards ─────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <MetricDisplay label="30-Day Index" value={displayIndex} size="md" valueColor={avgColor} />
                    <div className="mt-2 text-[10px] uppercase tracking-wider" style={{ color: avgColor }}>
                        {avgLabel}
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-1.5 mb-1">
                        <TrendIcon className="w-3.5 h-3.5" style={{ color: trendColor }} />
                        <span className="text-[10px] uppercase tracking-widest text-[#5C5A57]">7-Day Trend</span>
                    </div>
                    <div className="text-xl font-bold" style={{ color: trendColor }}>{trendLabel}</div>
                    <div className="mt-2 text-xs text-[#5C5A57]">
                        {trend > 0 ? `+${trend}` : trend} pts vs last week
                    </div>
                </Card>

                <Card>
                    <MetricDisplay
                        label="Weakest Area"
                        value={weakest ? weakest.lifeArea : "—"}
                        size="sm"
                        valueColor="#8B3A3A"
                    />
                    <div className="mt-2 text-xs text-[#5C5A57]">
                        {weakest ? `${weakest.value}% today` : "No data yet"}
                    </div>
                </Card>

                <Card>
                    <MetricDisplay
                        label="Top Failure"
                        value={topFailure ? topFailure.reason : "—"}
                        size="sm"
                        valueColor="#C97070"
                    />
                    <div className="mt-2 text-xs text-[#5C5A57]">
                        {topFailure ? `${topFailure.count} occurrences` : "No reflections yet"}
                    </div>
                </Card>
            </div>

            {/* ── Charts Row 1 ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <Card>
                    <SectionHeader title="Weekly Score" subtitle="7-day discipline score breakdown" />
                    <WeeklyBarChart data={weeklyScores} />
                </Card>

                <Card>
                    <SectionHeader
                        title="30-Day Rolling Trend"
                        subtitle={`${rollingScores.length} days of data — dashed line = average`}
                    />
                    <RollingTrendChart data={rollingScores} />
                    {rollingScores.length > 0 && (
                        <div className="mt-3 flex items-center gap-2">
                            <div className="w-8 border-t border-dashed border-[#C6A75E]/50" />
                            <span className="text-xs text-[#5C5A57]">
                                Average: {getRollingAverage(rollingScores.map(d => ({ score: d.score })), rollingScores.length)}
                            </span>
                        </div>
                    )}
                </Card>
            </div>

            {/* ── Charts Row 2 ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <Card>
                    <SectionHeader title="Life Area Performance" subtitle="Today's completion % per domain" />
                    {radarData.length === 0 ? (
                        <div className="py-8 text-center text-sm text-[#5C5A57]">
                            Complete tasks today to see your life area breakdown
                        </div>
                    ) : (
                        <LifeAreaBarChart data={radarData} />
                    )}
                    {weakest && weakest.value < 60 && (
                        <div className="mt-4 flex items-start gap-2 p-3 bg-[#8B3A3A]/10 border border-[#8B3A3A]/20 rounded">
                            <AlertTriangle className="w-3.5 h-3.5 text-[#C97070] mt-0.5 shrink-0" />
                            <p className="text-xs text-[#9A9693]">
                                <span className="text-[#C97070] font-semibold">{weakest.lifeArea}</span> only
                                {weakest.value}% complete today — your identity priorities demand more here.
                            </p>
                        </div>
                    )}
                </Card>

                <Card>
                    <SectionHeader
                        title="Failure Reason Distribution"
                        subtitle="What caused discipline breaks this month"
                    />
                    <FailureReasonsChart data={failureReasons} />
                </Card>
            </div>

            {/* ── Trend Summary ──────────────────────────────────────── */}
            <Card>
                <SectionHeader title="Trend Summary" subtitle="Pattern analysis based on your real data" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
                    <div className="border-l-2 border-[#C6A75E] pl-4">
                        <div className="text-xs uppercase tracking-wider text-[#5C5A57] mb-2">Strength</div>
                        <p className="text-sm text-[#9A9693] leading-relaxed">{strengthText}</p>
                    </div>
                    <div className="border-l-2 border-[#8B3A3A] pl-4">
                        <div className="text-xs uppercase tracking-wider text-[#5C5A57] mb-2">Weakness</div>
                        <p className="text-sm text-[#9A9693] leading-relaxed">{weaknessText}</p>
                    </div>
                    <div className="border-l-2 border-[#5C7A9A] pl-4">
                        <div className="text-xs uppercase tracking-wider text-[#5C5A57] mb-2">Insight</div>
                        <p className="text-sm text-[#9A9693] leading-relaxed">{insightText}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
