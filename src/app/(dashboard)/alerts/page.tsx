"use client";

import React, { useState } from "react";
import { clsx } from "clsx";
import { AlertTriangle, Clock, Sparkles } from "lucide-react";
import { OverloadedList } from "../../../components/alerts/OverloadedList";
import { DeadlineRiskList } from "../../../components/alerts/DeadlineRiskList";
import { RebalanceSuggestion } from "../../../components/alerts/RebalanceSuggestion";
import { useAlerts } from "../../../store/useWorkloadStore";

type AlertTab = "overloaded" | "deadlines" | "suggestions";

export default function AlertsPage() {
  const alerts = useAlerts();
  const [activeMobileTab, setActiveMobileTab] = useState<AlertTab>("overloaded");

  const overloadedCount = alerts.overloadedMembers.length;
  const deadlineRiskCount = alerts.deadlineRisks.filter((r) => r.risk !== "low").length;
  const suggestionCount = alerts.rebalanceSuggestions.length;

  const tabs = [
    {
      id: "overloaded" as AlertTab,
      label: "Overloaded Team",
      count: overloadedCount,
      icon: AlertTriangle,
      color: "text-rose-600 dark:text-rose-400",
      badgeBg: "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300",
    },
    {
      id: "deadlines" as AlertTab,
      label: "Deadline Risks",
      count: deadlineRiskCount,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      badgeBg: "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300",
    },
    {
      id: "suggestions" as AlertTab,
      label: "Rebalance Suggestions",
      count: suggestionCount,
      icon: Sparkles,
      color: "text-indigo-600 dark:text-indigo-400",
      badgeBg: "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header Info */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          System Alerts & Capacity Rebalancing
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Automated risk detection for team overallocation, urgent deadlines, and recommended capacity swaps.
        </p>
      </div>

      {/* Mobile Tab Switcher (<768px) */}
      <div className="md:hidden flex rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1.5 border border-slate-200 dark:border-slate-700/60">
        {tabs.map((tab) => {
          const isActive = activeMobileTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMobileTab(tab.id)}
              className={clsx(
                "flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-bold transition-all",
                isActive
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <Icon className={clsx("w-3.5 h-3.5", tab.color)} />
                <span className={clsx("px-1.5 py-0.2 rounded-full text-[10px]", tab.badgeBg)}>
                  {tab.count}
                </span>
              </div>
              <span className="truncate text-[11px]">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Single Tab Content */}
      <div className="md:hidden">
        {activeMobileTab === "overloaded" && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Overloaded Teammates ({overloadedCount})
              </h3>
            </div>
            <OverloadedList />
          </section>
        )}

        {activeMobileTab === "deadlines" && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Elevated Deadline Risks ({deadlineRiskCount})
              </h3>
            </div>
            <DeadlineRiskList />
          </section>
        )}

        {activeMobileTab === "suggestions" && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Automated Rebalance Proposals ({suggestionCount})
              </h3>
            </div>
            <RebalanceSuggestion />
          </section>
        )}
      </div>

      {/* Desktop Stacked Sections (>=768px) */}
      <div className="hidden md:space-y-8 md:block">
        {/* Section 1: Rebalance Proposals */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Smart Rebalancing Suggestions ({suggestionCount})
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              One-click task redistribution to available qualified teammates
            </span>
          </div>
          <RebalanceSuggestion />
        </section>

        {/* Section 2: Overloaded Members */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Overloaded Team Members ({overloadedCount})
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Members currently exceeding 100% weekly capacity
            </span>
          </div>
          <OverloadedList />
        </section>

        {/* Section 3: Deadline Risks */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Deadline Risk Escalations ({deadlineRiskCount})
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Active tasks due soon or assigned to overloaded teammates
            </span>
          </div>
          <DeadlineRiskList />
        </section>
      </div>
    </div>
  );
}
