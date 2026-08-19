"use client";

import React, { useState, useMemo } from "react";
import { FolderKanban, Plus, Search, Filter, Layers } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { ProjectCard } from "../../../components/projects/ProjectCard";
import { ProjectModal } from "../../../components/projects/ProjectModal";
import { ShiftMemberModal } from "../../../components/projects/ShiftMemberModal";
import { useProjects, EnrichedProject } from "../../../store/useWorkloadStore";
import type { ProjectStatus } from "../../../types/project";

export default function ProjectsPage() {
  const allProjects = useProjects();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectToShift, setProjectToShift] = useState<EnrichedProject | null>(null);

  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (search) {
        const query = search.toLowerCase();
        const matchName = p.name.toLowerCase().includes(query);
        const matchDesc = p.description.toLowerCase().includes(query);
        if (!matchName && !matchDesc) return false;
      }
      return true;
    });
  }, [allProjects, search, statusFilter]);

  const activeProjectsCount = allProjects.filter((p) => p.status === "active").length;
  const totalTasksInProjects = allProjects.reduce(
    (sum, p) => sum + p.tasks.length,
    0
  );

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header Info & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Organization Projects
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage multi-project assignments, track team allocations, and shift workload dynamically.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsProjectModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Project
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects by name or scope..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(["all", "active", "planning", "completed", "on_hold"] as const).map(
            (st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === st
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {st === "all"
                  ? "All Projects"
                  : st.charAt(0).toUpperCase() + st.slice(1).replace("_", " ")}
              </button>
            )
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-4">
            <FolderKanban className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No projects found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-6">
            We couldn&apos;t find any projects matching your search criteria.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsProjectModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create First Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpenShiftModal={(p) => setProjectToShift(p)}
            />
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <ProjectModal
        open={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />

      {/* Shift Member Modal */}
      {projectToShift && (
        <ShiftMemberModal
          open={!!projectToShift}
          onClose={() => setProjectToShift(null)}
          project={projectToShift}
        />
      )}
    </div>
  );
}
