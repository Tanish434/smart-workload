"use client";

import React, { useState } from "react";
import { Repeat, UserPlus, UserMinus, Crown, ArrowRight } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import {
  useWorkloadStore,
  useMembers,
  useProjects,
  EnrichedProject,
} from "../../store/useWorkloadStore";
import { useToast } from "../ui/Toast";

export interface ShiftMemberModalProps {
  open: boolean;
  onClose: () => void;
  project: EnrichedProject;
}

export const ShiftMemberModal: React.FC<ShiftMemberModalProps> = ({
  open,
  onClose,
  project,
}) => {
  const toast = useToast();
  const allMembers = useMembers();
  const allProjects = useProjects();

  const assignMemberToProject = useWorkloadStore(
    (state) => state.assignMemberToProject
  );
  const removeMemberFromProject = useWorkloadStore(
    (state) => state.removeMemberFromProject
  );
  const shiftMemberProjects = useWorkloadStore(
    (state) => state.shiftMemberProjects
  );
  const updateProject = useWorkloadStore((state) => state.updateProject);

  const [activeTab, setActiveTab] = useState<"shift" | "add" | "remove" | "lead">(
    "shift"
  );

  // Form states
  const [selectedMemberToShift, setSelectedMemberToShift] = useState<string>(
    project.memberIds[0] || ""
  );
  const [targetProjectId, setTargetProjectId] = useState<string>(
    allProjects.filter((p) => p.id !== project.id)[0]?.id || ""
  );

  const unassignedTeammates = allMembers.filter(
    (m) => !project.memberIds.includes(m.id)
  );
  const [memberToAddId, setMemberToAddId] = useState<string>(
    unassignedTeammates[0]?.id || ""
  );

  const [memberToRemoveId, setMemberToRemoveId] = useState<string>(
    project.memberIds[0] || ""
  );

  const [selectedLeadId, setSelectedLeadId] = useState<string>(
    project.leadId || project.memberIds[0] || ""
  );

  const handleShift = () => {
    if (!selectedMemberToShift || !targetProjectId) return;
    shiftMemberProjects(selectedMemberToShift, project.id, targetProjectId);
    const member = allMembers.find((m) => m.id === selectedMemberToShift);
    const targetProject = allProjects.find((p) => p.id === targetProjectId);
    toast.success(
      `Shifted ${member?.name} to "${targetProject?.name}"!`,
      "Member Shifted"
    );
    onClose();
  };

  const handleAddMember = () => {
    if (!memberToAddId) return;
    assignMemberToProject(project.id, memberToAddId);
    const member = allMembers.find((m) => m.id === memberToAddId);
    toast.success(
      `Added ${member?.name} to "${project.name}"!`,
      "Member Added"
    );
    onClose();
  };

  const handleRemoveMember = () => {
    if (!memberToRemoveId) return;
    removeMemberFromProject(project.id, memberToRemoveId);
    const member = allMembers.find((m) => m.id === memberToRemoveId);
    toast.info(
      `Removed ${member?.name} from "${project.name}".`,
      "Roster Updated"
    );
    onClose();
  };

  const handleUpdateLead = () => {
    updateProject(project.id, { leadId: selectedLeadId || null });
    const lead = allMembers.find((m) => m.id === selectedLeadId);
    toast.success(
      `Set ${lead ? lead.name : "None"} as Project Lead for "${project.name}".`,
      "Lead Assigned"
    );
    onClose();
  };

  const otherProjects = allProjects.filter((p) => p.id !== project.id);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Manage Roster: ${project.name}`}
      description="Shift members between projects, assign new teammates, or set leadership"
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("shift")}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "shift"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Shift Member</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("add")}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "add"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("remove")}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "remove"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <UserMinus className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("lead")}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "lead"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Lead</span>
          </button>
        </div>

        {/* Tab 1: Shift Member */}
        {activeTab === "shift" && (
          <div className="space-y-4 pt-2">
            {project.memberIds.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                No members currently assigned to shift.
              </p>
            ) : otherProjects.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                Create more projects first to enable cross-project member shifting.
              </p>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                    Select Member from this Project:
                  </label>
                  <select
                    value={selectedMemberToShift}
                    onChange={(e) => setSelectedMemberToShift(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    {project.members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-center my-1 text-slate-400">
                  <ArrowRight className="w-5 h-5 rotate-90 sm:rotate-0" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                    Shift to Destination Project:
                  </label>
                  <select
                    value={targetProjectId}
                    onChange={(e) => setTargetProjectId(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    {otherProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.memberIds.length} members)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleShift}
                    leftIcon={<Repeat className="w-4 h-4" />}
                  >
                    Execute Shift
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab 2: Add Member */}
        {activeTab === "add" && (
          <div className="space-y-4 pt-2">
            {unassignedTeammates.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                All organization members are already assigned to this project.
              </p>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                    Assign Available Teammate:
                  </label>
                  <select
                    value={memberToAddId}
                    onChange={(e) => setMemberToAddId(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    {unassignedTeammates.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.role}) — {m.workloadPercent}% load
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleAddMember}
                    leftIcon={<UserPlus className="w-4 h-4" />}
                  >
                    Add to Project
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab 3: Remove Member */}
        {activeTab === "remove" && (
          <div className="space-y-4 pt-2">
            {project.memberIds.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                No members currently assigned to this project.
              </p>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                    Remove Member from Project Roster:
                  </label>
                  <select
                    value={memberToRemoveId}
                    onChange={(e) => setMemberToRemoveId(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    {project.members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleRemoveMember}
                    leftIcon={<UserMinus className="w-4 h-4" />}
                  >
                    Remove Member
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab 4: Project Lead */}
        {activeTab === "lead" && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                Designate Project Lead / Manager:
              </label>
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                <option value="">No designated lead</option>
                {allMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleUpdateLead}
                leftIcon={<Crown className="w-4 h-4" />}
              >
                Save Project Lead
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
