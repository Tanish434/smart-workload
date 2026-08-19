"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Clock, User, ArrowUpRight } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Avatar } from "../ui/Avatar";
import { DeadlineRiskTag } from "./DeadlineRiskTag";
import { useMemberById, useProjectById } from "../../store/useWorkloadStore";
import type { Task } from "../../types/task";

export interface TaskCardProps {
  task: Task;
  compact?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, compact = false }) => {
  const assignee = useMemberById(task.assignedTo || "");
  const project = useProjectById(task.projectId || "");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <Link href={`/tasks/${task.id}`} className="group block">
      <Card
        hoverable
        className="p-4 border border-slate-200/80 dark:border-slate-800 transition-all duration-200 group-hover:border-indigo-300 dark:group-hover:border-indigo-700/60 shadow-subtle hover:shadow-card bg-white dark:bg-slate-900"
      >
        <div className="space-y-3">
          {/* Header badges: Priority, Project & Deadline Risk */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {(task as any).aging?.isEscalated ? (
                <span
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200 border border-amber-300 dark:border-amber-800 shadow-xs"
                  title={`Escalated from ${task.priority.toUpperCase()} via OS Priority Aging: ${(task as any).aging.reasons.join(", ")}`}
                >
                  <span>⚡ {(task as any).aging.effectivePriority.toUpperCase()}</span>
                </span>
              ) : (
                <Badge variant={{ type: "priority", value: task.priority }} size="sm" />
              )}
              {project && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white truncate max-w-[110px]"
                  style={{ backgroundColor: project.color || "#6366f1" }}
                  title={project.name}
                >
                  {project.name}
                </span>
              )}
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {task.requiredSkill}
              </span>
            </div>
            <div className="shrink-0 flex items-center gap-1">
              <DeadlineRiskTag task={task} size="sm" />
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
            </div>
          </div>

          {/* Title & Description */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
              {task.title}
            </h4>
            {!compact && task.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>

          {/* Footer details: Assignee, Deadline & Hours */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs">
            {/* Assignee Avatar / Unassigned */}
            <div className="flex items-center gap-2 min-w-0">
              {assignee ? (
                <>
                  <Avatar
                    name={assignee.name}
                    src={assignee.avatar}
                    size="xs"
                    status={assignee.availability}
                    className="shrink-0"
                  />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                    {assignee.name}
                  </span>
                </>
              ) : (
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                  <User className="w-3.5 h-3.5" />
                  <span className="text-xs italic">Unassigned</span>
                </div>
              )}
            </div>

            {/* Date & Hours */}
            <div className="flex items-center gap-2 shrink-0 text-[11px] text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {task.deadline}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
                <Clock className="w-3 h-3" />
                {task.estimatedHours}h
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
