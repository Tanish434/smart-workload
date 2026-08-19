"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  CheckSquare,
  AlertTriangle,
  Clock,
  CircleDot,
  Loader2,
} from "lucide-react";
import { Card } from "../ui/Card";
import { useDashboardSummary } from "../../store/useWorkloadStore";

export const KpiStrip: React.FC = () => {
  const summary = useDashboardSummary();

  const kpis = [
    {
      label: "Total Team",
      value: summary.totalMembers,
      subtitle: "Active roster",
      icon: Users,
      href: "/team",
      accent: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/50",
    },
    {
      label: "Pending Tasks",
      value: summary.pendingTasksCount,
      subtitle: "In To-Do queue",
      icon: CircleDot,
      href: "/tasks",
      accent: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-950/40 border-violet-100 dark:border-violet-900/50",
      pill: summary.unassignedTasksCount > 0 ? `${summary.unassignedTasksCount} unassigned` : undefined,
    },
    {
      label: "In Progress",
      value: summary.inProgressTasksCount,
      subtitle: `${summary.activeTasks} total active`,
      icon: Loader2,
      href: "/tasks",
      accent: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/50",
    },
    {
      label: "Overloaded",
      value: summary.overloadedCount,
      subtitle: summary.overloadedCount > 0 ? "Requires rebalance" : "Healthy load",
      icon: AlertTriangle,
      href: "/alerts",
      accent:
        summary.overloadedCount > 0
          ? "text-rose-600 dark:text-rose-400"
          : "text-emerald-600 dark:text-emerald-400",
      bg:
        summary.overloadedCount > 0
          ? "bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/50"
          : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50",
      isAlert: summary.overloadedCount > 0,
    },
    {
      label: "Urgent Deadlines",
      value: summary.upcomingDeadlineCount,
      subtitle: "Due in ≤5 days",
      icon: Clock,
      href: "/alerts",
      accent:
        summary.upcomingDeadlineCount > 0
          ? "text-amber-600 dark:text-amber-400"
          : "text-slate-600 dark:text-slate-400",
      bg:
        summary.upcomingDeadlineCount > 0
          ? "bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/50"
          : "bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800",
      isWarning: summary.upcomingDeadlineCount > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <Link key={idx} href={kpi.href} className="group block">
            <Card
              hoverable
              className="p-4 sm:p-5 h-full flex flex-col justify-between relative overflow-hidden transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate pr-1">
                  {kpi.label}
                </span>
                <div
                  className={`p-2 rounded-xl border ${kpi.bg} ${kpi.accent} shrink-0 transition-transform group-hover:scale-105`}
                >
                  <Icon className="w-4 h-4 sm:w-4 sm:h-4" />
                </div>
              </div>

              <div className="mt-3 sm:mt-4">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {kpi.value}
                  </span>
                  {kpi.isAlert && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300">
                      Alert
                    </span>
                  )}
                  {kpi.pill && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300">
                      {kpi.pill}
                    </span>
                  )}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                  {kpi.subtitle}
                </p>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};
