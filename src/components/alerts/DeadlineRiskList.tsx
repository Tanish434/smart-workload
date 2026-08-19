"use client";

import React from "react";
import Link from "next/link";
import { Clock, Calendar, ArrowRight, CheckCircle2, User } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { useAlerts, useMembers } from "../../store/useWorkloadStore";

export const DeadlineRiskList: React.FC = () => {
  const alerts = useAlerts();
  const members = useMembers();

  // Filter tasks with non-low risk
  const riskyTasks = alerts.deadlineRisks.filter((r) => r.risk !== "low");

  const memberMap = new Map();
  members.forEach((m) => memberMap.set(m.id, m));

  return (
    <div className="space-y-4">
      {riskyTasks.length === 0 ? (
        <Card className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No Imminent Deadline Risks
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            All current deliverables have adequate time buffers and healthy assignee capacity.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {riskyTasks.map(({ task, risk }) => {
            const assignee = task.assignedTo ? memberMap.get(task.assignedTo) : null;

            return (
              <Link
                key={task.id}
                href={`/tasks/${task.id}`}
                className="group block"
              >
                <Card
                  hoverable
                  className={`p-4 border transition-all duration-200 bg-white dark:bg-slate-900 ${
                    risk === "high"
                      ? "border-l-4 border-l-rose-500 hover:border-rose-300"
                      : "border-l-4 border-l-amber-500 hover:border-amber-300"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Badge variant={{ type: "risk", value: risk }} size="sm" showDot />
                        <Badge variant={{ type: "priority", value: task.priority }} size="sm" />
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {task.requiredSkill}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                        {task.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Due: <strong className="text-slate-700 dark:text-slate-300">{task.deadline}</strong>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {task.estimatedHours}h effort
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {assignee ? (
                            <span>
                              Assigned to <strong>{assignee.name}</strong> ({assignee.workloadPercent}% load)
                            </span>
                          ) : (
                            <em className="text-rose-500">Unassigned</em>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700">
                      <span>Inspect Task</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
