"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Plus, RefreshCw, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAlerts, useWorkloadStore } from "../../store/useWorkloadStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useToast } from "../ui/Toast";
import { ThemeSwitch } from "../ui/theme-switch";
import { Avatar } from "../ui/Avatar";
import { NotificationDropdown } from "./NotificationDropdown";

export const Topbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const alerts = useAlerts();
  const resetToSeed = useWorkloadStore((state) => state.resetToSeed);
  const toast = useToast();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    toast.info("Signed out of admin session", "Logged Out");
    router.push("/login");
  };

  const totalAlertCount =
    alerts.overloadedMembers.length +
    alerts.deadlineRisks.filter((r) => r.risk === "high" || r.risk === "medium").length +
    alerts.rebalanceSuggestions.length;

  const getPageDetails = () => {
    if (pathname.startsWith("/dashboard")) {
      return {
        title: "Workload Overview",
        subtitle: "Live team capacity, high-risk deadlines, and automated balance checks",
      };
    }
    if (pathname.startsWith("/projects/")) {
      return {
        title: "Project Overview",
        subtitle: "Milestones, assigned team roster, and project deliverables",
      };
    }
    if (pathname.startsWith("/projects")) {
      return {
        title: "Organization Projects",
        subtitle: "Multi-project tracking, cross-project member shifting, and capacity alignment",
      };
    }
    if (pathname.startsWith("/team/")) {
      return {
        title: "Member Profile",
        subtitle: "Individual workload allocation, assigned tasks, and availability status",
      };
    }
    if (pathname.startsWith("/team")) {
      return {
        title: "Team Roster",
        subtitle: "Filter and manage team members by capacity, role, and skills",
      };
    }
    if (pathname.startsWith("/chat")) {
      return {
        title: "Team Communications & Dispatch",
        subtitle: "Real-time member chat channels and direct official email composer",
      };
    }
    if (pathname === "/tasks/new") {
      return {
        title: "Create Task",
        subtitle: "Assign new task with live skill & capacity recommendation engine",
      };
    }
    if (pathname.includes("/reassign")) {
      return {
        title: "Task Reassignment",
        subtitle: "Rebalance workload by selecting best available candidate",
      };
    }
    if (pathname.startsWith("/tasks/")) {
      return {
        title: "Task Details",
        subtitle: "Edit task parameters, update status, or reassign to team member",
      };
    }
    if (pathname.startsWith("/tasks")) {
      return {
        title: "Task Board",
        subtitle: "Kanban workflow with live deadline risk indicators",
      };
    }
    if (pathname.startsWith("/alerts")) {
      return {
        title: "System Alerts & Rebalancing",
        subtitle: "Proactive overload mitigation and deadline risk escalation",
      };
    }
    return {
      title: "Smart Workload Manager",
      subtitle: "Frontend-only team capacity prototype",
    };
  };

  const page = getPageDetails();

  const handleReset = () => {
    resetToSeed();
    toast.info("State reset to initial seed data", "Data Reset");
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      {/* Title section */}
      <div className="flex-1 min-w-0 pr-4">
        <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate leading-tight">
          {page.title}
        </h1>
        <p className="hidden md:block text-xs text-slate-500 dark:text-slate-400 truncate">
          {page.subtitle}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Reset State Button */}
        <button
          onClick={handleReset}
          title="Reset data to initial seed"
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-xs flex items-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden lg:inline font-medium">Reset Demo</span>
        </button>

        {/* New Task Shortcut */}
        <Link
          href="/tasks/new"
          className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </Link>

        {/* Theme Toggle */}
        <ThemeSwitch iconSize={16} />

        {/* Interactive Notifications System */}
        <NotificationDropdown />

        {/* Admin Profile & Logout */}
        <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-800">
          <Avatar
            name={user?.name || "Devon Vance"}
            src={user?.avatar}
            size="sm"
            className="shrink-0 ring-1 ring-indigo-500/30"
          />
          <button
            type="button"
            onClick={handleLogout}
            title="Sign Out of Admin Portal"
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
