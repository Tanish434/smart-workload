"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, UserX, Share2 } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { WorkloadBar } from "../team/WorkloadBar";
import { useAlerts, useMembers } from "../../store/useWorkloadStore";

export const OverloadedList: React.FC = () => {
  const alerts = useAlerts();
  const allMembers = useMembers();

  // Get full member objects for overloaded members
  const overloadedMembers = alerts.overloadedMembers.map((m) => {
    const full = allMembers.find((item) => item.id === m.id);
    return full || m;
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="space-y-4">
      {overloadedMembers.length === 0 ? (
        <Card className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No Overloaded Teammates
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            All team members have workloads below the 100% capacity threshold.
          </p>
        </Card>
      ) : (
        <div className="space-y-3.5">
          {overloadedMembers.map((member: any) => {
            const activeTasks = member.activeTasks || [];
            const activeHours = activeTasks.reduce(
              (sum: number, t: any) => sum + (t.estimatedHours || 0),
              0
            );
            const firstTaskId = activeTasks[0]?.id;

            return (
              <Card
                key={member.id}
                className="p-5 border-l-4 border-l-rose-500 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Info & Explanation */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-rose-700 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
                      {getInitials(member.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/team/${member.id}`}
                          className="text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate"
                        >
                          {member.name}
                        </Link>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                          {member.workloadPercent}% Load
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {member.role} •{" "}
                        <strong className="text-slate-700 dark:text-slate-300">
                          {activeTasks.length} active tasks
                        </strong>{" "}
                        ({activeHours}h assigned / {member.capacityHoursPerWeek}h weekly cap)
                      </p>

                      {/* Workload Progress Bar */}
                      <div className="mt-3 max-w-md">
                        <WorkloadBar
                          percent={member.workloadPercent}
                          status="overloaded"
                          showLabel={false}
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Action */}
                  <div className="shrink-0 flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    {firstTaskId ? (
                      <Link href={`/tasks/${firstTaskId}/reassign`}>
                        <Button
                          variant="danger"
                          size="sm"
                          leftIcon={<Share2 className="w-3.5 h-3.5" />}
                        >
                          Reassign a Task
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/team/${member.id}`}>
                        <Button variant="secondary" size="sm">
                          View Member
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
