"use client";

import React, { useState, useEffect } from "react";
import { FolderKanban, Plus, Sparkles, Check } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import {
  useWorkloadStore,
  useMembers,
  EnrichedProject,
} from "../../store/useWorkloadStore";
import { useToast } from "../ui/Toast";
import type { ProjectStatus } from "../../types/project";

export interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
  projectToEdit?: EnrichedProject | null;
}

const COLOR_PRESETS = [
  "#6366f1", // Indigo
  "#0ea5e9", // Sky
  "#8b5cf6", // Violet
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#ef4444", // Rose
];

export const ProjectModal: React.FC<ProjectModalProps> = ({
  open,
  onClose,
  projectToEdit,
}) => {
  const createProject = useWorkloadStore((state) => state.createProject);
  const updateProject = useWorkloadStore((state) => state.updateProject);
  const allMembers = useMembers();
  const toast = useToast();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COLOR_PRESETS[0]);
  const [status, setStatus] = useState<ProjectStatus>("active");
  const [leadId, setLeadId] = useState<string>("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [targetDate, setTargetDate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;

    if (projectToEdit) {
      setName(projectToEdit.name);
      setDescription(projectToEdit.description);
      setColor(projectToEdit.color || COLOR_PRESETS[0]);
      setStatus(projectToEdit.status);
      setLeadId(projectToEdit.leadId || "");
      setSelectedMemberIds(projectToEdit.memberIds || []);
      setTargetDate(projectToEdit.targetDate || "");
    } else {
      setName("");
      setDescription("");
      setColor(COLOR_PRESETS[0]);
      setStatus("active");
      setLeadId(allMembers[0]?.id || "");
      setSelectedMemberIds(allMembers.slice(0, 3).map((m) => m.id));
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      setTargetDate(futureDate.toISOString().split("T")[0]);
    }
    setErrors({});
  }, [projectToEdit, open]);

  const toggleMember = (mId: string) => {
    if (selectedMemberIds.includes(mId)) {
      setSelectedMemberIds(selectedMemberIds.filter((id) => id !== mId));
    } else {
      setSelectedMemberIds([...selectedMemberIds, mId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!name.trim()) errs.name = "Project name is required.";
    if (!description.trim()) errs.description = "Description is required.";
    if (!targetDate) errs.targetDate = "Target completion date is required.";

    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      if (projectToEdit) {
        updateProject(projectToEdit.id, {
          name: name.trim(),
          description: description.trim(),
          color,
          status,
          leadId: leadId || null,
          memberIds: selectedMemberIds,
          targetDate,
        });
        toast.success(`Project "${name}" updated!`, "Project Saved");
      } else {
        const p = createProject({
          name: name.trim(),
          description: description.trim(),
          color,
          status,
          leadId: leadId || null,
          memberIds: selectedMemberIds,
          startDate: new Date().toISOString().split("T")[0],
          targetDate,
        });
        toast.success(`Project "${p.name}" initialized!`, "Project Created");
      }
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={projectToEdit ? "Edit Project" : "Create New Project"}
      description="Define scope, milestones, and assign dedicated team teammates"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Project Name */}
        <div>
          <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
            Project Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. NextGen Payment Gateway"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.name && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
            Description & Key Deliverables <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={2}
            placeholder="Provide context on project objectives..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.description && (
            <p className="text-xs text-rose-500 mt-1 font-medium">
              {errors.description}
            </p>
          )}
        </div>

        {/* Color & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1.5">
              Project Theme Color
            </label>
            <div className="flex items-center gap-2">
              {COLOR_PRESETS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full transition-transform flex items-center justify-center ${
                    color === c ? "scale-125 ring-2 ring-indigo-500 ring-offset-2" : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: c }}
                >
                  {color === c && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
              Initial Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white capitalize"
            >
              <option value="planning">Planning (Scoping)</option>
              <option value="active">Active (In Development)</option>
              <option value="completed">Completed (Delivered)</option>
              <option value="on_hold">On Hold (Paused)</option>
            </select>
          </div>
        </div>

        {/* Project Lead & Target Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
              Designated Project Lead
            </label>
            <select
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            >
              <option value="">No assigned lead</option>
              {allMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
              Target Completion Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.targetDate && (
              <p className="text-xs text-rose-500 mt-1 font-medium">
                {errors.targetDate}
              </p>
            )}
          </div>
        </div>

        {/* Assigned Team Roster Multi-Select */}
        <div>
          <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1.5">
            Assign Team Members ({selectedMemberIds.length} selected)
          </label>
          <div className="max-h-40 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 bg-slate-50/50 dark:bg-slate-800/40">
            {allMembers.map((m) => {
              const isChecked = selectedMemberIds.includes(m.id);
              return (
                <label
                  key={m.id}
                  className="flex items-center justify-between p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleMember(m.id)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {m.name}
                    </span>
                    <span className="text-slate-400">({m.role})</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {m.workloadPercent}% load
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            leftIcon={<FolderKanban className="w-4 h-4" />}
          >
            {projectToEdit ? "Update Project" : "Create Project"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
