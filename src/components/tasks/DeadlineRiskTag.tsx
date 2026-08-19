"use client";

import React from "react";
import { Badge } from "../ui/Badge";
import { getDeadlineRisk, DeadlineRisk } from "../../lib/deadlineRisk";
import { useMemberById } from "../../store/useWorkloadStore";
import type { Task } from "../../types/task";

export interface DeadlineRiskTagProps {
  task: Task;
  size?: "sm" | "md";
  showDot?: boolean;
  className?: string;
}

export const DeadlineRiskTag: React.FC<DeadlineRiskTagProps> = ({
  task,
  size = "sm",
  showDot = true,
  className,
}) => {
  const assignee = useMemberById(task.assignedTo || "");
  const risk: DeadlineRisk = getDeadlineRisk(task, assignee?.workloadStatus);

  return (
    <Badge
      variant={{ type: "risk", value: risk }}
      size={size}
      showDot={showDot}
      className={className}
    />
  );
};
