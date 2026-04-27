"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LineChart,
    Line,
    ReferenceLine,
} from "recharts";
import { getScoreColor, getRollingAverage } from "@/lib/scoreUtils";

// ─── Types ──────────────────────────────────────────────────────────
export interface DayScore   { date: string; score: number; }
export interface RadarPoint { lifeArea: string; value: number; fullMark: number; }
export interface FailurePoint { reason: string; count: number; }

// ─── Tooltip ────────────────────────────────────────────────────────
interface TooltipProps {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
}

function BarTooltip({ active, payload, label }: TooltipProps) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#1E2024] border border-[#2A2D33] rounded px-3 py-2 text-xs">
                <div className="text-[#9A9693]">{label}</div>
                <div className="text-[#C6A75E] font-semibold mt-0.5">{payload[0].value}</div>
            </div>
        );
    }
    return null;
}

// ─── Weekly Bar Chart ────────────────────────────────────────────────
export function WeeklyBarChart({ data }: { data: DayScore[] }) {
    const chartData = data.map(d => ({
        ...d,
        day: new Date(d.date).toLocaleDateString("en-US", { weekday: "short" }),
    }));

    if (chartData.length === 0) {
        return <EmptyChart message="No data yet — complete tasks this week to see your scores" />;
    }

    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: -24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2024" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#5C5A57", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "#5C5A57", fontSize: 11 }} axisLine={false} tickLine={false} tickCount={5} />
                <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(198,167,94,0.04)" }} />
                <Bar dataKey="score" radius={[3, 3, 0, 0]} maxBarSize={40}>
                    {chartData.map((entry, i) => (
                        <Cell key={i} fill={getScoreColor(entry.score)} fillOpacity={0.85} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

// ─── 30-Day Rolling Trend Chart ──────────────────────────────────────
export function RollingTrendChart({ data }: { data: DayScore[] }) {
    const chartData = data.map((item, i) => ({ day: i + 1, score: item.score }));
    const avg = getRollingAverage(chartData, chartData.length || 30);

    if (chartData.length === 0) {
        return <EmptyChart message="No data yet — start logging daily to see your trend" />;
    }

    return (
        <ResponsiveContainer width="100%" height={150}>
            <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: -28 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2024" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#5C5A57", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "#5C5A57", fontSize: 10 }} axisLine={false} tickLine={false} tickCount={4} />
                <Tooltip content={<BarTooltip />} cursor={{ stroke: "#2A2D33" }} />
                <ReferenceLine y={avg} stroke="#C6A75E" strokeDasharray="4 4" strokeOpacity={0.5} />
                <Line type="monotone" dataKey="score" stroke="#5C5A57" strokeWidth={1.5} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    );
}

// ─── Life Area Performance Chart ─────────────────────────────────────
export function LifeAreaBarChart({ data }: { data: RadarPoint[] }) {
    const chartData = data.map(d => ({ area: d.lifeArea, avgScore: d.value }));

    if (chartData.length === 0) {
        return <EmptyChart message="No life area data yet" />;
    }

    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart layout="vertical" data={chartData} margin={{ top: 4, right: 24, bottom: 4, left: 0 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "#5C5A57", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="area" tick={{ fill: "#9A9693", fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(198,167,94,0.04)" }} />
                <Bar dataKey="avgScore" radius={[0, 3, 3, 0]} maxBarSize={16}>
                    {chartData.map((entry) => (
                        <Cell key={entry.area} fill={getScoreColor(entry.avgScore)} fillOpacity={0.85} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

// ─── Failure Reasons Chart ───────────────────────────────────────────
export function FailureReasonsChart({ data }: { data: FailurePoint[] }) {
    if (data.length === 0) {
        return <EmptyChart message="No reflection data yet — save your first reflection to see patterns" />;
    }

    return (
        <ResponsiveContainer width="100%" height={180}>
            <BarChart layout="vertical" data={data} margin={{ top: 4, right: 24, bottom: 4, left: 0 }}>
                <XAxis type="number" tick={{ fill: "#5C5A57", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="reason" tick={{ fill: "#9A9693", fontSize: 11 }} axisLine={false} tickLine={false} width={88} />
                <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(198,167,94,0.04)" }} />
                <Bar dataKey="count" fill="#C6A75E" fillOpacity={0.7} radius={[0, 3, 3, 0]} maxBarSize={16} />
            </BarChart>
        </ResponsiveContainer>
    );
}

// ─── Empty State ─────────────────────────────────────────────────────
function EmptyChart({ message }: { message: string }) {
    return (
        <div className="flex items-center justify-center h-[150px]">
            <p className="text-xs text-[#3A3D43] text-center max-w-[200px]">{message}</p>
        </div>
    );
}
