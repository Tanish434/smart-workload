import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AT_RISK_THRESHOLD, OVERLOAD_THRESHOLD } from "../../lib/constants";
import type { WorkloadStatus } from "../../lib/workload";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  percent: number;
  status?: WorkloadStatus;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animate?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percent,
  status,
  size = "md",
  showLabel = false,
  animate = true,
  className,
  ...props
}) => {
  // Clamp visually at 100% for bar width, but allow percent number to display full (e.g. 125%)
  const visualPercent = Math.min(Math.max(percent, 0), 100);

  // Derive color based on thresholds or status
  let barColorClass = "bg-emerald-500";
  let textColorClass = "text-emerald-700 dark:text-emerald-400";

  if (status === "overloaded" || percent >= OVERLOAD_THRESHOLD) {
    barColorClass = "bg-rose-500";
    textColorClass = "text-rose-700 dark:text-rose-400 font-bold";
  } else if (status === "at_risk" || percent >= AT_RISK_THRESHOLD) {
    barColorClass = "bg-amber-500";
    textColorClass = "text-amber-700 dark:text-amber-400 font-semibold";
  }

  const heightClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-3.5",
  };

  return (
    <div className={twMerge("w-full flex flex-col gap-1.5", className)} {...props}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">Workload</span>
          <span className={textColorClass}>{percent}%</span>
        </div>
      )}
      <div
        className={clsx(
          "w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex",
          heightClasses[size]
        )}
      >
        <div
          className={clsx(
            "rounded-full transition-all duration-500 ease-out",
            barColorClass,
            animate && "transition-all"
          )}
          style={{ width: `${visualPercent}%` }}
        />
      </div>
    </div>
  );
};
