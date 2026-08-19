"use client";

import React, { useMemo } from "react";
import { Sparkles, Check, UserCheck, ShieldCheck } from "lucide-react";
import { Card } from "../ui/Card";
import { Avatar } from "../ui/Avatar";
import { ProgressBar } from "../ui/ProgressBar";
import { getSuggestedMembers } from "../../lib/suggestEngine";
import { useMembers, useWorkloadStore } from "../../store/useWorkloadStore";
import type { TaskPriority } from "../../types/task";

export interface SuggestedMembersPanelProps {
  draftSkill: string;
  draftPriority: TaskPriority;
  selectedAssigneeId: string | null;
  onSelectMember: (memberId: string) => void;
}

export const SuggestedMembersPanel: React.FC<SuggestedMembersPanelProps> = ({
  draftSkill,
  draftPriority,
  selectedAssigneeId,
  onSelectMember,
}) => {
  const allMembers = useWorkloadStore((state) => state.members);
  const allTasks = useWorkloadStore((state) => state.tasks);

  // Live recalculation based on draft skill & priority
  const rankedMembers = useMemo(() => {
    return getSuggestedMembers(
      {
        requiredSkill: draftSkill || "",
        priority: draftPriority || "medium",
      },
      allMembers,
      allTasks
    );
  }, [draftSkill, draftPriority, allMembers, allTasks]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <Card className="p-5 sm:p-6 flex flex-col h-full bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/60 border border-slate-200/80 dark:border-slate-800">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-sm">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Smart Assignee Recommendations
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ranked live by skill match (+40), available capacity (+30), and availability (+20)
          </p>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="pt-4 flex-1 space-y-3">
        {rankedMembers.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No available candidates found.
          </div>
        ) : (
          rankedMembers.map(({ member, score, reasons }, index) => {
            const isSelected = selectedAssigneeId === member.id;
            const isTopMatch = index === 0 && score > 50;

            return (
              <button
                type="button"
                key={member.id}
                onClick={() => onSelectMember(member.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 relative group cursor-pointer ${
                  isSelected
                    ? "bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/20"
                    : isTopMatch
                    ? "bg-white dark:bg-slate-800/80 border-indigo-200 dark:border-indigo-900/50 hover:border-indigo-400 shadow-sm"
                    : "bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                {/* Top Row: Rank, Avatar, Name & Selection Indicator */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative">
                      <Avatar
                        name={member.name}
                        src={member.avatar}
                        size="sm"
                        status={member.availability}
                        className="shrink-0"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full text-[9px] font-extrabold flex items-center justify-center border-2 border-white dark:border-slate-900 ${
                          index === 0
                            ? "bg-amber-500 text-white"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {index + 1}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {member.name}
                        </span>
                        {isTopMatch && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                            Best Match
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 truncate block">
                        {member.role}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-2">
                    <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                      {score} pts
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : "border border-slate-300 dark:border-slate-600 group-hover:border-indigo-400"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                </div>

                {/* Reasons Badges */}
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {reasons.map((reason, rIdx) => (
                    <span
                      key={rIdx}
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        reason === "Has required skill"
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800"
                          : reason === "Currently available"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {reason}
                    </span>
                  ))}
                </div>

                {/* Hint */}
                <p className="text-[10px] text-slate-400">
                  Click to assign {member.name}
                </p>
              </button>
            );
          })
        )}
      </div>
    </Card>
  );
};
