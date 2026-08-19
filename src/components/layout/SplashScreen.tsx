"use client";

import React, { useState, useEffect } from "react";
import { Layers, Sparkles } from "lucide-react";

export const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [status, setStatus] = useState("Calibrating Workload Signals...");

  useEffect(() => {
    // Check if splash was already shown this session
    if (typeof window !== "undefined") {
      const hasSeen = sessionStorage.getItem("smart_workload_splash_seen");
      if (hasSeen) {
        setIsVisible(false);
        return;
      }
    }

    // Cycle through status messages
    const t1 = setTimeout(() => {
      setStatus("Balancing Team Frequencies...");
    }, 450);

    const t2 = setTimeout(() => {
      setStatus("Capacity Engine Online");
    }, 900);

    // Trigger smooth zoom out & fade reveal
    const t3 = setTimeout(() => {
      setIsExiting(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("smart_workload_splash_seen", "true");
      }
    }, 1300);

    // Unmount from DOM
    const t4 = setTimeout(() => {
      setIsVisible(false);
    }, 1900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  if (!isVisible) return null;

  // Waveform bars configuration
  const waveBars = [
    { delay: "0ms", height: "h-6" },
    { delay: "120ms", height: "h-10" },
    { delay: "240ms", height: "h-14" },
    { delay: "80ms", height: "h-8" },
    { delay: "200ms", height: "h-16" },
    { delay: "320ms", height: "h-12" },
    { delay: "160ms", height: "h-14" },
    { delay: "280ms", height: "h-9" },
    { delay: "60ms", height: "h-5" },
  ];

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-white transition-all duration-600 ease-out select-none ${
        isExiting
          ? "opacity-0 scale-110 pointer-events-none blur-xs"
          : "opacity-100 scale-100"
      }`}
    >
      {/* Subtle Background Radial Dots */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-60 pointer-events-none" />

      {/* Floating Center Showcase Card (Bigger & Prominent) */}
      <div className="relative z-10 p-8 sm:p-12 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl shadow-slate-900/10 dark:shadow-black/70 flex flex-col items-center text-center max-w-sm sm:max-w-md w-full mx-4">
        
        {/* Large Prominent Logo Box */}
        <div className="relative mb-5 group">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-xl shadow-teal-500/20 ring-1 ring-slate-200 dark:ring-slate-700 p-2">
            <img
              src="/logo.png"
              alt="Equinox Logo"
              className="w-full h-full object-contain animate-pulse-subtle"
            />
          </div>
        </div>

        {/* Large Brand Typography */}
        <div className="flex items-center gap-2 mb-1.5">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center">
            <span>Equi</span>
            <span className="bg-gradient-to-r from-teal-500 via-indigo-500 to-indigo-600 dark:from-teal-400 dark:via-indigo-400 dark:to-indigo-300 bg-clip-text text-transparent">
              nox
            </span>
          </h1>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-teal-50 dark:bg-teal-950/90 text-teal-600 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/80 tracking-widest uppercase">
            PRO
          </span>
        </div>

        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">
          Capacity Balancing & Resource Orchestration
        </p>

        {/* Frequency Wave Visualizer Design */}
        <div className="flex items-end justify-center gap-1.5 h-16 w-full my-2 px-6">
          {waveBars.map((bar, idx) => (
            <div
              key={idx}
              className={`w-2 sm:w-2.5 rounded-full bg-gradient-to-t from-indigo-600 via-indigo-500 to-violet-400 dark:from-indigo-500 dark:via-violet-400 dark:to-indigo-300 animate-waveform shadow-xs ${bar.height}`}
              style={{
                animationDelay: bar.delay,
              }}
            />
          ))}
        </div>

        {/* Status Indicator */}
        <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin-subtle" />
          <span>{status}</span>
        </div>
      </div>
    </div>
  );
};
