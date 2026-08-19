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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <Card className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Team Capacity Distribution
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Live capacity breakdown per team member
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

      {/* Chart List */}
      <div className="pt-3 w-full min-w-0 space-y-2">
        {sortedMembers.map((member) => {
          const activeHours = member.activeTasks.reduce(
            (sum, t) => sum + (t.estimatedHours || 0),
            0
          );

          return (
            <Link
              key={member.id}
              href={`/team/${member.id}`}
              className="group block p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Avatar */}
                  <Avatar
                    name={member.name}
                    src={member.avatar}
                    size="sm"
                    status={member.workloadStatus === "overloaded" ? "overloaded" : member.availability}
                    className="shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                        {member.name}
                      </span>
                      <Badge
                        variant={{ type: "availability", value: member.availability }}
                        size="sm"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 block truncate">
                      {member.role} • {member.activeTaskCount} active tasks
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-2">
                  <div className="flex items-baseline justify-end gap-1">
                    <span
                      className={`text-xs font-extrabold ${
                        member.workloadStatus === "overloaded"
                          ? "text-rose-600 dark:text-rose-400"
                          : member.workloadStatus === "at_risk"
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-slate-700 dark:text-slate-300"
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

              <ProgressBar
                percent={member.workloadPercent}
                status={member.workloadStatus}
                size="md"
              />
            </Link>
          );
        })}
      </div>
    </Card>
  );
};
