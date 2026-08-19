import React from "react";
import Link from "next/link";
import { ArrowUpRight, CheckSquare } from "lucide-react";
import { Card } from "../ui/Card";
import { Avatar } from "../ui/Avatar";
import { AvailabilityBadge } from "./AvailabilityBadge";
import { WorkloadBar } from "./WorkloadBar";
import type { EnrichedMember } from "../../store/useWorkloadStore";

export interface MemberCardProps {
  member: EnrichedMember;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  const activeHours = member.activeTasks.reduce(
    (sum, t) => sum + (t.estimatedHours || 0),
    0
  );

  const displayedSkills = member.skills.slice(0, 3);
  const remainingSkillsCount = member.skills.length - 3;

  return (
    <Link href={`/team/${member.id}`} className="group block h-full">
      <Card
        hoverable
        className="h-full flex flex-col justify-between p-5 border border-slate-200/80 dark:border-slate-800 transition-all duration-200 group-hover:border-indigo-300 dark:group-hover:border-indigo-700/60 relative"
      >
        <div>
          {/* Top Row: Avatar + Info + Availability Badge */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar
                name={member.name}
                src={member.avatar}
                size="lg"
                status={member.workloadStatus === "overloaded" ? "overloaded" : member.availability}
                className="group-hover:scale-105 transition-transform shrink-0"
              />
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {member.role}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1.5">
              <AvailabilityBadge availability={member.availability} size="sm" />
              <ArrowUpRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors shrink-0" />
            </div>
          </div>

          {/* Skill Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {displayedSkills.map((skill) => (
              <span
                key={skill}
                className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                {skill}
              </span>
            ))}
            {remainingSkillsCount > 0 && (
              <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                +{remainingSkillsCount}
              </span>
            )}
          </div>
        </div>

        {/* Bottom Section: Active Tasks & Workload Bar */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>{member.activeTaskCount} active tasks</span>
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {activeHours}h / {member.capacityHoursPerWeek}h
            </span>
          </div>

          <WorkloadBar
            percent={member.workloadPercent}
            status={member.workloadStatus}
            showLabel={false}
            size="sm"
          />
        </div>
      </Card>
    </Link>
  );
};
