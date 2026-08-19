"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  AlertTriangle,
  FolderKanban,
  MessageSquare,
  Layers,
  Sparkles,
} from "lucide-react";
import { useAlerts, useUnreadChatCount } from "../../store/useWorkloadStore";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const alerts = useAlerts();
  const unreadChatCount = useUnreadChatCount();

  // Total alert items = overloaded members + deadline risks + rebalance suggestions
  const totalAlertCount =
    alerts.overloadedMembers.length +
    alerts.deadlineRisks.filter((r) => r.risk === "high" || r.risk === "medium").length +
    alerts.rebalanceSuggestions.length;

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Projects",
      href: "/projects",
      icon: FolderKanban,
    },
    {
      name: "Team",
      href: "/team",
      icon: Users,
    },
    {
      name: "Tasks",
      href: "/tasks",
      icon: CheckSquare,
    },
    {
      name: "Messages",
      href: "/chat",
      icon: MessageSquare,
      badge: unreadChatCount > 0 ? unreadChatCount : null,
    },
    {
      name: "Alerts",
      href: "/alerts",
      icon: AlertTriangle,
      badge: totalAlertCount > 0 ? totalAlertCount : null,
    },
  ];

  return (
    <aside className="hidden sm:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/40">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 ring-1 ring-white/20 dark:ring-indigo-400/20 group cursor-pointer transition-transform hover:scale-105 shrink-0">
          <Layers className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h1 className="font-extrabold text-[15px] tracking-tight leading-none text-slate-900 dark:text-white flex items-center">
              <span>Smart</span>
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 dark:from-indigo-400 dark:via-violet-400 dark:to-indigo-300 bg-clip-text text-transparent ml-0.5">
                Workload
              </span>
            </h1>
            <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 tracking-wider uppercase">
              PRO
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-xs shrink-0" />
            <span className="text-[10px] font-semibold tracking-wide text-slate-400 dark:text-slate-500 uppercase truncate">
              Capacity & Balance
            </span>
          </div>
        </div>
      </div>

      {/* Navigation items */}
      <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Main Menu
        </div>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={clsx(
                    "w-5 h-5 transition-colors",
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge !== null && item.badge !== undefined && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white shadow-sm animate-pulse-subtle">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-50 dark:from-slate-800/60 dark:to-slate-800/20 border border-indigo-100/60 dark:border-slate-700/50">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900 dark:text-indigo-300 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Real-time Engine</span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          In-memory reactive state. All reassignment and workload math updates dynamically.
        </p>
      </div>
    </aside>
  );
};
