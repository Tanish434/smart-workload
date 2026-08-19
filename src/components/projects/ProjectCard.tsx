"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  MoreVertical,
  UserPlus,
  Repeat,
  Trash2,
  Crown,
} from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Avatar } from "../ui/Avatar";
import { ProgressBar } from "../ui/ProgressBar";
import { Button } from "../ui/Button";
import type { EnrichedProject } from "../../store/useWorkloadStore";
import { useWorkloadStore } from "../../store/useWorkloadStore";
import { useToast } from "../ui/Toast";

export interface ProjectCardProps {
  project: EnrichedProject;
  onOpenShiftModal?: (project: EnrichedProject) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpenShiftModal,
}) => {
  const deleteProject = useWorkloadStore((state) => state.deleteProject);
  const toast = useToast();
  const [showMenu, setShowMenu] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900";
      case "planning":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900";
      case "completed":
        return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900";
      case "on_hold":
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  const handleDelete = () => {
    deleteProject(project.id);
    toast.info(`Project "${project.name}" was deleted.`, "Project Removed");
  };

  return (
    <Card hoverable className="p-5 sm:p-6 flex flex-col justify-between relative group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <span
              className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: project.color || "#6366f1" }}
            />
            <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
              {project.name}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full border capitalize ${getStatusColor(
                project.status
              )}`}
            >
              {project.status.replace("_", " ")}
            </span>

            {/* Quick Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-7 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-20 py-1 text-xs">
                  {onOpenShiftModal && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onOpenShiftModal(project);
                      }}
                      className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Repeat className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Shift / Manage Roster</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      handleDelete();
                    }}
                    className="w-full px-3 py-2 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Project</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Progress Bar */}
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-600 dark:text-slate-400">Progress</span>
            <span className="text-slate-900 dark:text-white font-bold">
              {project.completionPercent}% ({project.tasks.length - project.activeTasks.length}/{project.tasks.length} done)
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-300"
              style={{ width: `${project.completionPercent}%` }}
            />
          </div>
        </div>

        {/* Lead & Project Info */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            <span>Lead: <strong>{project.lead ? project.lead.name : "Unassigned"}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{project.totalEstimatedHours}h effort</span>
          </div>
        </div>
      </div>

      {/* Roster Avatars & Action Link */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        {/* Avatars Stack */}
        <div className="flex items-center -space-x-2 overflow-hidden">
          {project.members.slice(0, 5).map((m) => (
            <Link
              key={m.id}
              href={`/team/${m.id}`}
              title={`${m.name} (${m.role})`}
              className="rounded-full transition-transform hover:scale-110 hover:z-10 ring-2 ring-white dark:ring-slate-900"
            >
              <Avatar
                name={m.name}
                src={m.avatar}
                size="sm"
              />
            </Link>
          ))}
          {project.members.length > 5 && (
            <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold">
              +{project.members.length - 5}
            </span>
          )}
          {project.members.length === 0 && (
            <span className="text-[11px] text-slate-400 italic">No assigned members</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onOpenShiftModal && (
            <button
              type="button"
              onClick={() => onOpenShiftModal(project)}
              className="p-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg font-semibold flex items-center gap-1 transition-colors"
              title="Shift member or edit team roster"
            >
              <Repeat className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Shift</span>
            </button>
          )}

          <Link
            href={`/projects/${project.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 group-hover:translate-x-0.5 transition-transform"
          >
            <span>Overview</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </Card>
  );
};
