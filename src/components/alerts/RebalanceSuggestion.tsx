"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, Zap, ArrowLeftRight } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { useAlerts, useWorkloadStore, useMembers } from "../../store/useWorkloadStore";
import { useToast } from "../ui/Toast";

export const RebalanceSuggestion: React.FC = () => {
  const alerts = useAlerts();
  const reassignTask = useWorkloadStore((state) => state.reassignTask);
  const toast = useToast();
  const allMembers = useMembers();

  const memberMap = new Map();
  allMembers.forEach((m) => memberMap.set(m.id, m));

  const handleApply = (taskId: string, taskTitle: string, fromName: string, toId: string, toName: string) => {
    reassignTask(taskId, toId, "Applied automated rebalance recommendation");
    toast.success(
      `Moved "${taskTitle}" from ${fromName} to ${toName}. Workload balanced!`,
      "Workload Rebalanced"
    );
  };

  const suggestions = alerts.rebalanceSuggestions;

  return (
    <div className="space-y-4">
      {suggestions.length === 0 ? (
        <Card className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Team Workload is Optimized
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            No active rebalancing required. All overloaded tasks have been resolved or balanced.
          </p>
        </Card>
      ) : (
        <div className="space-y-3.5">
          {suggestions.map(({ task, from, to }) => {
            const currentFrom = memberMap.get(from.id) || from;
            const currentTo = memberMap.get(to.id) || to;

            return (
              <Card
                key={`${task.id}-${from.id}-${to.id}`}
                className="p-5 border border-indigo-100 dark:border-indigo-900/60 bg-gradient-to-r from-white via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20 shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Task details & Rebalance flow */}
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                        <Zap className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                        AI Rebalance Proposal
                      </span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {task.requiredSkill}
                      </span>
                      <span className="text-xs text-slate-400">
                        {task.estimatedHours}h effort
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      Move &ldquo;{task.title}&rdquo;
                    </h4>

                    {/* Flow Diagram: From -> To */}
                    <div className="flex items-center gap-3 pt-1 text-xs">
                      {/* From Member */}
                      <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 min-w-[130px]">
                        <span className="text-[10px] text-rose-500 block font-semibold uppercase">
                          From Overloaded
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white truncate block">
                          {currentFrom.name}
                        </span>
                        <span className="text-[11px] text-rose-600 dark:text-rose-400 font-bold">
                          {currentFrom.workloadPercent || 100}% load
                        </span>
                      </div>

                      <ArrowRight className="w-4 h-4 text-indigo-500 shrink-0" />

                      {/* To Member */}
                      <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 min-w-[130px]">
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold uppercase">
                          To Recommended
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white truncate block">
                          {currentTo.name}
                        </span>
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                          {currentTo.workloadPercent || 0}% load
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: 1-Click Accept Button */}
                  <div className="shrink-0 flex items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() =>
                        handleApply(
                          task.id,
                          task.title,
                          currentFrom.name,
                          currentTo.id,
                          currentTo.name
                        )
                      }
                      leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      Apply Rebalance
                    </Button>
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
