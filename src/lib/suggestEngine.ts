import type { Member } from "../types/member";
import type { Task } from "../types/task";
import { calculateWorkloadPercent } from "./workload";
import { AT_RISK_THRESHOLD, OVERLOAD_THRESHOLD } from "./constants";

export interface SuggestedMemberResult {
  member: Member;
  score: number;
  reasons: string[];
}

/**
 * Ranks eligible members for a task based on skill match, current workload, and availability.
 * Excludes unavailable members.
 */
export function getSuggestedMembers(
  draftTask: Pick<Task, "requiredSkill" | "priority">,
  members: Member[],
  tasks: Task[]
): SuggestedMemberResult[] {
  // Exclude members marked as unavailable
  const eligibleMembers = members.filter(
    (m) => m.availability !== "unavailable"
  );

  const results: SuggestedMemberResult[] = eligibleMembers.map((member) => {
    let score = 0;
    const reasons: string[] = [];

    // 1. Skill Match: +40 points
    const hasSkill =
      draftTask.requiredSkill &&
      member.skills.includes(draftTask.requiredSkill);
    if (hasSkill) {
      score += 40;
      reasons.push("Has required skill");
    }

    // 2. Workload capacity: +30 * (1 - workload%/100), clamped at 0
    const workloadPercent = calculateWorkloadPercent(member.id, tasks, members);
    const capacityScore = Math.max(0, 30 * (1 - workloadPercent / 100));
    score += capacityScore;

    if (workloadPercent < 50) {
      reasons.push("Low current workload");
    } else if (workloadPercent < AT_RISK_THRESHOLD) {
      reasons.push("Available capacity");
    } else if (workloadPercent >= OVERLOAD_THRESHOLD) {
      reasons.push("Overloaded");
    }

    // 3. Availability: +20 points if available
    if (member.availability === "available") {
      score += 20;
      reasons.push("Currently available");
    }

    return {
      member,
      score: Math.round(score * 10) / 10,
      reasons,
    };
  });

  // Sort descending by score
  return results.sort((a, b) => b.score - a.score);
}
