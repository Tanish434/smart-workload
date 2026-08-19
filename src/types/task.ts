export type TaskPriority = "low" | "medium" | "high";
export type EffectivePriority = "low" | "medium" | "high" | "critical";
export type TaskStatus = "todo" | "in_progress" | "done";

export interface TaskAging {
  score: number;
  effectivePriority: EffectivePriority;
  isEscalated: boolean;
  reasons: string[];
  daysRemaining: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  requiredSkill: string;
  priority: TaskPriority;
  deadline: string; // ISO date
  status: TaskStatus;
  estimatedHours: number;
  assignedTo: string | null; // Member.id
  projectId?: string | null; // Project.id
}
