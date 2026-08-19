"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  UserX,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Layers,
  Trash2,
  Mail,
  MessageSquare,
  Video,
} from "lucide-react";
import { useMemberById } from "../../../../store/useWorkloadStore";
import { Card } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/Button";
import { Badge } from "../../../../components/ui/Badge";
import { Avatar } from "../../../../components/ui/Avatar";
import { AvailabilityBadge } from "../../../../components/team/AvailabilityBadge";
import { WorkloadBar } from "../../../../components/team/WorkloadBar";
import { MarkUnavailableModal } from "../../../../components/team/MarkUnavailableModal";
import { DeleteMemberModal } from "../../../../components/team/DeleteMemberModal";
import { EmailModal } from "../../../../components/chat/EmailModal";
import { VideoCallModal } from "../../../../components/chat/VideoCallModal";

export default function MemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const memberId = params.memberId as string;
  const member = useMemberById(memberId);

  const [isUnavailableModalOpen, setIsUnavailableModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  if (!member) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Member Not Found
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6">
          The team member you requested could not be located in the current store.
        </p>
        <Link href="/team">
          <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Team Roster
          </Button>
        </Link>
      </div>
    );
  }

  const activeHours = member.activeTasks.reduce(
    (sum, t) => sum + (t.estimatedHours || 0),
    0
  );

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Top Back Nav */}
      <div>
        <Link
          href="/team"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Team</span>
        </Link>
      </div>

      {/* Profile Header Card */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            {/* Big Avatar */}
            <Avatar
              name={member.name}
              src={member.avatar}
              size="2xl"
              status={member.workloadStatus === "overloaded" ? "overloaded" : member.availability}
              className="shrink-0 shadow-elevation"
            />

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {member.name}
                </h1>
                <AvailabilityBadge availability={member.availability} size="md" />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {member.role}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-medium px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Member Action Controls: Chat, Email, Availability & Removal */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link href={`/chat?memberId=${member.id}`}>
              <Button
                variant="primary"
                size="md"
                leftIcon={<MessageSquare className="w-4 h-4" />}
              >
                Start Chat
              </Button>
            </Link>

            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsVideoModalOpen(true)}
              leftIcon={<Video className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
            >
              Video Call
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsEmailModalOpen(true)}
              leftIcon={<Mail className="w-4 h-4 text-indigo-500" />}
            >
              Direct Email
            </Button>

            {member.availability !== "unavailable" && (
              <Button
                variant="secondary"
                size="md"
                onClick={() => setIsUnavailableModalOpen(true)}
                leftIcon={<UserX className="w-4 h-4" />}
              >
                Mark Unavailable
              </Button>
            )}

            <Button
              variant="danger"
              size="md"
              onClick={() => setIsDeleteModalOpen(true)}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Remove
            </Button>
          </div>
        </div>

        {/* Direct Email Modal */}
        <EmailModal
          open={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          member={member}
          projects={member.projects}
        />

        {/* Video Call Modal */}
        <VideoCallModal
          open={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          member={member}
        />

        {/* Workload Status Bar in Header */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-500" />
              Weekly Capacity Allocation
            </span>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400">
                {activeHours} allocated hours out of {member.capacityHoursPerWeek} hrs/week
              </span>
              <span
                className={`font-bold px-2 py-0.5 rounded-md ${
                  member.workloadStatus === "overloaded"
                    ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                    : member.workloadStatus === "at_risk"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                }`}
              >
                {member.workloadPercent}%
              </span>
            </div>
          </div>

          <WorkloadBar
            percent={member.workloadPercent}
            status={member.workloadStatus}
            showLabel={false}
            size="md"
          />
        </div>
      </Card>

      {/* Assigned Tasks Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Assigned Tasks ({member.tasks.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deliverables currently owned by {member.name}
            </p>
          </div>
          <Link href="/tasks/new">
            <Button variant="secondary" size="sm">
              Assign New Task
            </Button>
          </Link>
        </div>

        {member.tasks.length === 0 ? (
          <Card className="p-8 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              No tasks currently assigned
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              This member is completely free for new assignments.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {member.tasks.map((task) => (
              <Link key={task.id} href={`/tasks/${task.id}`} className="group">
                <Card
                  hoverable
                  className="h-full p-4 flex flex-col justify-between border border-slate-200/80 dark:border-slate-800 group-hover:border-indigo-300 dark:group-hover:border-indigo-700/60 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant={{ type: "status", value: task.status }} size="sm" />
                      <Badge variant={{ type: "priority", value: task.priority }} size="sm" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {task.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {task.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {task.deadline}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
                      <Clock className="w-3.5 h-3.5" />
                      {task.estimatedHours}h
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Mark Unavailable Modal */}
      <MarkUnavailableModal
        open={isUnavailableModalOpen}
        onClose={() => setIsUnavailableModalOpen(false)}
        member={member}
      />

      {/* Delete Member Modal */}
      <DeleteMemberModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        member={member}
        activeTaskCount={member.activeTaskCount}
      />
    </div>
  );
}
