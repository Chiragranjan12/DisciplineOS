"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "@/components/ui/Card";
import { MetricDisplay } from "@/components/ui/MetricDisplay";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { WeeklyTrendChart, LifeAreaRadarChart, ContributionBarChart } from "@/components/features/charts/DashboardCharts";
import { NarrativeFeedback } from "@/components/features/NarrativeFeedback";
import { getScoreColor, getScoreLabel, getMomentum, getRadarInterpretation } from "@/lib/scoreUtils";
import { CheckCircle2, Circle, TrendingUp, TrendingDown, Minus, Target } from "lucide-react";
import type { LifeArea } from "@/types";

const lifeAreaColors: Record<LifeArea, string> = {
  Health: "#4A7C59",
  Skills: "#C6A75E",
  Career: "#5C7A9A",
  Finance: "#7A6C4A",
  Relationships: "#7A4A6C",
  Mindset: "#4A6C7A",
};

export default function DashboardPage() {
  const {
    disciplineScore,
    taskCompletionPercent,
    habitCompletionPercent,
    reflectionCompleted,
    tasks,
    habits,
    thirtyDayIndex,
    trend,
    scoreChange,
    alignmentScore,
    normalizedWeights,
    weeklyScores,
    radarData,
    toggleTask,
    fetchDailyLog,
    fetchIdentity,
    fetchAnalyticsSummary,
    fetchWeeklyScores,
    fetchRadarData,
  } = useAppStore();

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    fetchDailyLog(today);
    fetchIdentity();
    fetchAnalyticsSummary();
    fetchWeeklyScores();
    fetchRadarData();
  }, [fetchDailyLog, fetchIdentity, fetchAnalyticsSummary, fetchWeeklyScores, fetchRadarData]);

  const scoreColor = getScoreColor(disciplineScore);
  const scoreLabel = getScoreLabel(disciplineScore);

  // Structural Momentum (7D Moving Average)
  const smaValue = (weeklyScores && Array.isArray(weeklyScores) && weeklyScores.length > 0)
    ? Math.round(weeklyScores.reduce((acc, s) => acc + (s.score || 0), 0) / weeklyScores.length)
    : disciplineScore;
  const smaLabel = getScoreLabel(smaValue);
  const smaColor = getScoreColor(smaValue);

  // Momentum from trend
  const momentum = trend > 0 ? "up" : trend < 0 ? "down" : "flat";
  const MomentumIcon =
    momentum === "up" ? TrendingUp : momentum === "down" ? TrendingDown : Minus;
  const momentumColor =
    momentum === "up" ? "#4A7C59" : momentum === "down" ? "#8B3A3A" : "#5C5A57";

  const top3 = (tasks || [])
    .filter((t) => t.priority === "high" || t.priority === "medium")
    .slice(0, 3);

  const completedCount = (tasks || []).filter((t) => t.completed).length;
  const radarInterpretation = getRadarInterpretation(radarData || []);

  return (
    <div className="max-w-[1280px] mx-auto space-y-6 animate-slide-up">
      {/* Score Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Discipline Score Card */}
        <Card className="md:col-span-1">
          <div className="flex items-start justify-between mb-2">
            <span className="text-[10px] uppercase tracking-widest text-[#5C5A57] font-semibold">
              Steady Hand Index (7D SMA)
            </span>
            <div
              className="flex items-center gap-1 text-xs font-medium"
              style={{ color: momentumColor }}
            >
              <MomentumIcon className="w-3.5 h-3.5" />
              <span>{momentum === "flat" ? "Flat" : `${Math.abs(trend)}pt`}</span>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span
              className="text-[64px] font-black leading-none tabular-nums"
              style={{ color: smaColor }}
            >
              {smaValue}
            </span>
            <span className="text-xs text-[#5C5A57] uppercase tracking-wider font-bold mb-2">Structural</span>
          </div>

          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#1E2024]">
            <span className="text-[10px] uppercase text-[#5C5A57] font-semibold tracking-widest">Daily Reading:</span>
            <span className="text-lg font-bold tabular-nums" style={{ color: scoreColor }}>{disciplineScore}</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${scoreColor}15`, color: scoreColor }}>
              {scoreLabel}
            </span>
          </div>

          <div className="mt-5 space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#5C5A57]">Tasks</span>
                <span className="text-[#9A9693] tabular-nums">{taskCompletionPercent}%</span>
              </div>
              <ProgressBar value={taskCompletionPercent} height="sm" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#5C5A57]">Habits</span>
                <span className="text-[#9A9693] tabular-nums">{habitCompletionPercent}%</span>
              </div>
              <ProgressBar value={habitCompletionPercent} height="sm" />
            </div>
          </div>
        </Card>

        {/* Weekly Trend Chart Card */}
        <Card className="md:col-span-2">
          <SectionHeader
            title="Narrative Summary"
            subtitle="Alignment with your core identity"
            action={
              <div className="flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-[#C6A75E]" />
                <span className="text-xs font-bold text-[#C6A75E] tabular-nums">{alignmentScore}% Alignment</span>
              </div>
            }
          />
          <NarrativeFeedback />

          <div className="mt-6 pt-6 border-t border-[#2A2D33]">
            <SectionHeader
              title="Identity Pulse"
              subtitle="Structural momentum (thick line) vs daily noise"
              action={
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#5C5A57] uppercase tracking-wider">30D Index:</span>
                  <span className="text-xs font-bold text-[#C6A75E] tabular-nums">{thirtyDayIndex}</span>
                </div>
              }
            />
            <WeeklyTrendChart data={weeklyScores || []} />
          </div>
        </Card>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Life Area Radar */}
        <Card>
          <SectionHeader
            title="Area Distribution"
            subtitle="Structural effort realized vs identity intent"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <LifeAreaRadarChart data={radarData || []} />
              <div className="p-3 bg-[#18191C] border border-[#2A2D33] rounded">
                <p className="text-xs text-[#9A9693] leading-relaxed italic">
                  {radarInterpretation}
                </p>
              </div>
            </div>
            <div className="pt-4">
              <div className="text-[10px] uppercase tracking-widest text-[#5C5A57] mb-2">Identity Contributions</div>
              <ContributionBarChart tasks={tasks || []} habits={habits || []} weights={normalizedWeights || {}} />
            </div>
          </div>
        </Card>

        {/* Today's Top 3 Commitments */}
        <Card>
          <SectionHeader
            title="Top Focus"
            subtitle={`${completedCount} of ${(tasks || []).length} tasks complete`}
            action={
              <span className="text-xs text-[#5C5A57] tabular-nums">
                {taskCompletionPercent}%
              </span>
            }
          />

          <div className="space-y-2 mb-6">
            {top3.map((task) => (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className="w-full flex items-start gap-3 p-3 rounded border border-transparent hover:border-[#2A2D33] hover:bg-[#18191C] transition-colors duration-150 text-left group"
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
                    <span className="text-[10px] text-[#3A3D43]">
                      {task.plannedDurationMinutes}m planned
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Habits quick view */}
          <div className="border-t border-[#2A2D33] pt-4">
            <div className="text-[10px] uppercase tracking-widest text-[#5C5A57] mb-3">
              Daily Habits
            </div>
            <div className="flex flex-wrap gap-2">
              {habits.map((h) => (
                <div
                  key={h.id}
                  className={`text-xs px-2.5 py-1 rounded border ${h.completedToday
                    ? "border-[#4A7C59]/40 bg-[#4A7C59]/10 text-[#4A7C59]"
                    : "border-[#2A2D33] text-[#5C5A57]"
                    }`}
                >
                  {h.title}
                </div>
              ))}
              {habits.length === 0 && (
                <div className="text-xs text-[#3A3D43] italic">No active habits</div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Footer Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <MetricDisplay
            label="Daily Progress"
            value={`${completedCount}/${tasks.length}`}
            size="md"
          />
        </Card>
        <Card>
          <MetricDisplay
            label="Habit Load"
            value={`${habits.filter((h) => h.completedToday).length}/${habits.length}`}
            size="md"
          />
        </Card>
        <Card>
          <MetricDisplay
            label="Momentum"
            value={`${scoreChange > 0 ? '+' : ''}${scoreChange}`}
            unit="pts vs yesterday"
            size="md"
            valueColor={scoreChange >= 0 ? "#4A7C59" : "#8B3A3A"}
          />
        </Card>
        <Card>
          <MetricDisplay
            label="Alignment"
            value={`${alignmentScore}%`}
            unit="identity fit"
            size="md"
            valueColor="#C6A75E"
          />
        </Card>
      </div>
    </div>
  );
}
