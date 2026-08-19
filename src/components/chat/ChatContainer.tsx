"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Mail,
  Search,
  Sparkles,
  MessageSquare,
  Clock,
  Shield,
  FolderKanban,
  ExternalLink,
  CheckCheck,
} from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Avatar } from "../ui/Avatar";
import { EmailModal } from "./EmailModal";
import {
  useWorkloadStore,
  useChatThreads,
  useChatMessages,
} from "../../store/useWorkloadStore";
import type { Member } from "../../types/member";

export interface ChatContainerProps {
  initialMemberId?: string;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  initialMemberId,
}) => {
  const threads = useChatThreads();
  const sendMessage = useWorkloadStore((state) => state.sendMessage);
  const markThreadAsRead = useWorkloadStore((state) => state.markThreadAsRead);

  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    initialMemberId || threads[0]?.member?.id || ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Synchronize when initialMemberId prop updates
  useEffect(() => {
    if (initialMemberId) {
      setSelectedMemberId(initialMemberId);
    }
  }, [initialMemberId]);

  const activeThread =
    threads.find((t) => t.member.id === selectedMemberId) || threads[0];
  const activeMember = activeThread?.member;
  const activeProjects = activeThread?.projects || [];

  const messages = useChatMessages(activeMember?.id || "");

  // Auto-scroll to bottom of chat
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeMember) {
      markThreadAsRead(activeMember.id);
    }
    scrollToBottom();
  }, [messages.length, activeMember?.id]);

  const filteredThreads = threads.filter(
    (t) =>
      t.member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.projects.some((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeMember) return;

    const currentProject = activeProjects[0]?.id || null;
    sendMessage("admin", activeMember.id, inputText.trim(), currentProject);
    setInputText("");
  };

  const handleQuickTemplate = (text: string) => {
    if (!activeMember) return;
    const currentProject = activeProjects[0]?.id || null;
    sendMessage("admin", activeMember.id, text, currentProject);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[760px] max-h-[85vh]">
      {/* ---------------------------------------------------- */}
      {/* LEFT COLUMN: Threads List (4 cols) */}
      {/* ---------------------------------------------------- */}
      <Card className="lg:col-span-4 p-4 flex flex-col h-full border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Header & Search */}
        <div className="space-y-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Team Channels
              </h2>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
              Admin Portal
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search member, role, or project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Thread items list */}
        <div className="flex-1 overflow-y-auto pt-2 space-y-1.5 pr-1">
          {filteredThreads.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No matching team members.
            </div>
          ) : (
            filteredThreads.map(({ member, projects, lastMessage, unreadCount }) => {
              const isSelected = selectedMemberId === member.id;

              return (
                <button
                  type="button"
                  key={member.id}
                  onClick={() => setSelectedMemberId(member.id)}
                  className={`w-full text-left p-3 rounded-2xl transition-all duration-150 relative group cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50/90 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 shadow-sm"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar
                      name={member.name}
                      src={member.avatar}
                      size="md"
                      status={member.availability}
                      className="shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span
                          className={`text-xs font-bold truncate ${
                            isSelected
                              ? "text-indigo-950 dark:text-indigo-200"
                              : "text-slate-900 dark:text-white"
                          }`}
                        >
                          {member.name}
                        </span>
                        {lastMessage && (
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {lastMessage.timestamp}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mb-1.5">
                        {lastMessage ? lastMessage.text : `${member.role}`}
                      </p>

                      {/* Project badges */}
                      <div className="flex items-center gap-1 flex-wrap">
                        {projects.slice(0, 2).map((p) => (
                          <span
                            key={p.id}
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded text-white truncate max-w-[100px]"
                            style={{ backgroundColor: p.color || "#6366f1" }}
                            title={p.name}
                          >
                            {p.name}
                          </span>
                        ))}
                        {projects.length > 2 && (
                          <span className="text-[9px] text-slate-400 font-semibold">
                            +{projects.length - 2}
                          </span>
                        )}
                        {projects.length === 0 && (
                          <span className="text-[10px] text-slate-400 italic">
                            No project
                          </span>
                        )}
                      </div>
                    </div>

                    {unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-sm animate-pulse-subtle">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </Card>

      {/* ---------------------------------------------------- */}
      {/* RIGHT COLUMN: Active Chat Conversation (8 cols) */}
      {/* ---------------------------------------------------- */}
      <Card className="lg:col-span-8 flex flex-col h-full border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden bg-slate-50/30 dark:bg-slate-900/40">
        {activeMember ? (
          <>
            {/* Chat Pane Header */}
            <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar
                  name={activeMember.name}
                  src={activeMember.avatar}
                  size="md"
                  status={activeMember.availability}
                  className="shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {activeMember.name}
                    </h3>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize font-medium">
                      {activeMember.availability}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-500 dark:text-slate-400">
                    <span className="truncate">{activeMember.role}</span>
                    {activeProjects.length > 0 && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1 flex-wrap">
                          {activeProjects.map((p) => (
                            <span
                              key={p.id}
                              className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
                              style={{ backgroundColor: p.color || "#6366f1" }}
                            >
                              {p.name}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Direct Email */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsEmailModalOpen(true)}
                  leftIcon={<Mail className="w-3.5 h-3.5 text-indigo-500" />}
                >
                  <span className="hidden sm:inline">Direct Email</span>
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center text-slate-400">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Direct Channel with {activeMember.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    Coordinate deliverables, share capacity updates, or check timeline status for assigned projects.
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isAdmin = msg.senderId === "admin";
                  const messageProject = activeProjects.find(
                    (p) => p.id === msg.projectId
                  );

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        isAdmin ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl shadow-subtle text-xs sm:text-sm leading-relaxed ${
                          isAdmin
                            ? "bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-br-xs"
                            : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-700/80 rounded-bl-xs"
                        }`}
                      >
                        {messageProject && (
                          <div className="mb-1.5 pb-1 border-b border-white/20 dark:border-slate-700 flex items-center gap-1.5">
                            <span
                              className="text-[9px] font-bold px-1.5 py-0.2 rounded text-white"
                              style={{ backgroundColor: messageProject.color || "#6366f1" }}
                            >
                              {messageProject.name}
                            </span>
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1 px-1">
                        <span>{msg.timestamp}</span>
                        {isAdmin && (
                          <CheckCheck className="w-3 h-3 text-indigo-500" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Templates Strip */}
            <div className="px-4 py-2 bg-white/70 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                <span>Quick:</span>
              </span>
              <button
                type="button"
                onClick={() =>
                  handleQuickTemplate(
                    `Can you provide an ETA for your active tasks on ${
                      activeProjects[0]?.name || "our project"
                    }?`
                  )
                }
                className="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950 text-slate-600 dark:text-slate-300 transition-colors"
              >
                Request Timeline ETA
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickTemplate(
                    "Checking in on your workload this week. Do you have bandwidth for an additional task?"
                  )
                }
                className="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950 text-slate-600 dark:text-slate-300 transition-colors"
              >
                Bandwidth Check
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickTemplate(
                    "Great work on closing those milestone tickets ahead of the deadline!"
                  )
                }
                className="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950 text-slate-600 dark:text-slate-300 transition-colors"
              >
                Sprint Kudos
              </button>
            </div>

            {/* Message Input Footer */}
            <form
              onSubmit={handleSend}
              className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                placeholder={`Message ${activeMember.name} (as Admin)...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={!inputText.trim()}
                leftIcon={<Send className="w-4 h-4" />}
              >
                Send
              </Button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 p-8">
            <MessageSquare className="w-12 h-12 mb-3 text-slate-300" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Select a Channel
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Choose a team member from the left panel to begin chatting.
            </p>
          </div>
        )}
      </Card>

      {/* Direct Email Composer Modal */}
      {activeMember && (
        <EmailModal
          open={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          member={activeMember}
          projects={activeProjects}
        />
      )}
    </div>
  );
};
