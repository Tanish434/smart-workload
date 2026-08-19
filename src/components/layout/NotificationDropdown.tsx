"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Trash2,
  CheckCheck,
  ExternalLink,
  X,
} from "lucide-react";
import { useNotifications, useWorkloadStore } from "../../store/useWorkloadStore";
import type { NotificationType } from "../../types/notification";

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { notifications, unreadCount } = useNotifications();
  const markNotificationAsRead = useWorkloadStore(
    (state) => state.markNotificationAsRead
  );
  const markAllNotificationsAsRead = useWorkloadStore(
    (state) => state.markAllNotificationsAsRead
  );
  const clearAllNotifications = useWorkloadStore(
    (state) => state.clearAllNotifications
  );

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />;
      case "warning":
        return <Clock className="w-4 h-4 text-amber-500 shrink-0" />;
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      case "info":
      default:
        return <Info className="w-4 h-4 text-blue-500 shrink-0" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open notifications menu"
        className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="fixed sm:absolute right-4 sm:right-0 top-16 sm:top-12 w-[calc(100vw-2rem)] sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  title="Mark all as read"
                  className="p-1.5 text-xs text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">Mark read</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  title="Clear all notifications"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500">
                <Bell className="w-8 h-8 stroke-1 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                <p className="text-xs font-semibold">No notifications yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  System alerts and updates will appear here.
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markNotificationAsRead(n.id)}
                  className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                    !n.read
                      ? "bg-indigo-50/40 dark:bg-indigo-950/20"
                      : "bg-white dark:bg-slate-900"
                  }`}
                >
                  <div className="mt-0.5">{getIcon(n.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4
                        className={`text-xs font-bold truncate ${
                          !n.read
                            ? "text-slate-900 dark:text-white"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {n.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug line-clamp-2">
                      {n.message}
                    </p>
                    {n.link && (
                      <Link
                        href={n.link}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mt-1.5"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
