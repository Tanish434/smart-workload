"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, PlusCircle } from "lucide-react";
import { Card } from "../../../../components/ui/Card";
import { TaskForm, TaskFormData } from "../../../../components/tasks/TaskForm";
import { SuggestedMembersPanel } from "../../../../components/tasks/SuggestedMembersPanel";
import { useWorkloadStore } from "../../../../store/useWorkloadStore";
import { useToast } from "../../../../components/ui/Toast";
import { SKILL_OPTIONS } from "../../../../lib/constants";
import type { TaskPriority } from "../../../../types/task";

export default function NewTaskPage() {
  const router = useRouter();
  const toast = useToast();
  const createTask = useWorkloadStore((state) => state.createTask);

  const [draftData, setDraftData] = useState<{
    requiredSkill: string;
    priority: TaskPriority;
    assignedTo: string | null;
  }>({
    requiredSkill: SKILL_OPTIONS[0],
    priority: "medium",
    assignedTo: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectSuggestedMember = (memberId: string) => {
    setDraftData((prev) => ({
      ...prev,
      assignedTo: memberId,
    }));
    toast.info("Assignee updated from recommendations", "Assignee Selected");
  };

  const handleSubmit = (data: TaskFormData) => {
    setIsSubmitting(true);
    const newTask = createTask({
      title: data.title,
      description: data.description,
      requiredSkill: data.requiredSkill,
      priority: data.priority,
      deadline: data.deadline,
      estimatedHours: data.estimatedHours,
      assignedTo: data.assignedTo,
      projectId: data.projectId || null,
      status: "todo",
    });

    toast.success(`Task "${newTask.title}" created successfully!`, "Task Created");
    router.push("/tasks");
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Back Link */}
      <div>
        <Link
          href="/tasks"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tasks Board</span>
        </Link>
      </div>

      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Create New Task
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Specify task requirements. The live suggestion engine dynamically scores teammates for optimal fit.
        </p>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7">
          <Card className="p-6 sm:p-8">
            <TaskForm
              initialData={{
                requiredSkill: draftData.requiredSkill,
                priority: draftData.priority,
                assignedTo: draftData.assignedTo,
              }}
              onChangeDraft={(draft) => setDraftData(draft)}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              submitLabel="Create & Assign Task"
            />
          </Card>
        </div>

        {/* Right Column: Live Recommendations Panel */}
        <div className="lg:col-span-5 sticky top-24">
          <SuggestedMembersPanel
            draftSkill={draftData.requiredSkill}
            draftPriority={draftData.priority}
            selectedAssigneeId={draftData.assignedTo}
            onSelectMember={handleSelectSuggestedMember}
          />
        </div>
      </div>
    </div>
  );
}
