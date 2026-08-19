import React from "react";
import { ProgressBar } from "../ui/ProgressBar";
import type { WorkloadStatus } from "../../lib/workload";

export interface WorkloadBarProps {
  percent: number;
  status?: WorkloadStatus;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  activeHours?: number;
  capacityHours?: number;
  className?: string;
}

export const WorkloadBar: React.FC<WorkloadBarProps> = ({
  percent,
  status,
  size = "sm",
  showLabel = true,
  activeHours,
  capacityHours,
  className,
}) => {
  let statusText = "Normal";
  let statusColor = "text-emerald-600 dark:text-emerald-400";

  if (status === "overloaded" || percent >= 100) {
    statusText = "Overloaded";
    statusColor = "text-rose-600 dark:text-rose-400 font-bold";
  } else if (status === "at_risk" || percent >= 85) {
    statusText = "At Risk";
    statusColor = "text-amber-600 dark:text-amber-400 font-semibold";
  }

  return (
    <div className={`space-y-1.5 ${className || ""}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Workload:
            </span>
            <span className={statusColor}>
              {percent}% ({statusText})
            </span>
          </div>
          {activeHours !== undefined && capacityHours !== undefined && (
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              {activeHours}h / {capacityHours}h
            </span>
          )}
        </div>
      )}
      <ProgressBar percent={percent} status={status} size={size} />
    </div>
  );
};
