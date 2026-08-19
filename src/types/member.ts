export type MemberAvailability = "available" | "busy" | "unavailable";

export interface Member {
  id: string;
  name: string;
  role: string;
  skills: string[];
  availability: "available" | "busy" | "unavailable";
  capacityHoursPerWeek: number;
  avatar?: string;
}
