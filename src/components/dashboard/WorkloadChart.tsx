"use client";

import React from "react";
import Link from "next/link";
import { BarChart3, ArrowRight } from "lucide-react";
import { Card } from "../ui/Card";
import { Avatar } from "../ui/Avatar";
import { ProgressBar } from "../ui/ProgressBar";
import { Badge } from "../ui/Badge";
import { useMembers } from "../../store/useWorkloadStore";

export const WorkloadChart: React.FC = () => {
  const members = useMembers();

  // Sort members descending by workload percentage
  const sortedMembers = [...members].sort(
    (a, b) => b.workloadPercent - a.workloadPercent
  );

  return (
    <Card className="flex flex-col border border-slate-200/80 dark:border-slate-800 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Team Capacity Distribution
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Live capacity breakdown per team member ({members.length} members)
            </p>
          </div>
        </div>
        <Link
          href="/team"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 inline-flex items-center gap-1 group"
        >
          <span>Manage Team</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* 2-Column Responsive High-Density Capacity Grid */}
      <div className="pt-3.5 grid grid-cols-1 md:grid-cols-2 gap-2.5 w-full min-w-0">
        {sortedMembers.map((member) => {
          const activeHours = member.activeTasks.reduce(
            (sum, t) => sum + (t.estimatedHours || 0),
            0
          );

          return (
            <Link
              key={member.id}
              href={`/team/${member.id}`}
              className="group block p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 border border-slate-200/70 dark:border-slate-700/60 transition-all duration-150"
            >
              {/* Row 1: Avatar, Name, Availability & Workload Percentage */}
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar
                    name={member.name}
                    src={member.avatar}
                    size="sm"
                    status={
                      member.workloadStatus === "overloaded"
                        ? "overloaded"
                        : member.availability
                    }
                    className="shrink-0"
                  />
                  <div className="min-w-0 flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                      {member.name}
                    </span>
                    <Badge
                      variant={{
                        type: "availability",
                        value: member.availability,
                      }}
                      size="sm"
                    />
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-baseline justify-end gap-1">
                    <span
                      className={`text-xs font-extrabold ${
                        member.workloadStatus === "overloaded"
                          ? "text-rose-600 dark:text-rose-400"
                          : member.workloadStatus === "at_risk"
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {member.workloadPercent}%
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ({activeHours}h / {member.capacityHoursPerWeek}h)
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 2: Role & Active Tasks subtitle */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 pl-8">
                <span className="truncate">{member.role}</span>
                <span className="shrink-0 font-medium text-slate-500 dark:text-slate-400">
                  {member.activeTaskCount} tasks
                </span>
              </div>

              {/* Row 3: Progress Bar */}
              <ProgressBar
                percent={member.workloadPercent}
                status={member.workloadStatus}
                size="sm"
              />
            </Link>
          );
        })}
      </div>
    </Card>
  );
};
