import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { MemberAvailability } from "../../types/member";
import type { TaskPriority, TaskStatus } from "../../types/task";
import type { DeadlineRisk } from "../../lib/deadlineRisk";

export type BadgeVariant =
  | { type: "availability"; value: MemberAvailability }
  | { type: "priority"; value: TaskPriority | "critical" }
  | { type: "risk"; value: DeadlineRisk }
  | { type: "status"; value: TaskStatus }
  | { type: "custom"; label: string; color?: "emerald" | "amber" | "rose" | "indigo" | "slate" | "blue" };

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant: BadgeVariant;
  size?: "sm" | "md";
  showDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant,
  size = "md",
  showDot = false,
  className,
  ...props
}) => {
  let label = "";
  let colorClasses = "";
  let dotColor = "";

  if (variant.type === "availability") {
    switch (variant.value) {
      case "available":
        label = "Available";
        colorClasses = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800";
        dotColor = "bg-emerald-500";
        break;
      case "busy":
        label = "Busy";
        colorClasses = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800";
        dotColor = "bg-amber-500";
        break;
      case "unavailable":
        label = "Unavailable";
        colorClasses = "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800";
        dotColor = "bg-rose-500";
        break;
    }
  } else if (variant.type === "priority") {
    switch (variant.value) {
      case "low":
        label = "Low";
        colorClasses = "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
        dotColor = "bg-slate-400";
        break;
      case "medium":
        label = "Medium";
        colorClasses = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800";
        dotColor = "bg-amber-500";
        break;
      case "high":
        label = "High";
        colorClasses = "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800";
        dotColor = "bg-rose-500";
        break;
      case "critical":
        label = "Critical";
        colorClasses = "bg-rose-600 text-white border-rose-600 font-extrabold animate-pulse";
        dotColor = "bg-white";
        break;
    }
  } else if (variant.type === "risk") {
    switch (variant.value) {
      case "low":
        label = "Low Risk";
        colorClasses = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800";
        dotColor = "bg-emerald-500";
        break;
      case "medium":
        label = "Med Risk";
        colorClasses = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800";
        dotColor = "bg-amber-500";
        break;
      case "high":
        label = "High Risk";
        colorClasses = "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 animate-pulse-subtle";
        dotColor = "bg-rose-500";
        break;
    }
  } else if (variant.type === "status") {
    switch (variant.value) {
      case "todo":
        label = "To Do";
        colorClasses = "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
        dotColor = "bg-slate-400";
        break;
      case "in_progress":
        label = "In Progress";
        colorClasses = "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800";
        dotColor = "bg-indigo-500";
        break;
      case "done":
        label = "Done";
        colorClasses = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800";
        dotColor = "bg-emerald-500";
        break;
    }
  } else if (variant.type === "custom") {
    label = variant.label;
    const color = variant.color || "slate";
    const colorMap = {
      emerald: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
      amber: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
      rose: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
      indigo: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800",
      slate: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
      blue: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
    };
    colorClasses = colorMap[color];
    dotColor = `bg-${color}-500`;
  }

  const sizeClasses = {
    sm: "text-[11px] px-2 py-0.5 font-medium",
    md: "text-xs px-2.5 py-1 font-semibold",
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1.5 rounded-full border shrink-0 select-none",
          colorClasses,
          sizeClasses[size],
          className
        )
      )}
      {...props}
    >
      {showDot && (
        <span className={clsx("w-1.5 h-1.5 rounded-full shrink-0", dotColor)} />
      )}
      {label}
    </span>
  );
};
