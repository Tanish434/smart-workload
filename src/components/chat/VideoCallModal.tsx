"use client";

import React, { useState } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  Copy,
  Check,
  Sparkles,
  Users,
  Shield,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Modal } from "../ui/Modal";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { useToast } from "../ui/Toast";
import type { Member } from "../../types/member";

export interface VideoCallModalProps {
  open: boolean;
  onClose: () => void;
  member: Member;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  open,
  onClose,
  member,
}) => {
  const toast = useToast();
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [copied, setCopied] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const roomUrl = `https://meet.equinox.internal/room/${member.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(roomUrl);
    setCopied(true);
    toast.success("Meeting link copied to clipboard!", "Link Copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartCall = () => {
    setIsInCall(true);
    toast.success(`Connecting video huddle with ${member.name}...`, "Room Connected");
  };

  const handleEndCall = () => {
    setIsInCall(false);
    toast.info("Video call ended.", "Call Disconnected");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={isInCall ? handleEndCall : onClose}
      title={isInCall ? `Live Huddle with ${member.name}` : `Start Video Huddle`}
      description={`Encrypted high-definition team video room with ${member.name} (${member.role})`}
      maxWidth="lg"
    >
      <div className="space-y-5 select-none">
        {/* Main Video Room Canvas / Preview Area */}
        <div className="relative w-full aspect-video rounded-3xl bg-slate-950 overflow-hidden border border-slate-800 shadow-2xl flex flex-col items-center justify-center p-6 text-white">
          {/* Ambient Lighting Background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-teal-950/40 via-slate-950 to-indigo-950/40 pointer-events-none" />
          <div className="absolute w-72 h-72 rounded-full bg-teal-500/10 blur-3xl -top-10 -left-10 pointer-events-none" />

          {/* Video Feed Placeholder / Avatar View */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-teal-500/30 overflow-hidden shadow-2xl bg-slate-900 flex items-center justify-center">
                {isCameraOff ? (
                  <VideoOff className="w-10 h-10 text-slate-500" />
                ) : (
                  <Avatar
                    name={member.name}
                    src={member.avatar}
                    size="lg"
                    className="w-full h-full"
                  />
                )}
              </div>

              {/* Status Badge */}
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-slate-950 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              </span>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center justify-center gap-2">
                <span>{member.name}</span>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-800 text-teal-300 border border-slate-700">
                  {member.availability.toUpperCase()}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{member.role}</p>
            </div>

            {/* Audio Waveform Indicator */}
            <div className="flex items-center gap-1 h-6">
              {[12, 20, 16, 24, 18, 14, 22, 10].map((h, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full bg-teal-400 ${
                    isMicMuted ? "opacity-30 h-1.5" : "animate-waveform"
                  }`}
                  style={{
                    height: isMicMuted ? 6 : `${h}px`,
                    animationDelay: `${i * 90}ms`,
                  }}
                />
              ))}
            </div>

            {isInCall && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-xs font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Call • HD Audio & Video</span>
              </div>
            )}
          </div>

          {/* Bottom Floating Control Bar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-3 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700 shadow-xl">
            <button
              type="button"
              onClick={() => setIsMicMuted(!isMicMuted)}
              title={isMicMuted ? "Unmute Microphone" : "Mute Microphone"}
              className={`p-2.5 rounded-xl text-xs font-semibold transition-all ${
                isMicMuted
                  ? "bg-rose-500 text-white"
                  : "bg-slate-800 text-slate-200 hover:bg-slate-700"
              }`}
            >
              {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setIsCameraOff(!isCameraOff)}
              title={isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
              className={`p-2.5 rounded-xl text-xs font-semibold transition-all ${
                isCameraOff
                  ? "bg-rose-500 text-white"
                  : "bg-slate-800 text-slate-200 hover:bg-slate-700"
              }`}
            >
              {isCameraOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsScreenSharing(!isScreenSharing);
                toast.info(
                  isScreenSharing ? "Screen sharing stopped" : "Simulated screen sharing active",
                  "Screen Share"
                );
              }}
              title="Share Screen"
              className={`p-2.5 rounded-xl text-xs font-semibold transition-all ${
                isScreenSharing
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-slate-200 hover:bg-slate-700"
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>

            {isInCall && (
              <button
                type="button"
                onClick={handleEndCall}
                title="End Call"
                className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-all"
              >
                <PhoneOff className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Room Info & Quick Join Link */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Shield className="w-4 h-4 text-teal-500 shrink-0" />
            <span className="font-mono truncate">{roomUrl}</span>
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold transition-colors cursor-pointer shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Room Link</span>
              </>
            )}
          </button>
        </div>

        {/* Agenda Presets */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Quick Agenda Prompts:
          </label>
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              "⚡ 5-Min Capacity Check-In",
              "🚨 Overload Relief & Task Rebalance",
              "🎯 Sprint Milestone Alignment",
            ].map((agenda, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-medium"
              >
                {agenda}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" size="md" onClick={onClose}>
            Close
          </Button>

          {!isInCall ? (
            <Button
              variant="primary"
              size="md"
              onClick={handleStartCall}
              leftIcon={<Video className="w-4 h-4" />}
            >
              Start Live Video Huddle
            </Button>
          ) : (
            <Button
              variant="danger"
              size="md"
              onClick={handleEndCall}
              leftIcon={<PhoneOff className="w-4 h-4" />}
            >
              Leave Huddle
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
