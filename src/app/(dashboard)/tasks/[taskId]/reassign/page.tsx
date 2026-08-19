"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Share2 } from "lucide-react";
import { Card } from "../../../../../components/ui/Card";
import { ReassignPanel } from "../../../../../components/reassign/ReassignPanel";

export default function ReassignTaskPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const taskId = params.taskId as string;
  const queueParam = searchParams.get("queue");

  const queueTaskIds = queueParam
    ? queueParam.split(",").filter((id) => id.trim().length > 0)
    : [];

  const handleSuccess = () => {
    if (queueTaskIds.length > 0) {
      const nextTaskId = queueTaskIds[0];
      const remainingQueue = queueTaskIds.slice(1).join(",");
      const query = remainingQueue ? `?queue=${remainingQueue}` : "";

      router.push(`/tasks/${nextTaskId}/reassign${query}`);
    } else {
      router.push("/tasks");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-3xl mx-auto">
      {/* Top Back Navigation */}
      <div>
        <Link
          href={`/tasks/${taskId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Task Details</span>
        </Link>
      </div>

      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Share2 className="w-6 h-6 text-indigo-600" />
          <span>Reassign Task</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Select an optimal team member to take ownership and restore balanced capacity.
        </p>
      </div>

      {/* Reassign Panel Container */}
      <Card className="p-6 sm:p-8">
        <ReassignPanel
          taskId={taskId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          queueRemainingCount={queueTaskIds.length}
        />
      </Card>
    </div>
  );
}
