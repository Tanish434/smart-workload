"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card } from "../ui/Card";
import { Avatar } from "../ui/Avatar";
import { ProgressBar } from "../ui/ProgressBar";
import { useAlerts, useMembers } from "../../store/useWorkloadStore";

export const OverloadedWidget: React.FC = () => {
  const alerts = useAlerts();
  const allMembers = useMembers();

  // Get overloaded members enriched with workload percentage, sorted descending
  const overloadedList = allMembers
    .filter((m) => m.workloadStatus === "overloaded")
    .sort((a, b) => b.workloadPercent - a.workloadPercent)
    .slice(0, 5);

  return (
    <Card className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Overloaded Members
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Capacity exceeding 100%
            </p>
          </div>
        </div>
        <Link
          href="/alerts"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 inline-flex items-center gap-1 group"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Content */}
      <div className="pt-2 flex-1 flex flex-col">
        {overloadedList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              No Overloaded Members
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              All team members are operating within healthy capacity.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {overloadedList.map((member) => (
              <Link
                key={member.id}
                href={`/team/${member.id}`}
                className="group block p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <Avatar
                      name={member.name}
                      src={member.avatar}
                      size="sm"
                      status="overloaded"
                      className="shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate block">
                        {member.name}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate block">
                        {member.role} ({member.activeTaskCount} active tasks)
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                      {member.workloadPercent}%
                    </span>
                  </div>
                </div>
                <ProgressBar
                  percent={member.workloadPercent}
                  status="overloaded"
                  size="sm"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
