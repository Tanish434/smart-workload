import type { Task } from "../types/task";
import type { WorkloadStatus } from "./workload";
import {
  DEADLINE_HIGH_RISK_DAYS,
  DEADLINE_MEDIUM_RISK_DAYS,
} from "./constants";

export type DeadlineRisk = "low" | "medium" | "high";

/**
 * Calculates deadline risk based on days remaining and optional assignee overload status.
 * Overdue active tasks always return "high".
 * Tasks assigned to overloaded members are escalated one risk level.
 */
export function getDeadlineRisk(
  task: Task,
  assigneeWorkloadStatus?: WorkloadStatus
): DeadlineRisk {
  if (task.status === "done") {
    return "low";
  }

  // Parse task deadline and current date at midnight
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const deadlineDate = new Date(task.deadline);
  deadlineDate.setHours(0, 0, 0, 0);

  const diffTime = deadlineDate.getTime() - now.getTime();
  const daysUntilDeadline = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Past deadline and not done is strictly high risk
  if (daysUntilDeadline < 0) {
    return "high";
  }

  let baseRisk: DeadlineRisk;
  if (daysUntilDeadline <= DEADLINE_HIGH_RISK_DAYS) {
    baseRisk = "high";
  } else if (daysUntilDeadline <= DEADLINE_MEDIUM_RISK_DAYS) {
    baseRisk = "medium";
  } else {
    baseRisk = "low";
  }

  // Escalate risk one level if the assignee is overloaded
  if (assigneeWorkloadStatus === "overloaded") {
    if (baseRisk === "low") {
      return "medium";
    }
    if (baseRisk === "medium") {
      return "high";
    }
  }

  return baseRisk;
}
