"use client";

import React from "react";
import Link from "next/link";
import { Zap, ArrowRight, Cpu } from "lucide-react";
import { Card } from "../ui/Card";
import { useTasks } from "../../store/useWorkloadStore";

export const PrioritySchedulerWidget: React.FC = () => {
  const allTasks = useTasks();

  // Filter tasks that have aged/escalated beyond their base priority (top 3 for balanced grid height)
  const agedTasks = allTasks
    .filter((t) => t.status !== "done" && t.aging.isEscalated)
    .sort((a, b) => b.aging.score - a.aging.score)
    .slice(0, 3);

  const priorityStyles = {
    critical:
      "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900/60",
    high:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900/60",
    medium:
      "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900/60",
    low:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  };

  return (
    <Card className="flex flex-col h-full border border-slate-200/80 dark:border-slate-800 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              Auto Priority Escalation
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              Automated deadline aging & feedback
            </p>
          </div>
        </div>

        <Link
          href="/tasks"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 inline-flex items-center gap-1 shrink-0 whitespace-nowrap group ml-2"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Content List */}
      <div className="pt-2 flex-1 flex flex-col">
        {agedTasks.length === 0 ? (
          <div className="py-6 text-center text-slate-400 text-xs">
            <Zap className="w-7 h-7 mx-auto text-emerald-500 mb-2 opacity-80" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              All Deliverables on Track
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              No tasks requiring aging priority boost.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {agedTasks.map((task) => (
              <Link
                key={task.id}
                href={`/tasks/${task.id}`}
                className="group flex items-center justify-between py-2.5 px-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="min-w-0 pr-3 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate block">
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-300">
                    <span className="truncate font-medium">
                      ⚡ {task.aging.reasons[0]}
                    </span>
                    {task.aging.reasons.length > 1 && (
                      <span className="text-[10px] text-slate-400 font-normal shrink-0">
                        +{task.aging.reasons.length - 1}
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-0.5">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      priorityStyles[task.effectivePriority] || priorityStyles.high
                    }`}
                  >
                    <Zap className="w-2.5 h-2.5" />
                    <span>{task.effectivePriority.toUpperCase()}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    was {task.priority}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
