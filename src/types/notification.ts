export type NotificationType = "alert" | "info" | "success" | "warning";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string; // ISO or relative
  read: boolean;
  link?: string;
}
