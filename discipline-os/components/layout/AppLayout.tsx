"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

interface AppLayoutProps {
    children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated } = useAuthStore();
    const [isMounted, setIsMounted] = useState(false);

    const isAuthRoute = pathname === "/login" || pathname === "/register";

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            if (!isAuthenticated && !isAuthRoute) {
                router.push("/login");
            } else if (isAuthenticated && isAuthRoute) {
                router.push("/");
            }
        }
    }, [isAuthenticated, isAuthRoute, router, isMounted]);

    // Prevent hydration mismatch by waiting for mount
    if (!isMounted) {
        return <div className="min-h-screen bg-[#111214]" />;
    }

    // If it's an auth route, don't show the sidebar/header
    if (isAuthRoute) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[#111214]">
            <div
                className={cn(
                    "flex-shrink-0 transition-[width] duration-200 ease-in-out overflow-hidden",
                    sidebarOpen ? "w-[240px]" : "w-0"
                )}
            >
                <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>

            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <Header
                    isSidebarOpen={sidebarOpen}
                    onMenuClick={() => setSidebarOpen((prev) => !prev)}
                />
                <main className="flex-1 overflow-y-auto">
                    <div className="p-5 md:p-7 animate-fade-in">{children}</div>
                </main>
            </div>
        </div>
    );
}
