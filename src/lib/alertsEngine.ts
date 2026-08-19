import type { Member } from "../types/member";
import type { Task } from "../types/task";
import {
  calculateWorkloadPercent,
  getWorkloadStatus,
  getMemberActiveTasks,
} from "./workload";
import { getDeadlineRisk, DeadlineRisk } from "./deadlineRisk";
import { getSuggestedMembers } from "./suggestEngine";
import { OVERLOAD_THRESHOLD } from "./constants";

export interface RebalanceSuggestion {
  task: Task;
  from: Member;
  to: Member;
}

export interface DeadlineRiskItem {
  task: Task;
  risk: DeadlineRisk;
}

export interface AlertsSummary {
  overloadedMembers: Member[];
  deadlineRisks: DeadlineRiskItem[];
  rebalanceSuggestions: RebalanceSuggestion[];
}

/**
 * Derives current system alerts including overloaded members, deadline risks,
 * and automated rebalancing recommendations.
 */
export function deriveAlerts(
  members: Member[],
  tasks: Task[]
): AlertsSummary {
  // 1. Identify overloaded members
  const overloadedMembers = members.filter((member) => {
    const percent = calculateWorkloadPercent(member.id, tasks, members);
    return getWorkloadStatus(percent) === "overloaded";
  });

  // Map member id to workload status for quick lookup
  const memberWorkloadStatusMap = new Map<string, "normal" | "at_risk" | "overloaded">();
  members.forEach((m) => {
    const percent = calculateWorkloadPercent(m.id, tasks, members);
    memberWorkloadStatusMap.set(m.id, getWorkloadStatus(percent));
  });

  // 2. Derive deadline risks for all active tasks
  const activeTasks = tasks.filter((t) => t.status !== "done");
  const deadlineRisks: DeadlineRiskItem[] = activeTasks
    .map((task) => {
      const assigneeStatus = task.assignedTo
        ? memberWorkloadStatusMap.get(task.assignedTo)
        : undefined;
      const risk = getDeadlineRisk(task, assigneeStatus);
      return { task, risk };
    })
    .sort((a, b) => {
      // Prioritize high risk > medium risk > low risk
      const riskRank: Record<DeadlineRisk, number> = {
        high: 3,
        medium: 2,
        low: 1,
      };
      if (riskRank[b.risk] !== riskRank[a.risk]) {
        return riskRank[b.risk] - riskRank[a.risk];
      }
      return new Date(a.task.deadline).getTime() - new Date(b.task.deadline).getTime();
    });

  // 3. Compute rebalance suggestions for tasks assigned to overloaded members
  const rebalanceSuggestions: RebalanceSuggestion[] = [];
  const processedTaskIds = new Set<string>();

  for (const overloadedMember of overloadedMembers) {
    const memberTasks = getMemberActiveTasks(overloadedMember.id, tasks);

    for (const task of memberTasks) {
      if (processedTaskIds.has(task.id)) continue;

      const suggestions = getSuggestedMembers(
        { requiredSkill: task.requiredSkill, priority: task.priority },
        members,
        tasks
      );

      // Find best alternative candidate who is not the current assignee and not overloaded
      const candidate = suggestions.find((s) => {
        if (s.member.id === overloadedMember.id) return false;
        const candidateWorkload = calculateWorkloadPercent(
          s.member.id,
          tasks,
          members
        );
        return candidateWorkload < OVERLOAD_THRESHOLD;
      });

      if (candidate) {
        processedTaskIds.add(task.id);
        rebalanceSuggestions.push({
          task,
          from: overloadedMember,
          to: candidate.member,
        });
      }
    }
  }

  return {
    overloadedMembers,
    deadlineRisks,
    rebalanceSuggestions,
  };
}
