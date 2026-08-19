"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FolderKanban,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  Repeat,
  Trash2,
  Crown,
  Calendar,
  AlertCircle,
  Briefcase,
  Edit,
} from "lucide-react";
import {
  useProjectById,
  useWorkloadStore,
  useMembers,
} from "../../../../store/useWorkloadStore";
import { Card } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/Button";
import { Badge } from "../../../../components/ui/Badge";
import { TaskCard } from "../../../../components/tasks/TaskCard";
import { ShiftMemberModal } from "../../../../components/projects/ShiftMemberModal";
import { ProjectModal } from "../../../../components/projects/ProjectModal";
import { useToast } from "../../../../components/ui/Toast";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const projectId = params.projectId as string;

  const project = useProjectById(projectId);
  const deleteProject = useWorkloadStore((state) => state.deleteProject);

  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!project) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Project Not Found
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6">
          The project you requested could not be located.
        </p>
        <Link href="/projects">
          <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    deleteProject(project.id);
    toast.info(`Project "${project.name}" was deleted.`, "Project Removed");
    router.push("/projects");
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Top Back Nav */}
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>
      </div>

      {/* Project Header Card */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center text-white text-2xl font-extrabold shadow-elevation shrink-0"
              style={{ backgroundColor: project.color || "#6366f1" }}
            >
              <FolderKanban className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {project.name}
                </h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 capitalize">
                  {project.status.replace("_", " ")}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-2xl">
                {project.description}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsEditModalOpen(true)}
              leftIcon={<Edit className="w-4 h-4" />}
            >
              Edit Project
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsShiftModalOpen(true)}
              leftIcon={<Repeat className="w-4 h-4" />}
            >
              Shift / Manage Roster
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={handleDelete}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Project Metrics Summary Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
              Project Lead
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5 truncate">
              <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              {project.lead ? project.lead.name : "Unassigned"}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
              Team Roster
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
              <Users className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              {project.members.length} Members
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
              Estimated Effort
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {project.totalEstimatedHours} Hours
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
              Completion Progress
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              {project.completionPercent}%
            </span>
          </div>
        </div>
      </Card>

      {/* Two Column Layout: Assigned Team + Associated Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Col: Assigned Team Members */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Assigned Roster ({project.members.length})</span>
            </h3>
            <button
              onClick={() => setIsShiftModalOpen(true)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Manage
            </button>
          </div>

          <div className="space-y-3">
            {project.members.length === 0 ? (
              <div className="p-6 text-center text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <p className="text-xs">No team members assigned yet.</p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-3"
                  onClick={() => setIsShiftModalOpen(true)}
                >
                  Assign Teammates
                </Button>
              </div>
            ) : (
              project.members.map((m) => (
                <Link key={m.id} href={`/team/${m.id}`} className="block group">
                  <Card
                    hoverable
                    className="p-3.5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-xs">
                        {m.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                            {m.name}
                          </h4>
                          {project.leadId === m.id && (
                            <Crown className="w-3 h-3 text-amber-500" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">{m.role}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {m.capacityHoursPerWeek}h/wk
                      </span>
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Associated Project Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Project Tasks ({project.tasks.length})</span>
            </h3>

            <Link href="/tasks/new">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                New Task
              </Button>
            </Link>
          </div>

          {project.tasks.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <FolderKanban className="w-10 h-10 stroke-1 mx-auto text-slate-400 mb-2" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                No tasks assigned to this project
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                Create new tasks or attach existing tasks to this project.
              </p>
              <Link href="/tasks/new">
                <Button variant="primary" size="sm">
                  Create First Task
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.tasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/tasks/${task.id}`}
                  className="block group"
                >
                  <Card hoverable className="p-4 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {task.requiredSkill}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
                          {task.status.replace("_", " ")}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {task.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                        {task.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {task.deadline}
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {task.estimatedHours}h
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ShiftMemberModal
        open={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
        project={project}
      />

      <ProjectModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        projectToEdit={project}
      />
    </div>
  );
}
