"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    User,
    CheckSquare,
    BookOpen,
    BarChart2,
    Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { getScoreColor } from "@/lib/scoreUtils";

const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/identity", label: "Identity", icon: User },
    { href: "/commitments", label: "Commitments", icon: CheckSquare },
    { href: "/reflection", label: "Reflection", icon: BookOpen },
    { href: "/analytics", label: "Analytics", icon: BarChart2 },
];

interface SidebarProps {
    onClose: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
    const pathname = usePathname();
    const disciplineScore = useAppStore((s) => s.disciplineScore);
    const scoreColor = getScoreColor(disciplineScore);

    return (
        // The sidebar fills its parent container (the width-transitioning div in AppLayout)
        // w-[240px] ensures it always has the right width even if parent clips it
        <aside className="w-[240px] h-full bg-[#111214] border-r border-[#2A2D33] flex flex-col">
            {/* Logo */}
            <div className="px-5 pt-6 pb-5 border-b border-[#2A2D33]">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-[#C6A75E] rounded flex items-center justify-center shrink-0">
                        <Zap className="w-4 h-4 text-[#111214]" strokeWidth={2.5} />
                    </div>
                    <div>
                        <span className="text-sm font-bold text-[#E8E6E1] tracking-tight">
                            DisciplineOS
                        </span>
                        <div className="text-[10px] text-[#5C5A57] uppercase tracking-wider">
                            Personal Engine
                        </div>
                    </div>
                </div>
            </div>

            {/* Score badge */}
            <div className="px-5 py-4 border-b border-[#2A2D33]">
                <div className="text-[10px] uppercase tracking-widest text-[#5C5A57] mb-1.5">
                    Today&apos;s Score
                </div>
                <div className="flex items-baseline gap-2">
                    <span
                        className="text-3xl font-black tabular-nums"
                        style={{ color: scoreColor }}
                    >
                        {disciplineScore}
                    </span>
                    <span className="text-xs text-[#5C5A57]">/ 100</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto">
                <ul className="space-y-0.5">
                    {navItems.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href;
                        return (
                            <li key={href}>
                                <Link
                                    href={href}
                                    onClick={onClose}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors duration-150 whitespace-nowrap",
                                        isActive
                                            ? "bg-[#1E2024] text-[#C6A75E] border border-[#2A2D33]"
                                            : "text-[#9A9693] hover:text-[#E8E6E1] hover:bg-[#18191C]"
                                    )}
                                >
                                    <Icon
                                        className={cn(
                                            "w-4 h-4 shrink-0",
                                            isActive ? "text-[#C6A75E]" : "text-[#5C5A57]"
                                        )}
                                        strokeWidth={isActive ? 2 : 1.5}
                                    />
                                    {label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-[#2A2D33]">
                <div className="text-[10px] text-[#5C5A57] whitespace-nowrap">Marcus Cole</div>
                <div className="text-[10px] text-[#3A3D43] mt-0.5 whitespace-nowrap">High-Performance Engineer</div>
            </div>
        </aside>
    );
}
