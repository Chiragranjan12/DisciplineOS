import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    children: React.ReactNode;
}

export function Button({
    variant = "primary",
    size = "md",
    isLoading = false,
    className,
    children,
    disabled,
    ...props
}: ButtonProps) {
    const base =
        "inline-flex items-center justify-center font-medium transition-colors duration-150 rounded focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C6A75E] disabled:pointer-events-none disabled:opacity-50";

    const variants = {
        primary: "bg-[#C6A75E] text-[#111214] hover:bg-[#B8973A]",
        secondary:
            "bg-transparent border border-[#2A2D33] text-[#E8E6E1] hover:border-[#C6A75E] hover:text-[#C6A75E]",
        ghost: "bg-transparent text-[#9A9693] hover:text-[#E8E6E1] hover:bg-[#1E2024]",
        danger: "bg-transparent border border-[#8B3A3A] text-[#C97070] hover:bg-[#8B3A3A] hover:text-[#E8E6E1]",
    };

    const sizes = {
        sm: "text-xs px-3 py-1.5 gap-1.5",
        md: "text-sm px-4 py-2 gap-2",
        lg: "text-sm px-6 py-3 gap-2",
    };

    return (
        <button
            className={cn(base, variants[variant], sizes[size], className)}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : null}
            {children}
        </button>
    );
}
