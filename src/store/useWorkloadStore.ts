import { useMemo } from "react";
import { create } from "zustand";
import type { Member, MemberAvailability } from "../types/member";
import type {
  Task,
  TaskPriority,
  EffectivePriority,
  TaskStatus,
  TaskAging,
} from "../types/task";
import type { Project, ProjectStatus } from "../types/project";
import type { Notification, NotificationType } from "../types/notification";
import type { ChatMessage, ChatThread } from "../types/chat";
import {
  seedMembers,
  seedTasks,
  seedProjects,
  seedNotifications,
  seedChatMessages,
} from "../data/seed";
import {
  calculateWorkloadPercent,
  getWorkloadStatus,
  getMemberActiveTasks,
  WorkloadStatus,
} from "../lib/workload";
import { getDeadlineRisk, DeadlineRisk } from "../lib/deadlineRisk";
import { deriveAlerts, AlertsSummary } from "../lib/alertsEngine";
import { getSuggestedMembers } from "../lib/suggestEngine";
import { computeTaskAging } from "../lib/priorityScheduler";

export interface EnrichedMember extends Member {
  workloadPercent: number;
  workloadStatus: WorkloadStatus;
  activeTaskCount: number;
  activeTasks: Task[];
  projects: Project[];
}

export interface EnrichedTask extends Task {
  deadlineRisk: DeadlineRisk;
  aging: TaskAging;
  effectivePriority: EffectivePriority;
  assignee?: Member | null;
  project?: Project | null;
}

export interface ProjectExpenditure {
  totalEstimatedHours: number;
  completedHours: number;
  activeHours: number;
  blendedHourlyRate: number;
  totalBudget: number;
  burnedCost: number;
  remainingBudget: number;
  burnRatePercent: number;
  teamCapacityWeekly: number;
  fteCommitment: number;
}

export interface EnrichedProject extends Project {
  members: Member[];
  lead?: Member | null;
  tasks: Task[];
  activeTasks: Task[];
  totalEstimatedHours: number;
  completionPercent: number;
  expenditure: ProjectExpenditure;
}

export interface TaskFilters {
  status?: TaskStatus | "all";
  priority?: TaskPriority | "all";
  effectivePriority?: EffectivePriority | "all";
  assignedTo?: string | "all" | null;
  projectId?: string | "all" | null;
  search?: string;
  skill?: string | "all";
}

export interface DashboardSummary {
  totalMembers: number;
  activeTasks: number;
  pendingTasksCount: number;
  inProgressTasksCount: number;
  overloadedCount: number;
  upcomingDeadlineCount: number;
  escalatedPriorityCount: number;
  unassignedTasksCount: number;
  totalProjects: number;
}

export interface WorkloadStoreState {
  members: Member[];
  tasks: Task[];
  projects: Project[];
  notifications: Notification[];
  messages: ChatMessage[];

  // Task Actions
  createTask: (data: Omit<Task, "id">) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  reassignTask: (
    taskId: string,
    newAssigneeId: string | null,
    reason?: string
  ) => void;

  // Member Actions
  createMember: (data: Omit<Member, "id">) => Member;
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (
    id: string,
    reassignStrategy?: "unassign" | "auto_reassign" | "reassign_to",
    targetMemberId?: string
  ) => Task[];
  updateMemberAvailability: (
    id: string,
    status: MemberAvailability
  ) => Task[];

  // Project Actions
  createProject: (data: Omit<Project, "id">) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  assignMemberToProject: (projectId: string, memberId: string) => void;
  removeMemberFromProject: (projectId: string, memberId: string) => void;
  shiftMemberProjects: (
    memberId: string,
    fromProjectId: string,
    toProjectId: string
  ) => void;

  // Notification Actions
  addNotification: (
    data: Omit<Notification, "id" | "timestamp" | "read">
  ) => Notification;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearAllNotifications: () => void;

  // Chat Actions
  sendMessage: (
    senderId: string,
    receiverId: string,
    text: string,
    projectId?: string | null
  ) => ChatMessage;
  markThreadAsRead: (memberId: string) => void;
  clearThreadMessages: (memberId: string) => void;

  // Reset
  resetToSeed: () => void;
}

export const useWorkloadStore = create<WorkloadStoreState>((set, get) => ({
  members: [...seedMembers],
  tasks: [...seedTasks],
  projects: [...seedProjects],
  notifications: [...seedNotifications],
  messages: [...seedChatMessages],

  // ----------------------------------------------------
  // TASK ACTIONS
  // ----------------------------------------------------
  createTask: (data: Omit<Task, "id">): Task => {
    const newTask: Task = {
      ...data,
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };

    set((state) => ({
      tasks: [newTask, ...state.tasks],
    }));

    // Trigger in-app notification
    get().addNotification({
      title: "Task Created",
      message: `Task "${newTask.title}" added to backlog with ${newTask.estimatedHours}h effort.`,
      type: "info",
      link: `/tasks/${newTask.id}`,
    });

    return newTask;
  },

  updateTask: (id: string, updates: Partial<Task>) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    }));
  },

  deleteTask: (id: string) => {
    const task = get().tasks.find((t) => t.id === id);
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));

    if (task) {
      get().addNotification({
        title: "Task Deleted",
        message: `Task "${task.title}" was removed from the task board.`,
        type: "warning",
        link: "/tasks",
      });
    }
  },

  reassignTask: (
    taskId: string,
    newAssigneeId: string | null,
    reason?: string
  ) => {
    const { tasks, members } = get();
    const task = tasks.find((t) => t.id === taskId);
    const newAssignee = members.find((m) => m.id === newAssigneeId);

    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, assignedTo: newAssigneeId } : t
      ),
    }));

    if (task) {
      const assigneeName = newAssignee ? newAssignee.name : "Unassigned Backlog";
      get().addNotification({
        title: "Task Reassigned",
        message: `"${task.title}" transferred to ${assigneeName}${
          reason ? ` (${reason})` : ""
        }.`,
        type: "info",
        link: `/tasks/${taskId}`,
      });
    }
  },

  // ----------------------------------------------------
  // MEMBER ACTIONS
  // ----------------------------------------------------
  createMember: (data: Omit<Member, "id">): Member => {
    const newMember: Member = {
      ...data,
      id: `m_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };

    set((state) => ({
      members: [newMember, ...state.members],
    }));

    get().addNotification({
      title: "New Team Member",
      message: `${newMember.name} joined as ${newMember.role} (${newMember.capacityHoursPerWeek}h/week).`,
      type: "success",
      link: `/team/${newMember.id}`,
    });

    return newMember;
  },

  updateMember: (id: string, updates: Partial<Member>) => {
    set((state) => ({
      members: state.members.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    }));
  },

  deleteMember: (
    id: string,
    reassignStrategy: "unassign" | "auto_reassign" | "reassign_to" = "unassign",
    targetMemberId?: string
  ): Task[] => {
    const { members, tasks } = get();
    const memberToDelete = members.find((m) => m.id === id);
    const activeTasks = getMemberActiveTasks(id, tasks);
    const affectedTasks = tasks.filter((t) => t.assignedTo === id);

    let updatedTasks = [...tasks];

    if (reassignStrategy === "unassign") {
      updatedTasks = updatedTasks.map((t) =>
        t.assignedTo === id ? { ...t, assignedTo: null } : t
      );
    } else if (reassignStrategy === "reassign_to" && targetMemberId) {
      updatedTasks = updatedTasks.map((t) =>
        t.assignedTo === id ? { ...t, assignedTo: targetMemberId } : t
      );
    } else if (reassignStrategy === "auto_reassign") {
      const remainingMembers = members.filter((m) => m.id !== id);
      updatedTasks = updatedTasks.map((t) => {
        if (t.assignedTo === id && t.status !== "done") {
          const suggestions = getSuggestedMembers(
            t,
            remainingMembers,
            updatedTasks
          );
          const topPick = suggestions[0]?.member?.id || null;
          return { ...t, assignedTo: topPick };
        } else if (t.assignedTo === id) {
          return { ...t, assignedTo: null };
        }
        return t;
      });
    }

    set((state) => ({
      members: state.members.filter((m) => m.id !== id),
      tasks: updatedTasks,
      projects: state.projects.map((p) => ({
        ...p,
        memberIds: p.memberIds.filter((mId) => mId !== id),
        leadId: p.leadId === id ? null : p.leadId,
      })),
    }));

    if (memberToDelete) {
      get().addNotification({
        title: "Member Removed",
        message: `${memberToDelete.name} was removed from the roster. ${activeTasks.length} active tasks were redistributed.`,
        type: "warning",
        link: "/team",
      });
    }

    return affectedTasks;
  },

  updateMemberAvailability: (id: string, status: MemberAvailability): Task[] => {
    const { tasks, members } = get();
    const activeTasks = getMemberActiveTasks(id, tasks);
    const member = members.find((m) => m.id === id);

    set((state) => ({
      members: state.members.map((m) =>
        m.id === id ? { ...m, availability: status } : m
      ),
    }));

    if (member) {
      get().addNotification({
        title: "Availability Updated",
        message: `${member.name} is now marked as "${status}".`,
        type: status === "unavailable" ? "warning" : "info",
        link: `/team/${member.id}`,
      });
    }

    return activeTasks;
  },

  // ----------------------------------------------------
  // PROJECT ACTIONS
  // ----------------------------------------------------
  createProject: (data: Omit<Project, "id">): Project => {
    const newProject: Project = {
      ...data,
      id: `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };

    set((state) => ({
      projects: [newProject, ...state.projects],
    }));

    get().addNotification({
      title: "Project Initialized",
      message: `Project "${newProject.name}" created with ${newProject.memberIds.length} teammates.`,
      type: "success",
      link: `/projects/${newProject.id}`,
    });

    return newProject;
  },

  updateProject: (id: string, updates: Partial<Project>) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    }));
  },

  deleteProject: (id: string) => {
    const project = get().projects.find((p) => p.id === id);

    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      tasks: state.tasks.map((t) =>
        t.projectId === id ? { ...t, projectId: null } : t
      ),
    }));

    if (project) {
      get().addNotification({
        title: "Project Deleted",
        message: `Project "${project.name}" was removed. Associated tasks were unlinked.`,
        type: "warning",
        link: "/projects",
      });
    }
  },

  assignMemberToProject: (projectId: string, memberId: string) => {
    const project = get().projects.find((p) => p.id === projectId);
    const member = get().members.find((m) => m.id === memberId);

    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId && !p.memberIds.includes(memberId)
          ? { ...p, memberIds: [...p.memberIds, memberId] }
          : p
      ),
    }));

    if (project && member) {
      get().addNotification({
        title: "Member Assigned to Project",
        message: `Added ${member.name} to "${project.name}".`,
        type: "info",
        link: `/projects/${project.id}`,
      });
    }
  },

  removeMemberFromProject: (projectId: string, memberId: string) => {
    const project = get().projects.find((p) => p.id === projectId);
    const member = get().members.find((m) => m.id === memberId);

    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              memberIds: p.memberIds.filter((id) => id !== memberId),
              leadId: p.leadId === memberId ? null : p.leadId,
            }
          : p
      ),
    }));

    if (project && member) {
      get().addNotification({
        title: "Member Removed from Project",
        message: `Removed ${member.name} from "${project.name}".`,
        type: "warning",
        link: `/projects/${project.id}`,
      });
    }
  },

  shiftMemberProjects: (
    memberId: string,
    fromProjectId: string,
    toProjectId: string
  ) => {
    const { members, projects } = get();
    const member = members.find((m) => m.id === memberId);
    const fromP = projects.find((p) => p.id === fromProjectId);
    const toP = projects.find((p) => p.id === toProjectId);

    set((state) => ({
      projects: state.projects.map((p) => {
        if (p.id === fromProjectId) {
          return {
            ...p,
            memberIds: p.memberIds.filter((id) => id !== memberId),
            leadId: p.leadId === memberId ? null : p.leadId,
          };
        }
        if (p.id === toProjectId) {
          return {
            ...p,
            memberIds: p.memberIds.includes(memberId)
              ? p.memberIds
              : [...p.memberIds, memberId],
          };
        }
        return p;
      }),
    }));

    if (member && fromP && toP) {
      get().addNotification({
        title: "Member Reassigned Project",
        message: `Shifted ${member.name} from "${fromP.name}" to "${toP.name}".`,
        type: "info",
        link: `/projects/${toP.id}`,
      });
    }
  },

  // ----------------------------------------------------
  // NOTIFICATION ACTIONS
  // ----------------------------------------------------
  addNotification: (
    data: Omit<Notification, "id" | "timestamp" | "read">
  ): Notification => {
    const newNotification: Notification = {
      ...data,
      id: `n_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: "Just now",
      read: false,
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications],
    }));

    return newNotification;
  },

  markNotificationAsRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  markAllNotificationsAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },

  clearAllNotifications: () => {
    set({ notifications: [] });
  },

  // ----------------------------------------------------
  // CHAT ACTIONS
  // ----------------------------------------------------
  sendMessage: (
    senderId: string,
    receiverId: string,
    text: string,
    projectId?: string | null
  ): ChatMessage => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      senderId,
      receiverId,
      text: text.trim(),
      timestamp: "Just now",
      createdAt: Date.now(),
      read: senderId === "admin", // Admin messages start as read
      projectId: projectId || null,
    };

    set((state) => ({
      messages: [...state.messages, newMsg],
    }));

    // If Admin sends message to member, trigger simulated realistic teammate auto-reply
    if (senderId === "admin") {
      const targetMember = get().members.find((m) => m.id === receiverId);
      if (targetMember) {
        setTimeout(() => {
          const autoReplies = [
            `Got it! I will review the tasks for ${targetMember.role} right away.`,
            `Thanks for the update. My capacity is aligned and I am on track.`,
            `Understood! Working on the current sprint deliverables now.`,
            `Received! Let me coordinate with the project lead and circle back.`,
          ];
          const replyText =
            autoReplies[Math.floor(Math.random() * autoReplies.length)];

          const replyMsg: ChatMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            senderId: receiverId,
            receiverId: "admin",
            text: replyText,
            timestamp: "Just now",
            createdAt: Date.now(),
            read: false,
            projectId: projectId || null,
          };

          set((state) => ({
            messages: [...state.messages, replyMsg],
          }));

          get().addNotification({
            title: `Message from ${targetMember.name}`,
            message: replyText,
            type: "info",
            link: `/chat?memberId=${targetMember.id}`,
          });
        }, 1200);
      }
    }

    return newMsg;
  },

  markThreadAsRead: (memberId: string) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        (m.senderId === memberId && m.receiverId === "admin")
          ? { ...m, read: true }
          : m
      ),
    }));
  },

  clearThreadMessages: (memberId: string) => {
    set((state) => ({
      messages: state.messages.filter(
        (m) =>
          !(
            (m.senderId === memberId && m.receiverId === "admin") ||
            (m.senderId === "admin" && m.receiverId === memberId)
          )
      ),
    }));
  },

  // ----------------------------------------------------
  // RESET
  // ----------------------------------------------------
  resetToSeed: () => {
    set({
      members: [...seedMembers],
      tasks: [...seedTasks],
      projects: [...seedProjects],
      notifications: [...seedNotifications],
      messages: [...seedChatMessages],
    });
  },
}));

// ====================================================
// SELECTOR HOOKS
// ====================================================

/**
 * Hook to retrieve all members with live computed workload, status, and assigned projects.
 */
export function useMembers(): EnrichedMember[] {
  const members = useWorkloadStore((state) => state.members);
  const tasks = useWorkloadStore((state) => state.tasks);
  const projects = useWorkloadStore((state) => state.projects);

  return useMemo(() => {
    return members.map((member) => {
      const percent = calculateWorkloadPercent(member.id, tasks, members);
      const status = getWorkloadStatus(percent);
      const activeTasks = getMemberActiveTasks(member.id, tasks);
      const memberProjects = projects.filter((p) =>
        p.memberIds.includes(member.id)
      );

      return {
        ...member,
        workloadPercent: percent,
        workloadStatus: status,
        activeTaskCount: activeTasks.length,
        activeTasks,
        projects: memberProjects,
      };
    });
  }, [members, tasks, projects]);
}

/**
 * Hook to retrieve a single member by ID.
 */
export function useMemberById(
  id: string
): (EnrichedMember & { tasks: Task[] }) | undefined {
  const members = useWorkloadStore((state) => state.members);
  const tasks = useWorkloadStore((state) => state.tasks);
  const projects = useWorkloadStore((state) => state.projects);

  return useMemo(() => {
    const member = members.find((m) => m.id === id);
    if (!member) return undefined;

    const percent = calculateWorkloadPercent(member.id, tasks, members);
    const status = getWorkloadStatus(percent);
    const activeTasks = getMemberActiveTasks(member.id, tasks);
    const memberTasks = tasks.filter((t) => t.assignedTo === id);
    const memberProjects = projects.filter((p) => p.memberIds.includes(id));

    return {
      ...member,
      workloadPercent: percent,
      workloadStatus: status,
      activeTaskCount: activeTasks.length,
      activeTasks,
      tasks: memberTasks,
      projects: memberProjects,
    };
  }, [members, tasks, projects, id]);
}

/**
 * Hook to retrieve tasks with computed deadlineRisk, OS priority aging, assignee, and project details.
 */
export function useTasks(filters?: TaskFilters): EnrichedTask[] {
  const tasks = useWorkloadStore((state) => state.tasks);
  const members = useWorkloadStore((state) => state.members);
  const projects = useWorkloadStore((state) => state.projects);

  return useMemo(() => {
    const memberMap = new Map<string, Member>();
    members.forEach((m) => memberMap.set(m.id, m));

    const projectMap = new Map<string, Project>();
    projects.forEach((p) => projectMap.set(p.id, p));

    const memberStatusMap = new Map<string, WorkloadStatus>();
    members.forEach((m) => {
      const pct = calculateWorkloadPercent(m.id, tasks, members);
      memberStatusMap.set(m.id, getWorkloadStatus(pct));
    });

    return tasks
      .filter((task) => {
        if (
          filters?.status &&
          filters.status !== "all" &&
          task.status !== filters.status
        ) {
          return false;
        }
        if (
          filters?.priority &&
          filters.priority !== "all" &&
          task.priority !== filters.priority
        ) {
          return false;
        }
        if (filters?.assignedTo !== undefined && filters.assignedTo !== "all") {
          if (filters.assignedTo === null && task.assignedTo !== null)
            return false;
          if (
            filters.assignedTo !== null &&
            task.assignedTo !== filters.assignedTo
          )
            return false;
        }
        if (filters?.projectId !== undefined && filters.projectId !== "all") {
          if (filters.projectId === null && task.projectId !== null)
            return false;
          if (
            filters.projectId !== null &&
            task.projectId !== filters.projectId
          )
            return false;
        }
        if (
          filters?.skill &&
          filters.skill !== "all" &&
          task.requiredSkill !== filters.skill
        ) {
          return false;
        }
        if (filters?.search) {
          const query = filters.search.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(query);
          const matchDesc = task.description.toLowerCase().includes(query);
          const matchSkill = task.requiredSkill.toLowerCase().includes(query);
          if (!matchTitle && !matchDesc && !matchSkill) return false;
        }
        return true;
      })
      .map((task) => {
        const assigneeStatus = task.assignedTo
          ? memberStatusMap.get(task.assignedTo)
          : undefined;
        const risk = getDeadlineRisk(task, assigneeStatus);
        const aging = computeTaskAging(task, assigneeStatus);
        const assignee = task.assignedTo ? memberMap.get(task.assignedTo) : null;
        const project = task.projectId ? projectMap.get(task.projectId) : null;

        return {
          ...task,
          deadlineRisk: risk,
          aging,
          effectivePriority: aging.effectivePriority,
          assignee,
          project,
        };
      })
      .filter((task) => {
        if (
          filters?.effectivePriority &&
          filters.effectivePriority !== "all" &&
          task.effectivePriority !== filters.effectivePriority
        ) {
          return false;
        }
        return true;
      });
  }, [
    tasks,
    members,
    projects,
    filters?.status,
    filters?.priority,
    filters?.effectivePriority,
    filters?.assignedTo,
    filters?.projectId,
    filters?.skill,
    filters?.search,
  ]);
}

/**
 * Hook to retrieve a single task by ID with OS Priority Aging.
 */
export function useTaskById(id: string): EnrichedTask | undefined {
  const tasks = useWorkloadStore((state) => state.tasks);
  const members = useWorkloadStore((state) => state.members);
  const projects = useWorkloadStore((state) => state.projects);

  return useMemo(() => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return undefined;

    const member = task.assignedTo
      ? members.find((m) => m.id === task.assignedTo)
      : null;
    const project = task.projectId
      ? projects.find((p) => p.id === task.projectId)
      : null;
    const assigneeStatus = member
      ? getWorkloadStatus(calculateWorkloadPercent(member.id, tasks, members))
      : undefined;

    const aging = computeTaskAging(task, assigneeStatus);

    return {
      ...task,
      deadlineRisk: getDeadlineRisk(task, assigneeStatus),
      aging,
      effectivePriority: aging.effectivePriority,
      assignee: member,
      project,
    };
  }, [tasks, members, projects, id]);
}

/**
 * Hook to retrieve all projects enriched with members, tasks, and progress.
 */
export function useProjects(): EnrichedProject[] {
  const projects = useWorkloadStore((state) => state.projects);
  const members = useWorkloadStore((state) => state.members);
  const tasks = useWorkloadStore((state) => state.tasks);

  return useMemo(() => {
    const memberMap = new Map<string, Member>();
    members.forEach((m) => memberMap.set(m.id, m));

    return projects.map((p) => {
      const projectMembers = p.memberIds
        .map((id) => memberMap.get(id))
        .filter(Boolean) as Member[];
      const lead = p.leadId ? memberMap.get(p.leadId) : null;
      const projectTasks = tasks.filter((t) => t.projectId === p.id);
      const activeTasks = projectTasks.filter((t) => t.status !== "done");
      const doneTasks = projectTasks.filter((t) => t.status === "done");
      const totalHours = projectTasks.reduce(
        (sum, t) => sum + (t.estimatedHours || 0),
        0
      );
      const doneHours = doneTasks.reduce(
        (sum, t) => sum + (t.estimatedHours || 0),
        0
      );
      const activeHours = activeTasks.reduce(
        (sum, t) => sum + (t.estimatedHours || 0),
        0
      );

      const completionPercent =
        projectTasks.length > 0
          ? Math.round((doneTasks.length / projectTasks.length) * 100)
          : 0;

      // Resource & Financial Expenditure Calculation ($85/hr blended rate)
      const blendedHourlyRate = 85;
      const totalBudget = totalHours * blendedHourlyRate;
      const burnedCost = doneHours * blendedHourlyRate;
      const remainingBudget = activeHours * blendedHourlyRate;
      const burnRatePercent =
        totalHours > 0 ? Math.round((doneHours / totalHours) * 100) : 0;
      const teamCapacityWeekly = projectMembers.reduce(
        (sum, m) => sum + (m.capacityHoursPerWeek || 0),
        0
      );
      const fteCommitment = Math.round((teamCapacityWeekly / 40) * 10) / 10;

      const expenditure: ProjectExpenditure = {
        totalEstimatedHours: totalHours,
        completedHours: doneHours,
        activeHours,
        blendedHourlyRate,
        totalBudget,
        burnedCost,
        remainingBudget,
        burnRatePercent,
        teamCapacityWeekly,
        fteCommitment,
      };

      return {
        ...p,
        members: projectMembers,
        lead,
        tasks: projectTasks,
        activeTasks,
        totalEstimatedHours: totalHours,
        completionPercent,
        expenditure,
      };
    });
  }, [projects, members, tasks]);
}

/**
 * Hook to retrieve a single project by ID.
 */
export function useProjectById(id: string): EnrichedProject | undefined {
  const projects = useProjects();
  return useMemo(() => {
    return projects.find((p) => p.id === id);
  }, [projects, id]);
}

/**
 * Hook to retrieve in-app notifications and unread counts.
 */
export function useNotifications() {
  const notifications = useWorkloadStore((state) => state.notifications);
  return useMemo(() => {
    const unreadCount = notifications.filter((n) => !n.read).length;
    return {
      notifications,
      unreadCount,
    };
  }, [notifications]);
}

/**
 * Hook to retrieve chat threads for all team members.
 */
export function useChatThreads(): ChatThread[] {
  const members = useWorkloadStore((state) => state.members);
  const projects = useWorkloadStore((state) => state.projects);
  const messages = useWorkloadStore((state) => state.messages);

  return useMemo(() => {
    return members.map((member) => {
      const memberProjects = projects.filter((p) =>
        p.memberIds.includes(member.id)
      );

      const threadMessages = messages.filter(
        (m) =>
          (m.senderId === member.id && m.receiverId === "admin") ||
          (m.senderId === "admin" && m.receiverId === member.id)
      );

      const lastMessage = threadMessages[threadMessages.length - 1];
      const unreadCount = threadMessages.filter(
        (m) => m.senderId === member.id && !m.read
      ).length;

      return {
        member,
        projects: memberProjects,
        lastMessage,
        unreadCount,
      };
    });
  }, [members, projects, messages]);
}

/**
 * Hook to retrieve chat messages for a specific member thread.
 */
export function useChatMessages(memberId: string): ChatMessage[] {
  const messages = useWorkloadStore((state) => state.messages);
  return useMemo(() => {
    return messages.filter(
      (m) =>
        (m.senderId === memberId && m.receiverId === "admin") ||
        (m.senderId === "admin" && m.receiverId === memberId)
    );
  }, [messages, memberId]);
}

/**
 * Hook to retrieve total unread chat messages for admin.
 */
export function useUnreadChatCount(): number {
  const messages = useWorkloadStore((state) => state.messages);
  return useMemo(() => {
    return messages.filter((m) => m.senderId !== "admin" && !m.read).length;
  }, [messages]);
}

/**
 * Hook to retrieve current system alerts and rebalance suggestions.
 */
export function useAlerts(): AlertsSummary {
  const members = useWorkloadStore((state) => state.members);
  const tasks = useWorkloadStore((state) => state.tasks);

  return useMemo(() => {
    return deriveAlerts(members, tasks);
  }, [members, tasks]);
}

/**
 * Hook to retrieve high-level dashboard summary metrics.
 */
export function useDashboardSummary(): DashboardSummary {
  const members = useWorkloadStore((state) => state.members);
  const tasks = useWorkloadStore((state) => state.tasks);
  const projects = useWorkloadStore((state) => state.projects);

  return useMemo(() => {
    const alerts = deriveAlerts(members, tasks);
    const activeTasks = tasks.filter((t) => t.status !== "done");
    const pendingTasks = tasks.filter((t) => t.status === "todo");
    const inProgressTasks = tasks.filter((t) => t.status === "in_progress");
    const unassignedTasks = activeTasks.filter((t) => t.assignedTo === null);

    // Count tasks that have escalated priority through OS aging
    const escalatedTasks = activeTasks.filter((t) => {
      const assignee = members.find((m) => m.id === t.assignedTo);
      const status = assignee
        ? getWorkloadStatus(calculateWorkloadPercent(assignee.id, tasks, members))
        : undefined;
      const aging = computeTaskAging(t, status);
      return aging.isEscalated;
    });

    return {
      totalMembers: members.length,
      activeTasks: activeTasks.length,
      pendingTasksCount: pendingTasks.length,
      inProgressTasksCount: inProgressTasks.length,
      overloadedCount: alerts.overloadedMembers.length,
      upcomingDeadlineCount: alerts.deadlineRisks.filter(
        (r) => r.risk === "high" || r.risk === "medium"
      ).length,
      escalatedPriorityCount: escalatedTasks.length,
      unassignedTasksCount: unassignedTasks.length,
      totalProjects: projects.length,
    };
  }, [members, tasks, projects]);
}
