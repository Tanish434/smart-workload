"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  UserCheck,
  Sparkles,
  ArrowRight,
  Check,
  AlertCircle,
  HelpCircle,
  Clock,
  Calendar,
  Layers,
} from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Avatar } from "../ui/Avatar";
import { ProgressBar } from "../ui/ProgressBar";
import { useTaskById, useWorkloadStore, useMembers } from "../../store/useWorkloadStore";
import { getSuggestedMembers } from "../../lib/suggestEngine";
import { useToast } from "../ui/Toast";

export interface ReassignPanelProps {
  taskId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  queueRemainingCount?: number;
}

export type ReassignReason =
  | "Member unavailable"
  | "High-priority swap"
  | "Manual load balancing";

export const ReassignPanel: React.FC<ReassignPanelProps> = ({
  taskId,
  onSuccess,
  onCancel,
  queueRemainingCount = 0,
}) => {
  const task = useTaskById(taskId);
  const allMembers = useWorkloadStore((state) => state.members);
  const allTasks = useWorkloadStore((state) => state.tasks);
  const reassignTask = useWorkloadStore((state) => state.reassignTask);
  const toast = useToast();

  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [reason, setReason] = useState<ReassignReason>("Member unavailable");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Rank available candidates excluding the current assignee
  const suggestions = useMemo(() => {
    if (!task) return [];
    const ranked = getSuggestedMembers(
      { requiredSkill: task.requiredSkill, priority: task.priority },
      allMembers,
      allTasks
    );
    return ranked.filter((s) => s.member.id !== task.assignedTo);
  }, [task, allMembers, allTasks]);

  if (!task) {
    return (
      <Card className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Task Not Found
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
          Cannot reassign non-existent task ID.
        </p>
        {onCancel && (
          <Button variant="secondary" size="sm" onClick={onCancel}>
            Go Back
          </Button>
        )}
      </Card>
    );
  }

  const currentAssignee = task.assignee;
  const selectedCandidate = suggestions.find((s) => s.member.id === selectedMemberId);

  const handleConfirm = () => {
    if (!selectedMemberId || !selectedCandidate) return;

    setIsSubmitting(true);
    reassignTask(task.id, selectedMemberId, reason);

    toast.success(
      `Reassigned "${task.title}" to ${selectedCandidate.member.name} (${reason})`,
      "Task Reassigned"
    );

    if (onSuccess) {
      onSuccess();
    }
  };

  const reasonsList: ReassignReason[] = [
    "Member unavailable",
    "High-priority swap",
    "Manual load balancing",
  ];

  return (
    <div className="space-y-6">
      {/* Queue Chaining Banner (if active) */}
      {queueRemainingCount > 0 && (
        <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between gap-3 text-xs text-indigo-900 dark:text-indigo-200">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>
              <strong>Unavailability Reassignment Queue:</strong> {queueRemainingCount} more task(s) awaiting reassignment after this.
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white font-bold text-[10px]">
            In Progress
          </span>
        </div>
      )}

      {/* Task Summary Card */}
      <Card className="p-5 bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Task To Reassign
          </span>
          <div className="flex items-center gap-1.5">
            <Badge variant={{ type: "priority", value: task.priority }} size="sm" />
            <Badge variant={{ type: "status", value: task.status }} size="sm" />
          </div>
        </div>

        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
          {task.title}
        </h3>

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
          <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300">
            Skill: {task.requiredSkill}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {task.estimatedHours}h effort
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Due: {task.deadline}
          </span>
        </div>
      </Card>

      {/* Current Assignee State */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
          Current Assignee
        </label>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          {currentAssignee ? (
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 text-xs font-bold shrink-0">
                {getInitials(currentAssignee.name)}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                  {currentAssignee.name}
                </span>
                <span className="text-[11px] text-slate-400 truncate block">
                  {currentAssignee.role} ({currentAssignee.availability})
                </span>
              </div>
            </div>
          ) : (
            <span className="text-xs italic text-slate-400">
              Currently Unassigned
            </span>
          )}
        </div>
      </div>

      {/* Ranked Candidate Selection */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Select New Assignee
          </label>
          <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Ranked by capacity & skill
          </span>
        </div>

        <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
          {suggestions.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 border border-dashed rounded-2xl">
              No available alternative candidates found.
            </div>
          ) : (
            suggestions.map(({ member, score, reasons }, index) => {
              const isSelected = selectedMemberId === member.id;
              const isTop = index === 0;

              return (
                <button
                  type="button"
                  key={member.id}
                  onClick={() => setSelectedMemberId(member.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/20"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
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
                            isTop ? "bg-amber-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
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
                          {isTop && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                              Top Pick
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
                            : "border border-slate-300 dark:border-slate-600"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>

                  {/* Reasons Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {reasons.map((r, rIdx) => (
                      <span
                        key={rIdx}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Reason Selection Radio Group */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
          Reassignment Reason
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {reasonsList.map((r) => (
            <label
              key={r}
              className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                reason === r
                  ? "bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 text-indigo-900 dark:text-indigo-200"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="reassignReason"
                value={r}
                checked={reason === r}
                onChange={() => setReason(r)}
                className="w-3.5 h-3.5 text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <span className="truncate">{r}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        {onCancel && (
          <Button variant="ghost" size="md" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          variant="primary"
          size="md"
          disabled={!selectedMemberId || isSubmitting}
          onClick={handleConfirm}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Confirm Reassignment
        </Button>
      </div>
    </div>
  );
};
