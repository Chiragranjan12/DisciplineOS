import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padded?: boolean;
    hoverable?: boolean;
}

export function Card({ children, className, padded = true, hoverable = false }: CardProps) {
    return (
        <div
            className={cn(
                "rounded bg-[#18191C] border border-[#2A2D33]",
                padded && "p-5",
                hoverable && "transition-colors duration-150 hover:border-[#3A3D43] cursor-pointer",
                className
            )}
        >
            {children}
        </div>
    );
}
