export type ProjectStatus = "planning" | "active" | "completed" | "on_hold";

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  status: ProjectStatus;
  memberIds: string[]; // Members assigned to this project
  leadId: string | null; // Project Lead / Manager
  startDate: string; // ISO date
  targetDate: string; // ISO date
  resourceQuotaHours?: number; // Configurable effort quota cap (hours)
  resourceQuotaBudget?: number; // Configurable financial budget cap ($)
}
