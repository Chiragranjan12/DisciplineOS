import { cn } from "@/lib/utils";

interface ProgressBarProps {
    value: number; // 0–100
    className?: string;
    showLabel?: boolean;
    height?: "xs" | "sm" | "md";
    color?: string;
}

export function ProgressBar({
    value,
    className,
    showLabel = false,
    height = "sm",
    color = "#C6A75E",
}: ProgressBarProps) {
    const clampedValue = Math.min(100, Math.max(0, value));

    const heights = {
        xs: "h-0.5",
        sm: "h-1",
        md: "h-2",
    };

    return (
        <div className={cn("flex items-center gap-3", className)}>
            <div className={cn("flex-1 bg-[#2A2D33] rounded-full overflow-hidden", heights[height])}>
                <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${clampedValue}%`, backgroundColor: color }}
                />
            </div>
            {showLabel && (
                <span className="text-xs text-[#9A9693] tabular-nums w-8 text-right">
                    {clampedValue}%
                </span>
            )}
        </div>
    );
}
