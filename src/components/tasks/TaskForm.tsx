"use client";

import React, { useState, useEffect } from "react";
import { SKILL_OPTIONS } from "../../lib/constants";
import { Button } from "../ui/Button";
import { useMembers, useProjects } from "../../store/useWorkloadStore";
import type { Task, TaskPriority, TaskStatus } from "../../types/task";

export interface TaskFormData {
  title: string;
  description: string;
  requiredSkill: string;
  priority: TaskPriority;
  deadline: string;
  estimatedHours: number;
  assignedTo: string | null;
  projectId?: string | null;
  status?: TaskStatus;
}

export interface TaskFormProps {
  initialData?: Partial<TaskFormData>;
  onChangeDraft?: (draft: { requiredSkill: string; priority: TaskPriority; assignedTo: string | null }) => void;
  onSubmit: (data: TaskFormData) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  initialData,
  onChangeDraft,
  onSubmit,
  submitLabel = "Create Task",
  isSubmitting = false,
}) => {
  const members = useMembers();
  const projects = useProjects();

  // Get tomorrow's ISO date string as default
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDeadline = tomorrow.toISOString().split("T")[0];

  const [formData, setFormData] = useState<TaskFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    requiredSkill: initialData?.requiredSkill || SKILL_OPTIONS[0],
    priority: initialData?.priority || "medium",
    deadline: initialData?.deadline || defaultDeadline,
    estimatedHours: initialData?.estimatedHours || 8,
    assignedTo: initialData?.assignedTo !== undefined ? initialData.assignedTo : null,
    projectId: initialData?.projectId !== undefined ? initialData.projectId : null,
    status: initialData?.status || "todo",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Synchronize assignee if selected externally from recommendations
  useEffect(() => {
    if (initialData?.assignedTo !== undefined && initialData.assignedTo !== formData.assignedTo) {
      setFormData((prev) => ({
        ...prev,
        assignedTo: initialData.assignedTo ?? null,
      }));
    }
  }, [initialData?.assignedTo]); // Only depend on assignedTo scalar, not object reference!

  const validate = (data: TaskFormData) => {
    const errs: Record<string, string> = {};
    if (!data.title.trim()) {
      errs.title = "Task title is required.";
    } else if (data.title.trim().length < 3) {
      errs.title = "Title must be at least 3 characters.";
    }

    if (!data.requiredSkill) {
      errs.requiredSkill = "Please select a required skill.";
    }

    if (!data.deadline) {
      errs.deadline = "Deadline date is required.";
    }

    if (!data.estimatedHours || data.estimatedHours <= 0) {
      errs.estimatedHours = "Estimated hours must be greater than 0.";
    } else if (data.estimatedHours > 80) {
      errs.estimatedHours = "Estimated hours cannot exceed 80 hours.";
    }

    return errs;
  };

  const handleChange = (
    field: keyof TaskFormData,
    value: string | number | null
  ) => {
    const updated = {
      ...formData,
      [field]: value,
    };
    setFormData(updated);

    if (touched[field]) {
      const errs = validate(updated);
      setErrors(errs);
    }

    // Call onChangeDraft on user interaction directly!
    if (onChangeDraft && (field === "requiredSkill" || field === "priority" || field === "assignedTo")) {
      onChangeDraft({
        requiredSkill: (field === "requiredSkill" ? value : formData.requiredSkill) as string,
        priority: (field === "priority" ? value : formData.priority) as TaskPriority,
        assignedTo: (field === "assignedTo" ? value : formData.assignedTo) as string | null,
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validate(formData);
    setErrors(errs);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = {
      title: true,
      requiredSkill: true,
      deadline: true,
      estimatedHours: true,
    };
    setTouched(allTouched);

    const errs = validate(formData);
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      onSubmit(formData);
    }
  };

  const isValid = Object.keys(validate(formData)).length === 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title Field */}
      <div>
        <label className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1.5">
          Task Title <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Implement OAuth2 Refresh Token Rotation"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          onBlur={() => handleBlur("title")}
          className={`w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
            errors.title && touched.title
              ? "border-rose-400 focus:ring-rose-500 bg-rose-50/30"
              : "border-slate-200 dark:border-slate-700 focus:ring-indigo-500"
          }`}
        />
        {errors.title && touched.title && (
          <p className="mt-1 text-xs text-rose-500 font-medium animate-fade-in">
            {errors.title}
          </p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1.5">
          Description
        </label>
        <textarea
          rows={3}
          placeholder="Outline deliverables, acceptance criteria, or relevant context..."
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        />
      </div>

      {/* Required Skill & Priority Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Required Skill */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1.5">
            Required Skill <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.requiredSkill}
            onChange={(e) => handleChange("requiredSkill", e.target.value)}
            onBlur={() => handleBlur("requiredSkill")}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          >
            {SKILL_OPTIONS.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1.5">
            Priority Level
          </label>
          <select
            value={formData.priority}
            onChange={(e) =>
              handleChange("priority", e.target.value as TaskPriority)
            }
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>
      </div>

      {/* Deadline & Estimated Hours */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Deadline */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1.5">
            Deadline Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            value={formData.deadline}
            onChange={(e) => handleChange("deadline", e.target.value)}
            onBlur={() => handleBlur("deadline")}
            className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 font-medium ${
              errors.deadline && touched.deadline
                ? "border-rose-400 focus:ring-rose-500 bg-rose-50/30"
                : "border-slate-200 dark:border-slate-700 focus:ring-indigo-500"
            }`}
          />
          {errors.deadline && touched.deadline && (
            <p className="mt-1 text-xs text-rose-500 font-medium animate-fade-in">
              {errors.deadline}
            </p>
          )}
        </div>

        {/* Estimated Hours */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1.5">
            Estimated Hours <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min={1}
            max={80}
            value={formData.estimatedHours}
            onChange={(e) =>
              handleChange("estimatedHours", parseInt(e.target.value) || 0)
            }
            onBlur={() => handleBlur("estimatedHours")}
            className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 font-medium ${
              errors.estimatedHours && touched.estimatedHours
                ? "border-rose-400 focus:ring-rose-500 bg-rose-50/30"
                : "border-slate-200 dark:border-slate-700 focus:ring-indigo-500"
            }`}
          />
          {errors.estimatedHours && touched.estimatedHours && (
            <p className="mt-1 text-xs text-rose-500 font-medium animate-fade-in">
              {errors.estimatedHours}
            </p>
          )}
        </div>
      </div>

      {/* Assignee Selection */}
      <div>
        <label className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1.5">
          Assignee
        </label>
        <select
          value={formData.assignedTo || ""}
          onChange={(e) => handleChange("assignedTo", e.target.value || null)}
          className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
        >
          <option value="">Leave Unassigned</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.role}) — {m.workloadPercent}% load
            </option>
          ))}
        </select>
        <p className="mt-1 text-[11px] text-slate-400">
          Tip: You can also pick directly from the live recommendation panel.
        </p>
      </div>

      {/* Project Association */}
      <div>
        <label className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1.5">
          Project Association
        </label>
        <select
          value={formData.projectId || ""}
          onChange={(e) => handleChange("projectId", e.target.value || null)}
          className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
        >
          <option value="">No Project (General Backlog)</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.status})
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <div className="pt-3">
        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          disabled={!isValid || isSubmitting}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
