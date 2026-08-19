"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChatContainer } from "../../../components/chat/ChatContainer";

function ChatContent() {
  const searchParams = useSearchParams();
  const initialMemberId = searchParams.get("memberId") || undefined;

  return <ChatContainer initialMemberId={initialMemberId} />;
}

export default function ChatPage() {
  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Admin Team Communications
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Direct messaging channels and official email dispatch for all organizational projects.
        </p>
      </div>

      {/* Chat Container with Suspense for search params */}
      <Suspense
        fallback={
          <div className="h-[600px] flex items-center justify-center text-xs text-slate-400">
            Loading team channels...
          </div>
        }
      >
        <ChatContent />
      </Suspense>
    </div>
  );
}
