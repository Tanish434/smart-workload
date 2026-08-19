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
} from "lucide-react";
import { useAlerts, useUnreadChatCount } from "../../store/useWorkloadStore";

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const alerts = useAlerts();
  const unreadChatCount = useUnreadChatCount();

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
      name: "Chat",
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
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-3 py-2">
      <div className="flex items-center justify-around">
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
                "relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-150",
                isActive
                  ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge !== null && item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500 text-white shadow-sm leading-tight">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
