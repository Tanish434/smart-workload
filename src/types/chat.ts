import type { Member } from "./member";
import type { Project } from "./project";

export interface ChatMessage {
  id: string;
  senderId: string; // "admin" or memberId
  receiverId: string; // "admin" or memberId
  text: string;
  timestamp: string; // e.g. "10:42 AM" or ISO string
  createdAt: number;
  read: boolean;
  projectId?: string | null;
}

export interface ChatThread {
  member: Member;
  projects: Project[];
  lastMessage?: ChatMessage;
  unreadCount: number;
}
