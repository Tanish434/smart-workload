"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, UserX, ArrowRight } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { useToast } from "../ui/Toast";
import { useWorkloadStore } from "../../store/useWorkloadStore";
import type { Member } from "../../types/member";

export interface MarkUnavailableModalProps {
  open: boolean;
  onClose: () => void;
  member: Member;
}

export const MarkUnavailableModal: React.FC<MarkUnavailableModalProps> = ({
  open,
  onClose,
  member,
}) => {
  const router = useRouter();
  const toast = useToast();
  const updateMemberAvailability = useWorkloadStore(
    (state) => state.updateMemberAvailability
  );

  const handleConfirm = () => {
    // Update availability and get back affected active tasks
    const activeTasks = updateMemberAvailability(member.id, "unavailable");

    if (activeTasks && activeTasks.length > 0) {
      toast.warning(
        `${member.name} marked unavailable. Starting reassignment for ${activeTasks.length} active task(s).`,
        "Reassignment Triggered"
      );
      onClose();

      const firstTaskId = activeTasks[0].id;
      const remainingIds = activeTasks.slice(1).map((t) => t.id).join(",");
      const query = remainingIds ? `?queue=${remainingIds}` : "";

      router.push(`/tasks/${firstTaskId}/reassign${query}`);
    } else {
      toast.success(
        `${member.name} marked unavailable. No active tasks needed reassignment.`,
        "Status Updated"
      );
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Mark Member Unavailable"
      description="Update status and rebalance existing workload"
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-800 dark:text-amber-300">
            <p className="font-semibold mb-1">
              Marking <strong>{member.name}</strong> as unavailable will exclude them from automatic suggestion algorithms.
            </p>
            <p className="text-amber-700 dark:text-amber-400 text-xs">
              If {member.name} has active in-progress or todo tasks, you will be guided step-by-step to reassign them to available teammates.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <Button variant="ghost" onClick={onClose} size="md">
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            size="md"
            leftIcon={<UserX className="w-4 h-4" />}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Confirm & Reassign
          </Button>
        </div>
      </div>
    </Modal>
  );
};
