"use client";

import React from "react";
import Link from "next/link";
import { Clock, ArrowRight, Calendar, CheckCircle } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { useAlerts } from "../../store/useWorkloadStore";

export const DeadlineWidget: React.FC = () => {
  const alerts = useAlerts();

  // Show top 3 deadline risks (for balanced 3-column dashboard grid)
  const topRisks = alerts.deadlineRisks.slice(0, 3);

  return (
    <Card className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Upcoming Deadlines
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Ranked by urgency & assignee load
            </p>
          </div>
        </div>
        <Link
          href="/tasks"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 inline-flex items-center gap-1 group"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* List */}
      <div className="pt-2 flex-1 flex flex-col">
        {topRisks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2">
              <CheckCircle className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              No Pending Deadlines
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              All active deliverables are on track.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {topRisks.map(({ task, risk }) => (
              <Link
                key={task.id}
                href={`/tasks/${task.id}`}
                className="group flex items-center justify-between py-2.5 px-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="min-w-0 pr-3 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate block">
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {task.deadline}
                    </span>
                    <span>•</span>
                    <span>{task.estimatedHours}h est</span>
                  </div>
                </div>

                <Badge variant={{ type: "risk", value: risk }} size="sm" showDot />
              </Link>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
