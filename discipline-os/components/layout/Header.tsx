"use client";

import { Menu, X, Bell, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
    "/": { title: "Dashboard", subtitle: "Your daily control center" },
    "/identity": { title: "Identity", subtitle: "Who you are becoming" },
    "/commitments": { title: "Daily Commitments", subtitle: "What you will do today" },
    "/reflection": { title: "Reflection", subtitle: "What happened today" },
    "/analytics": { title: "Analytics", subtitle: "30-day performance view" },
};

interface HeaderProps {
    onMenuClick: () => void;
    isSidebarOpen: boolean;
}

export function Header({ onMenuClick, isSidebarOpen }: HeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, clearAuth } = useAuthStore();

    const page = pageTitles[pathname] ?? pageTitles["/"];
    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    const getInitials = (name?: string) => {
        if (!name) return "??";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    const handleLogout = () => {
        clearAuth();
        router.push("/login");
    };

    return (
        <header className="sticky top-0 z-10 h-14 bg-[#111214] border-b border-[#2A2D33] flex items-center px-4 gap-3 shrink-0">
            <button
                onClick={onMenuClick}
                className="w-8 h-8 flex items-center justify-center rounded text-[#9A9693] hover:text-[#E8E6E1] hover:bg-[#1E2024] transition-colors shrink-0"
                aria-label="Toggle navigation"
            >
                {isSidebarOpen ? (
                    <X className="w-4 h-4" />
                ) : (
                    <Menu className="w-5 h-5" />
                )}
            </button>

            <div className="w-px h-4 bg-[#2A2D33]" />

            <div className="flex-1 min-w-0">
                <h1 className="text-sm font-semibold text-[#E8E6E1] truncate">{page.title}</h1>
                <p className="text-[11px] text-[#5C5A57] hidden sm:block">{page.subtitle}</p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
                <span className="text-xs text-[#5C5A57] hidden md:block">{today}</span>
                <div className="w-px h-4 bg-[#2A2D33] hidden md:block" />

                <button
                    className="text-[#5C5A57] hover:text-[#9A9693] transition-colors"
                    title="Notifications"
                >
                    <Bell className="w-4 h-4" />
                </button>

                <button
                    onClick={handleLogout}
                    className="text-[#5C5A57] hover:text-[#C6A75E] transition-colors"
                    title="Log Out"
                >
                    <LogOut className="w-4 h-4" />
                </button>

                <div className="w-7 h-7 rounded bg-[#1E2024] border border-[#2A2D33] flex items-center justify-center text-[10px] font-bold text-[#C6A75E]">
                    {getInitials(user?.name)}
                </div>
            </div>
        </header>
    );
}
