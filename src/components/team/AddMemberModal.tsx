"use client";

import React, { useState } from "react";
import { UserPlus, Plus, X, Sparkles } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Avatar } from "../ui/Avatar";
import { SKILL_OPTIONS } from "../../lib/constants";
import { useWorkloadStore } from "../../store/useWorkloadStore";
import { useToast } from "../ui/Toast";
import type { MemberAvailability } from "../../types/member";

export interface AddMemberModalProps {
  open: boolean;
  onClose: () => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  open,
  onClose,
}) => {
  const createMember = useWorkloadStore((state) => state.createMember);
  const toast = useToast();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [avatar, setAvatar] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80"
  );
  const [capacity, setCapacity] = useState(40);
  const [availability, setAvailability] = useState<MemberAvailability>("available");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["Frontend"]);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const AVATAR_PRESETS = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&h=256&q=80",
  ];

  const handleToggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills([...selectedSkills, trimmed]);
      setCustomSkillInput("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!name.trim()) errs.name = "Full name is required.";
    if (!role.trim()) errs.role = "Role/Title is required.";
    if (selectedSkills.length === 0)
      errs.skills = "Select at least one skill proficiency.";
    if (!capacity || capacity <= 0 || capacity > 80)
      errs.capacity = "Capacity must be between 1 and 80 hours/week.";

    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      const member = createMember({
        name: name.trim(),
        role: role.trim(),
        skills: selectedSkills,
        capacityHoursPerWeek: capacity,
        availability,
        avatar: avatar.trim() || undefined,
      });

      toast.success(
        `Added ${member.name} to team roster!`,
        "Member Added"
      );

      // Reset form
      setName("");
      setRole("");
      setAvatar(AVATAR_PRESETS[0]);
      setCapacity(40);
      setAvailability("available");
      setSelectedSkills(["Frontend"]);
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Team Member"
      description="Expand organization capacity and register specialized skills"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Avatar Selection Row */}
        <div>
          <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2">
            Profile Picture Avatar
          </label>
          <div className="flex items-center gap-3 mb-3">
            <Avatar
              name={name || "New"}
              src={avatar}
              size="lg"
              className="ring-2 ring-indigo-500/30 shrink-0"
            />
            <div className="flex flex-wrap gap-1.5 items-center">
              {AVATAR_PRESETS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setAvatar(preset)}
                  className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-transform hover:scale-110 ${
                    avatar === preset
                      ? "border-indigo-600 ring-2 ring-indigo-500/40"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={preset} alt="preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          <input
            type="url"
            placeholder="Or paste custom image URL (https://...)"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Jordan Hayes"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.name && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name}</p>
          )}
        </div>

        {/* Role & Title */}
        <div>
          <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
            Role / Job Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Senior Cloud Architect"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.role && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.role}</p>
          )}
        </div>

        {/* Capacity & Initial Availability */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
              Weekly Capacity (Hours) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min={5}
              max={60}
              value={capacity}
              onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.capacity && (
              <p className="text-xs text-rose-500 mt-1 font-medium">
                {errors.capacity}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
              Availability Status
            </label>
            <select
              value={availability}
              onChange={(e) =>
                setAvailability(e.target.value as MemberAvailability)
              }
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="available">Available (Ready for work)</option>
              <option value="busy">Busy (High activity)</option>
              <option value="unavailable">Unavailable (On leave / blocked)</option>
            </select>
          </div>
        </div>

        {/* Skill Proficiencies */}
        <div>
          <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1.5">
            Skill Proficiencies <span className="text-rose-500">*</span>
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {SKILL_OPTIONS.map((skill) => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <button
                  type="button"
                  key={skill}
                  onClick={() => handleToggleSkill(skill)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400"
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>

          {/* Add custom tag */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add custom skill tag..."
              value={customSkillInput}
              onChange={(e) => setCustomSkillInput(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddCustomSkill}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Tag
            </Button>
          </div>
          {errors.skills && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.skills}</p>
          )}
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
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Create Member
          </Button>
        </div>
      </form>
    </Modal>
  );
};
