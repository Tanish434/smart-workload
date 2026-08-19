import type { Task, TaskPriority, EffectivePriority, TaskAging } from "../types/task";
import type { WorkloadStatus } from "./workload";

/**
 * Calculates days remaining from today until deadline.
 */
export function getDaysRemaining(deadline: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const due = new Date(deadline);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

const BASE_PRIORITY_SCORES: Record<TaskPriority, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

/**
 * OS-Inspired Priority Scheduling with Aging Feedback Algorithm.
 * Dynamically computes an effective priority score for a task.
 */
export function computeTaskAging(
  task: Task,
  assigneeWorkloadStatus?: WorkloadStatus
): TaskAging {
  // If task is completed, no escalation needed
  if (task.status === "done") {
    return {
      score: BASE_PRIORITY_SCORES[task.priority],
      effectivePriority: task.priority,
      isEscalated: false,
      reasons: ["Task completed"],
      daysRemaining: getDaysRemaining(task.deadline),
    };
  }

  const daysRemaining = getDaysRemaining(task.deadline);
  let score = BASE_PRIORITY_SCORES[task.priority];
  const reasons: string[] = [];

  // 1. Deadline Aging Factor (Looming Deadline Boost)
  if (daysRemaining < 0) {
    score += 4;
    reasons.push(`Overdue by ${Math.abs(daysRemaining)} day(s)`);
  } else if (daysRemaining === 0) {
    score += 3;
    reasons.push("Due today (Emergency Aging)");
  } else if (daysRemaining === 1) {
    score += 3;
    reasons.push("Due tomorrow (High Aging Boost)");
  } else if (daysRemaining <= 3) {
    score += 2;
    reasons.push(`Due in ${daysRemaining} days (Aging Boost +2)`);
  } else if (daysRemaining <= 5 && task.priority === "low") {
    score += 1;
    reasons.push(`Due in ${daysRemaining} days (Aging Boost +1)`);
  }

  // 2. Resource Contention / Workload Feedback Loop
  if (assigneeWorkloadStatus === "overloaded") {
    score += 1;
    reasons.push("Assignee is overloaded (>100% capacity)");
  }

  // 3. Starvation Penalty (Unassigned & pending)
  if (!task.assignedTo && daysRemaining <= 5) {
    score += 1;
    reasons.push("Unassigned starvation penalty");
  }

  // Determine Effective Priority based on dynamic composite score
  let effectivePriority: EffectivePriority = task.priority;
  if (score >= 5) {
    effectivePriority = "critical";
  } else if (score >= 4) {
    effectivePriority = "high";
  } else if (score >= 2) {
    effectivePriority = "medium";
  } else {
    effectivePriority = "low";
  }

  // Compare effective priority weight against base priority weight
  const priorityRank: Record<EffectivePriority, number> = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  };

  const isEscalated =
    priorityRank[effectivePriority] > priorityRank[task.priority];

  return {
    score,
    effectivePriority,
    isEscalated,
    reasons,
    daysRemaining,
  };
}
