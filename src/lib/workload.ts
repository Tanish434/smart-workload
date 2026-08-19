import type { Member } from "../types/member";
import type { Task } from "../types/task";
import { OVERLOAD_THRESHOLD, AT_RISK_THRESHOLD } from "./constants";

export type WorkloadStatus = "normal" | "at_risk" | "overloaded";

/**
 * Returns all active tasks assigned to a specific member (excluding done tasks).
 */
export function getMemberActiveTasks(memberId: string, tasks: Task[]): Task[] {
  return tasks.filter(
    (task) => task.assignedTo === memberId && task.status !== "done"
  );
}

/**
 * Calculates a member's workload as a percentage of their weekly capacity.
 */
export function calculateWorkloadPercent(
  memberId: string,
  tasks: Task[],
  members: Member[]
): number {
  const member = members.find((m) => m.id === memberId);
  if (!member || member.capacityHoursPerWeek <= 0) {
    return 0;
  }

  const activeTasks = getMemberActiveTasks(memberId, tasks);
  const totalHours = activeTasks.reduce(
    (sum, task) => sum + (task.estimatedHours || 0),
    0
  );

  return Math.round((totalHours / member.capacityHoursPerWeek) * 100);
}

/**
 * Derives workload status based on workload percentage and defined thresholds.
 */
export function getWorkloadStatus(percent: number): WorkloadStatus {
  if (percent >= OVERLOAD_THRESHOLD) {
    return "overloaded";
  }
  if (percent >= AT_RISK_THRESHOLD) {
    return "at_risk";
  }
  return "normal";
}
