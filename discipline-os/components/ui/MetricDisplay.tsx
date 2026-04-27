import { cn } from "@/lib/utils";

interface MetricDisplayProps {
    label: string;
    value: string | number;
    unit?: string;
    trend?: "up" | "down" | "flat";
    size?: "sm" | "md" | "lg";
    className?: string;
    valueColor?: string;
}

export function MetricDisplay({
    label,
    value,
    unit,
    trend,
    size = "md",
    className,
    valueColor,
}: MetricDisplayProps) {
    const valueSizes = {
        sm: "text-2xl font-semibold",
        md: "text-4xl font-bold",
        lg: "text-6xl font-black",
    };

    const trendIcon = trend === "up" ? "↑" : trend === "down" ? "↓" : null;
    const trendColor =
        trend === "up" ? "text-[#4A7C59]" : trend === "down" ? "text-[#8B3A3A]" : "text-[#5C5A57]";

    return (
        <div className={cn("flex flex-col gap-1", className)}>
            <span className="text-xs uppercase tracking-widest text-[#5C5A57] font-semibold">
                {label}
            </span>
            <div className="flex items-end gap-2">
                <span
                    className={cn(valueSizes[size], "leading-none")}
                    style={valueColor ? { color: valueColor } : undefined}
                >
                    {value}
                </span>
                {unit && (
                    <span className="text-sm text-[#9A9693] mb-0.5">{unit}</span>
                )}
                {trendIcon && (
                    <span className={cn("text-base font-bold mb-0.5", trendColor)}>
                        {trendIcon}
                    </span>
                )}
            </div>
        </div>
    );
}
