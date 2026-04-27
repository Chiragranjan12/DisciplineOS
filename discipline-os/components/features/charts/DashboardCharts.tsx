"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    Radar,
    BarChart,
    Bar,
    Cell
} from "recharts";
import { mockWeeklyScores, mockRadarData } from "@/lib/mockData";

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ value: number; dataKey?: string; color?: string }>;
    label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#1E2024] border border-[#2A2D33] rounded px-3 py-2 text-xs">
                <div className="text-[#9A9693] mb-1">{label}</div>
                {payload.map((p, i) => (
                    <div key={i} className="flex items-center justify-between gap-4">
                        <span className="text-[#5C5A57]">{p.dataKey === 'score' ? 'Daily' : 'Structural (SMA)'}</span>
                        <span className="font-bold tabular-nums" style={{ color: p.color }}>{p.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
}

export function WeeklyTrendChart({ data }: { data: { date: string; score: number }[] }) {
    // 3-day moving average
    const getRollingAverage = (data: { score: number }[], index: number, windowSize: number = 3) => {
        const start = Math.max(0, index - windowSize + 1);
        const slice = data.slice(start, index + 1);
        const sum = slice.reduce((acc, d) => acc + d.score, 0);
        return Math.round(sum / slice.length);
    };

    const chartData = data.map((d, i) => ({
        ...d,
        day: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
        sma: getRollingAverage(data, i)
    }));

    return (
        <ResponsiveContainer width="100%" height={160}>
            <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: -24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2024" vertical={false} />
                <XAxis
                    dataKey="day"
                    tick={{ fill: "#5C5A57", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    domain={[0, 100]}
                    tick={{ fill: "#5C5A57", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickCount={4}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#2A2D33" }} />
                <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#C6A75E"
                    strokeWidth={1}
                    strokeOpacity={0.4}
                    dot={{ fill: "#C6A75E", r: 2, strokeWidth: 0, fillOpacity: 0.4 }}
                    activeDot={{ fill: "#C6A75E", r: 4, strokeWidth: 0 }}
                />
                <Line
                    type="monotone"
                    dataKey="sma"
                    stroke="#C6A75E"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ fill: "#C6A75E", r: 5, strokeWidth: 0 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}



export function ContributionBarChart({ tasks, habits, weights }: { tasks: any[], habits: any[], weights: Record<string, number> }) {
    // Show actual completion percentage for each area today
    const data = (weights && typeof weights === 'object') ? Object.keys(weights).map(area => {
        const areaTasks = tasks.filter(t => t.lifeArea === area);
        const areaHabits = habits.filter(h => h.lifeArea === area);
        const total = areaTasks.length + areaHabits.length;
        const done = areaTasks.filter(t => t.completed).length + areaHabits.filter(h => h.completedToday).length;
        return {
            area,
            percent: total > 0 ? Math.round((done / total) * 100) : 0
        };
    }).filter(d => d.percent > 0) : [];

    return (
        <ResponsiveContainer width="100%" height={120}>
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2024" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="area" type="category" tick={{ fill: "#9A9693", fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip 
                    cursor={{ fill: "#1E2024" }}
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            return (
                                <div className="bg-[#1E2024] border border-[#2A2D33] rounded px-3 py-2 text-xs">
                                    <div className="font-bold text-[#E8E6E1]">{payload[0].payload.area}</div>
                                    <div className="text-[#C6A75E]">{payload[0].value}% Complete</div>
                                </div>
                            );
                        }
                        return null;
                    }}
                />
                <Bar dataKey="percent" fill="#4A7C59" radius={[0, 4, 4, 0]} barSize={12} />
            </BarChart>
        </ResponsiveContainer>
    );
}

export function LifeAreaRadarChart({ data }: { data: { lifeArea: string; value: number; fullMark: number }[] }) {
    return (
        <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="#2A2D33" gridType="polygon" />
                <PolarAngleAxis
                    dataKey="lifeArea"
                    tick={{ fill: "#5C5A57", fontSize: 11 }}
                    axisLine={false}
                />
                <Radar
                    name="Life Areas"
                    dataKey="value"
                    stroke="#C6A75E"
                    fill="#C6A75E"
                    fillOpacity={0.12}
                    strokeWidth={1.5}
                />
            </RadarChart>
        </ResponsiveContainer>
    );
}
