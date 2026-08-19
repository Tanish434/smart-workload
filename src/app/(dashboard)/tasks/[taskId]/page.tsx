"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  UserCheck,
  Calendar,
  Clock,
  Trash2,
  Share2,
  AlertCircle,
  CheckCircle2,
  FolderKanban,
} from "lucide-react";
import { useTaskById, useWorkloadStore, useMemberById } from "../../../../store/useWorkloadStore";
import { Card } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/Button";
import { Badge } from "../../../../components/ui/Badge";
import { DeadlineRiskTag } from "../../../../components/tasks/DeadlineRiskTag";
import { TaskForm, TaskFormData } from "../../../../components/tasks/TaskForm";
import { useToast } from "../../../../components/ui/Toast";
import type { TaskStatus } from "../../../../types/task";

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const taskId = params.taskId as string;

  const task = useTaskById(taskId);
  const updateTask = useWorkloadStore((state) => state.updateTask);
  const deleteTask = useWorkloadStore((state) => state.deleteTask);

  const [isEditing, setIsEditing] = useState(false);

  if (!task) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Task Not Found
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6">
          The requested task ID does not exist in the in-memory store.
        </p>
        <Link href="/tasks">
          <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Task Board
          </Button>
        </Link>
      </div>
    );
  }

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateTask(task.id, { status: newStatus });
    toast.success(`Task marked as "${newStatus.replace("_", " ")}"`, "Status Updated");
  };

  const handleUpdate = (data: TaskFormData) => {
    updateTask(task.id, {
      title: data.title,
      description: data.description,
      requiredSkill: data.requiredSkill,
      priority: data.priority,
      deadline: data.deadline,
      estimatedHours: data.estimatedHours,
      assignedTo: data.assignedTo,
      projectId: data.projectId || null,
    });
    setIsEditing(false);
    toast.success("Task details saved successfully!", "Task Updated");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(task.id);
      toast.info(`Task "${task.title}" deleted.`, "Task Removed");
      router.push("/tasks");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/tasks"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tasks</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link href={`/tasks/${task.id}/reassign`}>
            <Button variant="secondary" size="sm" leftIcon={<Share2 className="w-4 h-4" />}>
              Reassign Task
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Task Card */}
      <Card className="p-6 sm:p-8 space-y-6">
        {/* Status Pipeline Buttons */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Workflow Status
          </label>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {(["todo", "in_progress", "done"] as TaskStatus[]).map((statusKey) => {
              const isActive = task.status === statusKey;
              const labels = {
                todo: "To Do",
                in_progress: "In Progress",
                done: "Completed",
              };

              return (
                <button
                  key={statusKey}
                  type="button"
                  onClick={() => handleStatusChange(statusKey)}
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold border transition-all text-center ${
                    isActive
                      ? statusKey === "done"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : statusKey === "in_progress"
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 shadow-sm"
                      : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {labels[statusKey]}
                </button>
              );
            })}
          </div>
        </div>

        {isEditing ? (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Edit Task Parameters
            </h3>
            <TaskForm
              initialData={{
                title: task.title,
                description: task.description,
                requiredSkill: task.requiredSkill,
                priority: task.priority,
                deadline: task.deadline,
                estimatedHours: task.estimatedHours,
                assignedTo: task.assignedTo,
                projectId: task.projectId || null,
              }}
              onSubmit={handleUpdate}
              submitLabel="Save Changes"
            />
            <div className="mt-3">
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onClick={() => setIsEditing(false)}
              >
                Cancel Editing
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header: Title & Badges */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={{ type: "priority", value: task.priority }} size="md" />
                <DeadlineRiskTag task={task} size="md" />
                {task.project && (
                  <Link
                    href={`/projects/${task.project.id}`}
                    className="text-xs font-bold px-2.5 py-1 rounded-full text-white flex items-center gap-1 transition-opacity hover:opacity-90 shadow-sm"
                    style={{ backgroundColor: task.project.color || "#6366f1" }}
                  >
                    <FolderKanban className="w-3.5 h-3.5" />
                    <span>{task.project.name}</span>
                  </Link>
                )}
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  Required Skill: {task.requiredSkill}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {task.title}
              </h1>

              {task.description ? (
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {task.description}
                </p>
              ) : (
                <p className="text-sm italic text-slate-400">
                  No additional description provided.
                </p>
              )}
            </div>

            {/* Parameter Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm">
              {/* Assignee */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 block text-xs font-medium mb-1">
                  Assigned Team Member
                </span>
                {task.assignee ? (
                  <Link
                    href={`/team/${task.assignee.id}`}
                    className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5"
                  >
                    <span>{task.assignee.name}</span>
                    <span className="text-xs text-slate-400 font-normal">
                      ({task.assignee.role})
                    </span>
                  </Link>
                ) : (
                  <span className="font-semibold text-slate-500 italic">
                    Unassigned
                  </span>
                )}
              </div>

              {/* Project */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 block text-xs font-medium mb-1">
                  Associated Project
                </span>
                {task.project ? (
                  <Link
                    href={`/projects/${task.project.id}`}
                    className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 truncate"
                  >
                    <FolderKanban className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>{task.project.name}</span>
                  </Link>
                ) : (
                  <span className="text-slate-500 italic">No Project (General)</span>
                )}
              </div>

              {/* Deadline */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 block text-xs font-medium mb-1">
                  Target Deadline
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  {task.deadline}
                </span>
              </div>

              {/* Estimated Work */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 block text-xs font-medium mb-1">
                  Estimated Effort
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-500" />
                  {task.estimatedHours} Hours
                </span>
              </div>
            </div>

            {/* OS Priority Aging & Feedback Banner */}
            {task.aging && (
              <div
                className={`p-4 sm:p-5 rounded-2xl border ${
                  task.aging.isEscalated
                    ? "bg-gradient-to-br from-amber-500/10 via-rose-500/5 to-transparent border-amber-300 dark:border-amber-900/60"
                    : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-amber-500 text-white shadow-xs">
                      ⚡
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        Dynamic Priority Escalation Status
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Automated feedback loop evaluating deadline proximity and workload
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      Base: {task.priority.toUpperCase()}
                    </span>
                    <span className="text-slate-400 text-xs">➔</span>
                    <span
                      className={`text-xs font-extrabold px-2.5 py-0.5 rounded text-white shadow-xs ${
                        task.effectivePriority === "critical"
                          ? "bg-rose-600 animate-pulse"
                          : task.effectivePriority === "high"
                          ? "bg-amber-600"
                          : "bg-indigo-600"
                      }`}
                    >
                      {task.effectivePriority.toUpperCase()}{" "}
                      {task.aging.isEscalated ? "(ESCALATED)" : "(STANDARD)"}
                    </span>
                  </div>
                </div>

                {/* Aging Reasons */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400">
                    Aging Factors:
                  </span>
                  {task.aging.reasons.map((r, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300"
                    >
                      • {r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Edit Button */}
            <div className="pt-2">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setIsEditing(true)}
              >
                Edit Task Details
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
