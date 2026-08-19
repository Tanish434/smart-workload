"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Trash2, ArrowRight, UserCheck, Inbox } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { useWorkloadStore, useMembers } from "../../store/useWorkloadStore";
import { useToast } from "../ui/Toast";
import type { Member } from "../../types/member";

export interface DeleteMemberModalProps {
  open: boolean;
  onClose: () => void;
  member: Member;
  activeTaskCount: number;
}

export const DeleteMemberModal: React.FC<DeleteMemberModalProps> = ({
  open,
  onClose,
  member,
  activeTaskCount,
}) => {
  const router = useRouter();
  const toast = useToast();
  const deleteMember = useWorkloadStore((state) => state.deleteMember);
  const allMembers = useMembers();

  const otherMembers = allMembers.filter((m) => m.id !== member.id);

  const [strategy, setStrategy] = useState<
    "unassign" | "auto_reassign" | "reassign_to"
  >("auto_reassign");
  const [targetMemberId, setTargetMemberId] = useState<string>(
    otherMembers[0]?.id || ""
  );

  const handleDelete = () => {
    deleteMember(member.id, strategy, targetMemberId);
    toast.success(
      `Removed ${member.name} from team. Workload rebalanced.`,
      "Member Deleted"
    );
    onClose();
    router.push("/team");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Remove ${member.name}`}
      description="Safely offboard team member and handle task allocations"
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Warning Callout */}
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-rose-900 dark:text-rose-200">
            <p className="font-semibold">
              Are you sure you want to remove <strong>{member.name}</strong> ({member.role})?
            </p>
            <p className="text-xs text-rose-700 dark:text-rose-400 mt-1">
              This will remove them from all assigned projects and redistribute their workload.
            </p>
          </div>
        </div>

        {/* Task Strategy Selector */}
        {activeTaskCount > 0 && (
          <div className="space-y-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Handle {activeTaskCount} Active Assigned Task(s):
            </label>

            <div className="space-y-2">
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                  strategy === "auto_reassign"
                    ? "bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 text-indigo-900 dark:text-indigo-200"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="strategy"
                  value="auto_reassign"
                  checked={strategy === "auto_reassign"}
                  onChange={() => setStrategy("auto_reassign")}
                  className="w-4 h-4 text-indigo-600 mt-0.5"
                />
                <div>
                  <span className="font-bold block">
                    Auto-reassign using recommendation engine (Recommended)
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Matches each task to the highest-scoring available teammate with the required skill.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                  strategy === "reassign_to"
                    ? "bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 text-indigo-900 dark:text-indigo-200"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="strategy"
                  value="reassign_to"
                  checked={strategy === "reassign_to"}
                  onChange={() => setStrategy("reassign_to")}
                  className="w-4 h-4 text-indigo-600 mt-0.5"
                />
                <div className="flex-1">
                  <span className="font-bold block">
                    Transfer all tasks to a specific teammate
                  </span>
                  {strategy === "reassign_to" && (
                    <select
                      value={targetMemberId}
                      onChange={(e) => setTargetMemberId(e.target.value)}
                      className="mt-2 w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    >
                      {otherMembers.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.role}) — {m.workloadPercent}% load
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                  strategy === "unassign"
                    ? "bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 text-indigo-900 dark:text-indigo-200"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="strategy"
                  value="unassign"
                  checked={strategy === "unassign"}
                  onChange={() => setStrategy("unassign")}
                  className="w-4 h-4 text-indigo-600 mt-0.5"
                />
                <div>
                  <span className="font-bold block">
                    Leave tasks unassigned
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Tasks will move to the unassigned backlog for manual assignment later.
                  </span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={handleDelete}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Confirm Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};
