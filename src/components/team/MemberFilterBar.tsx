"use client";

import React from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { SKILL_OPTIONS } from "../../lib/constants";
import type { MemberAvailability } from "../../types/member";

export interface MemberFilterState {
  search: string;
  skill: string;
  availability: MemberAvailability | "all";
  sortBy: "workload_desc" | "workload_asc" | "name" | "tasks";
}

export interface MemberFilterBarProps {
  filters: MemberFilterState;
  onChange: (newFilters: MemberFilterState) => void;
  onReset: () => void;
  resultCount: number;
}

export const MemberFilterBar: React.FC<MemberFilterBarProps> = ({
  filters,
  onChange,
  onReset,
  resultCount,
}) => {
  const isFiltered =
    filters.search !== "" ||
    filters.skill !== "all" ||
    filters.availability !== "all" ||
    filters.sortBy !== "workload_desc";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch md:items-center justify-between">
        {/* Search Box */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by member name, role, or skill..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Skill Filter */}
          <select
            aria-label="Filter by skill"
            value={filters.skill}
            onChange={(e) => onChange({ ...filters, skill: e.target.value })}
            className="flex-1 sm:flex-initial px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          >
            <option value="all">All Skills</option>
            {SKILL_OPTIONS.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>

          {/* Availability Filter */}
          <select
            aria-label="Filter by availability"
            value={filters.availability}
            onChange={(e) =>
              onChange({
                ...filters,
                availability: e.target.value as MemberAvailability | "all",
              })
            }
            className="flex-1 sm:flex-initial px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          >
            <option value="all">All Availability</option>
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="unavailable">Unavailable</option>
          </select>

          {/* Sort By */}
          <select
            aria-label="Sort members"
            value={filters.sortBy}
            onChange={(e) =>
              onChange({
                ...filters,
                sortBy: e.target.value as MemberFilterState["sortBy"],
              })
            }
            className="flex-1 sm:flex-initial px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          >
            <option value="workload_desc">Workload: High to Low</option>
            <option value="workload_asc">Workload: Low to High</option>
            <option value="name">Name (A-Z)</option>
            <option value="tasks">Active Tasks Count</option>
          </select>
        </div>
      </div>

      {/* Filter Status & Reset */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 font-medium">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span>
            Showing <strong className="text-slate-900 dark:text-white font-bold">{resultCount}</strong> members
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
