"use client";

import React, { useState } from "react";
import { clsx } from "clsx";
import { CircleDot, Loader2, CheckCircle2, Inbox } from "lucide-react";
import { TaskCard } from "./TaskCard";
import type { Task, TaskStatus } from "../../types/task";

export interface TaskBoardProps {
  tasks: Task[];
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ tasks }) => {
  // Mobile active tab state
  const [activeMobileTab, setActiveMobileTab] = useState<TaskStatus>("todo");

  const todoTasks = tasks.filter((t) => t.status === "todo");
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress");
  const doneTasks = tasks.filter((t) => t.status === "done");

  const columns = [
    {
      id: "todo" as TaskStatus,
      title: "To Do",
      tasks: todoTasks,
      count: todoTasks.length,
      icon: CircleDot,
      accent: "border-t-indigo-500",
      pillBg: "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300",
    },
    {
      id: "in_progress" as TaskStatus,
      title: "In Progress",
      tasks: inProgressTasks,
      count: inProgressTasks.length,
      icon: Loader2,
      accent: "border-t-blue-500",
      pillBg: "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300",
    },
    {
      id: "done" as TaskStatus,
      title: "Done",
      tasks: doneTasks,
      count: doneTasks.length,
      icon: CheckCircle2,
      accent: "border-t-emerald-500",
      pillBg: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Mobile Tab Switcher (<768px) */}
      <div className="md:hidden flex rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1.5 border border-slate-200 dark:border-slate-700/60">
        {columns.map((col) => {
          const isActive = activeMobileTab === col.id;
          const Icon = col.icon;
          return (
            <button
              key={col.id}
              onClick={() => setActiveMobileTab(col.id)}
              className={clsx(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all",
                isActive
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{col.title}</span>
              <span className={clsx("px-1.5 py-0.2 rounded-full text-[10px]", col.pillBg)}>
                {col.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Desktop 3-Column Grid + Mobile Single-Tab View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {columns.map((col) => {
          const isMobileVisible = activeMobileTab === col.id;
          const Icon = col.icon;

          return (
            <div
              key={col.id}
              className={clsx(
                "flex flex-col rounded-3xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-4 border-t-4",
                col.accent,
                "md:flex",
                isMobileVisible ? "flex" : "hidden md:flex"
              )}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                    {col.title}
                  </h3>
                </div>
                <span
                  className={clsx(
                    "px-2 py-0.5 rounded-full text-xs font-bold",
                    col.pillBg
                  )}
                >
                  {col.count}
                </span>
              </div>

              {/* Tasks List */}
              <div className="flex-1 space-y-3 min-h-[220px]">
                {col.tasks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    <Inbox className="w-8 h-8 stroke-1 mb-2 text-slate-300 dark:text-slate-600" />
                    <p className="text-xs font-medium">No tasks in {col.title.toLowerCase()}</p>
                  </div>
                ) : (
                  col.tasks.map((task) => <TaskCard key={task.id} task={task} />)
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
