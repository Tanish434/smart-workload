"use client";

import React, { useState, useEffect } from "react";
import { Mail, Send, Copy, Check, Sparkles, ExternalLink } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { useToast } from "../ui/Toast";
import { Avatar } from "../ui/Avatar";
import type { Member } from "../../types/member";
import type { Project } from "../../types/project";

export interface EmailModalProps {
  open: boolean;
  onClose: () => void;
  member: Member | null;
  projects?: Project[];
  defaultSubject?: string;
  defaultBody?: string;
}

export const EmailModal: React.FC<EmailModalProps> = ({
  open,
  onClose,
  member,
  projects = [],
  defaultSubject = "",
  defaultBody = "",
}) => {
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const emailAddress = member
    ? `${member.name.toLowerCase().replace(/[^a-z0-9]/g, ".")}@smartworkload.internal`
    : "";

  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projects[0]?.id || ""
  );

  useEffect(() => {
    if (open && member) {
      const activeProjectName = projects[0]?.name || "Organization Tasks";
      setSubject(
        defaultSubject || `[${activeProjectName}] Action Item & Workload Sync`
      );
      setBody(
        defaultBody ||
          `Hi ${member.name.split(" ")[0]},\n\nHope you are having a productive week.\n\nI am reaching out regarding your active deliverables and timeline for "${activeProjectName}". Please let me know if you anticipate any blockers or require additional capacity support.\n\nBest regards,\nEngineering Operations Team`
      );
      setSelectedProjectId(projects[0]?.id || "");
      setCopied(false);
    }
  }, [open, member, projects, defaultSubject, defaultBody]);

  if (!member) return null;

  const handleApplyTemplate = (type: "deadline" | "rebalance" | "kudos") => {
    const activeProject =
      projects.find((p) => p.id === selectedProjectId)?.name || "Current Project";
    if (type === "deadline") {
      setSubject(`[URGENT] Deadline Escalation Sync: ${activeProject}`);
      setBody(
        `Hi ${member.name.split(" ")[0]},\n\nAccording to our automated priority aging schedule, one or more tasks on "${activeProject}" are due within 24-48 hours.\n\nCould you please send a quick status update or flag if we should reassign support to prevent delays?\n\nThanks,\nAdmin Operations`
      );
    } else if (type === "rebalance") {
      setSubject(`[Capacity Notice] Workload Rebalance for ${activeProject}`);
      setBody(
        `Hi ${member.name.split(" ")[0]},\n\nWe noticed your active allocation is currently exceeding standard capacity thresholds. We are planning to redistribute a few sub-tasks to ensure healthy throughput.\n\nLet's coordinate on which items you would prefer to keep.\n\nBest,\nAdmin Team`
      );
    } else {
      setSubject(`Great progress on ${activeProject}!`);
      setBody(
        `Hi ${member.name.split(" ")[0]},\n\nJust wanted to commend your recent velocity on "${activeProject}". All milestones are tracking smoothly!\n\nKeep up the great work,\nManagement`
      );
    }
    toast.info("Email template applied!", "Template Loaded");
  };

  const handleCopy = () => {
    const fullText = `To: ${emailAddress}\nSubject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    toast.success("Email content copied to clipboard!", "Copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenMailto = () => {
    const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, "_blank");
    toast.success(`Opening email client for ${emailAddress}`, "Email Client Launched");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Direct Email Dispatch"
      description="Send official communication directly to team member inbox"
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Member & Project Info Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar name={member.name} src={member.avatar} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {member.name}
                </span>
                <span className="text-xs text-slate-400">({member.role})</span>
              </div>
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400">
                {emailAddress}
              </span>
            </div>
          </div>

          {projects.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                Active In:
              </span>
              {projects.map((p) => (
                <span
                  key={p.id}
                  className="text-xs px-2 py-0.5 rounded-md text-white font-semibold"
                  style={{ backgroundColor: p.color || "#6366f1" }}
                >
                  {p.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Quick Template Chips */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Quick Message Templates</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleApplyTemplate("deadline")}
              className="text-xs px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 hover:bg-amber-100 font-medium transition-colors"
            >
              ⏳ Looming Deadline Sync
            </button>
            <button
              type="button"
              onClick={() => handleApplyTemplate("rebalance")}
              className="text-xs px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 font-medium transition-colors"
            >
              ⚖️ Workload Rebalance Notice
            </button>
            <button
              type="button"
              onClick={() => handleApplyTemplate("kudos")}
              className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-100 font-medium transition-colors"
            >
              🌟 Progress Commendation
            </button>
          </div>
        </div>

        {/* Subject Line */}
        <div>
          <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
            Subject Line
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Body Textarea */}
        <div>
          <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
            Email Message Content
          </label>
          <textarea
            rows={7}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-normal leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            leftIcon={copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          >
            {copied ? "Copied to Clipboard" : "Copy Formatted Text"}
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleOpenMailto}
              leftIcon={<ExternalLink className="w-4 h-4" />}
            >
              Launch Default Email Client
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
