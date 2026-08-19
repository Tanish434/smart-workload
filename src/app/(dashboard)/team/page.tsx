"use client";

import React, { useState, useMemo } from "react";
import { Users, UserPlus } from "lucide-react";
import { MemberFilterBar, MemberFilterState } from "../../../components/team/MemberFilterBar";
import { MemberCard } from "../../../components/team/MemberCard";
import { Button } from "../../../components/ui/Button";
import { useMembers } from "../../../store/useWorkloadStore";
import { AddMemberModal } from "../../../components/team/AddMemberModal";

export default function TeamPage() {
  const allMembers = useMembers();

  const [filters, setFilters] = useState<MemberFilterState>({
    search: "",
    skill: "all",
    availability: "all",
    sortBy: "workload_desc",
  });

  const filteredMembers = useMemo(() => {
    return allMembers
      .filter((member) => {
        // Search Filter
        if (filters.search) {
          const query = filters.search.toLowerCase();
          const matchName = member.name.toLowerCase().includes(query);
          const matchRole = member.role.toLowerCase().includes(query);
          const matchSkill = member.skills.some((s) =>
            s.toLowerCase().includes(query)
          );
          if (!matchName && !matchRole && !matchSkill) return false;
        }

        // Skill Filter
        if (filters.skill !== "all" && !member.skills.includes(filters.skill)) {
          return false;
        }

        // Availability Filter
        if (
          filters.availability !== "all" &&
          member.availability !== filters.availability
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case "workload_desc":
            return b.workloadPercent - a.workloadPercent;
          case "workload_asc":
            return a.workloadPercent - b.workloadPercent;
          case "name":
            return a.name.localeCompare(b.name);
          case "tasks":
            return b.activeTaskCount - a.activeTaskCount;
          default:
            return 0;
        }
      });
  }, [allMembers, filters]);

  const handleResetFilters = () => {
    setFilters({
      search: "",
      skill: "all",
      availability: "all",
      sortBy: "workload_desc",
    });
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header Info & Add Member Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Team Capacity Roster
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time workload calculation, skill specialization, and availability status.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          Add Team Member
        </Button>
      </div>

      <AddMemberModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Filter and Search Bar */}
      <MemberFilterBar
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
        resultCount={filteredMembers.length}
      />

      {/* Members Grid or Empty State */}
      {filteredMembers.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-4">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No team members found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-6">
            We couldn&apos;t find any teammates matching your search filters. Try clearing your search or filters.
          </p>
          <Button variant="secondary" onClick={handleResetFilters} size="sm">
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      )}
    </div>
  );
}
