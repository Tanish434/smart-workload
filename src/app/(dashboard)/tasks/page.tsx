"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, CheckSquare } from "lucide-react";
import { TaskFilterBar, TaskFilterState } from "../../../components/tasks/TaskFilterBar";
import { TaskBoard } from "../../../components/tasks/TaskBoard";
import { Button } from "../../../components/ui/Button";
import { useTasks } from "../../../store/useWorkloadStore";

export default function TasksPage() {
  const allTasks = useTasks();

  const [filters, setFilters] = useState<TaskFilterState>({
    search: "",
    status: "all",
    priority: "all",
    skill: "all",
    assignedTo: "all",
    projectId: "all",
  });

  const filteredTasks = useMemo(() => {
    return allTasks.filter((task) => {
      // Search
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(query);
        const matchDesc = task.description.toLowerCase().includes(query);
        const matchSkill = task.requiredSkill.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchSkill) return false;
      }

      // Status
      if (filters.status !== "all" && task.status !== filters.status) {
        return false;
      }

      // Priority
      if (filters.priority !== "all" && task.priority !== filters.priority) {
        return false;
      }

      // Skill
      if (filters.skill !== "all" && task.requiredSkill !== filters.skill) {
        return false;
      }

      // Assignee
      if (filters.assignedTo !== "all") {
        if (filters.assignedTo === "unassigned") {
          if (task.assignedTo !== null) return false;
        } else if (task.assignedTo !== filters.assignedTo) {
          return false;
        }
      }

      // Project
      if (filters.projectId !== "all") {
        if (filters.projectId === "no_project") {
          if (task.projectId) return false;
        } else if (task.projectId !== filters.projectId) {
          return false;
        }
      }

      return true;
    });
  }, [allTasks, filters]);

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "all",
      priority: "all",
      skill: "all",
      assignedTo: "all",
      projectId: "all",
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header with Title and Add Task button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Task Management Board
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kanban workflow with dynamic deadline risk escalation and live assignee status.
          </p>
        </div>

        <Link href="/tasks/new">
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            Create New Task
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <TaskFilterBar
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
        resultCount={filteredTasks.length}
      />

      {/* Task Board */}
      <TaskBoard tasks={filteredTasks} />
    </div>
  );
}
