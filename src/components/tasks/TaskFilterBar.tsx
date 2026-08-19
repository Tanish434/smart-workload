"use client";

import React from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { SKILL_OPTIONS } from "../../lib/constants";
import { useMembers, useProjects } from "../../store/useWorkloadStore";
import type { TaskPriority, TaskStatus } from "../../types/task";

export interface TaskFilterState {
  search: string;
  status: TaskStatus | "all";
  priority: TaskPriority | "all";
  skill: string | "all";
  assignedTo: string | "all";
  projectId: string | "all";
}

export interface TaskFilterBarProps {
  filters: TaskFilterState;
  onChange: (newFilters: TaskFilterState) => void;
  onReset: () => void;
  resultCount: number;
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  filters,
  onChange,
  onReset,
  resultCount,
}) => {
  const members = useMembers();
  const projects = useProjects();

  const isFiltered =
    filters.search !== "" ||
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.skill !== "all" ||
    filters.assignedTo !== "all" ||
    filters.projectId !== "all";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch lg:items-center justify-between">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tasks by title, description, or skill..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap lg:flex-nowrap items-center gap-2.5">
          {/* Status Filter */}
          <select
            aria-label="Filter by status"
            value={filters.status}
            onChange={(e) =>
              onChange({
                ...filters,
                status: e.target.value as TaskStatus | "all",
              })
            }
            className="px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          {/* Priority & OS Aging Filter */}
          <select
            aria-label="Filter by priority"
            value={filters.priority}
            onChange={(e) =>
              onChange({
                ...filters,
                priority: e.target.value as TaskPriority | "all",
              })
            }
            className="px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* Skill Filter */}
          <select
            aria-label="Filter by required skill"
            value={filters.skill}
            onChange={(e) =>
              onChange({
                ...filters,
                skill: e.target.value,
              })
            }
            className="px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          >
            <option value="all">All Skills</option>
            {SKILL_OPTIONS.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>

          {/* Assignee Filter */}
          <select
            aria-label="Filter by assignee"
            value={filters.assignedTo}
            onChange={(e) =>
              onChange({
                ...filters,
                assignedTo: e.target.value,
              })
            }
            className="px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          >
            <option value="all">All Assignees</option>
            <option value="unassigned">Unassigned Only</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          {/* Project Filter */}
          <select
            aria-label="Filter by project"
            value={filters.projectId}
            onChange={(e) =>
              onChange({
                ...filters,
                projectId: e.target.value,
              })
            }
            className="px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          >
            <option value="all">All Projects</option>
            <option value="no_project">No Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Info & Reset Button */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 font-medium">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span>
            Showing <strong className="text-slate-900 dark:text-white font-bold">{resultCount}</strong> tasks
          </span>
        </div>

        {isFiltered && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
