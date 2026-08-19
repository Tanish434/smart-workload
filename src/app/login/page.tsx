"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Layers,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Zap,
  BarChart3,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useToast } from "../../components/ui/Toast";

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("admin@smartworkload.internal");
  const [password, setPassword] = useState("operations2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoFill = () => {
    setEmail("devon.vance@smartworkload.internal");
    setPassword("operations2026!");
    toast.info("Demo admin credentials loaded!", "Quick Access");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please provide your admin email address", "Email Required");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      login(email, password);
      setIsLoading(false);
      toast.success("Welcome back to Admin Dashboard!", "Authentication Successful");
      router.push("/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-white p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Background Dot Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:28px_28px] opacity-40 pointer-events-none" />

      {/* Ambient Lighting Orbs */}
      <div className="absolute w-96 h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 blur-3xl -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-96 h-96 rounded-full bg-violet-500/10 dark:bg-violet-500/15 blur-3xl -bottom-20 -right-20 pointer-events-none" />

      {/* Main Showcase Container */}
      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl shadow-slate-900/10 dark:shadow-black/70 overflow-hidden">
        
        {/* LEFT COLUMN: Feature Showcase (5 cols) */}
        <div className="lg:col-span-5 p-8 sm:p-10 bg-slate-900 text-white flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-violet-950/40 pointer-events-none" />
          
          {/* Top Brand Header */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-teal-500/25 ring-1 ring-white/20 p-1.5 shrink-0">
                <img
                  src="/logo.png"
                  alt="Equinox Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="font-black text-xl tracking-tight text-white flex items-center">
                    <span>Equi</span>
                    <span className="text-teal-400">nox</span>
                  </h1>
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 uppercase">
                    PRO
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">Resource & Operations Suite</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-white leading-snug">
                Intelligent Team Capacity & Priority Orchestration
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Autonomous workload balancing, OS priority aging schedules, and real-time team communications.
              </p>
            </div>
          </div>

          {/* Feature Highlights Checklist */}
          <div className="relative z-10 my-8 space-y-3.5">
            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0 mt-0.5">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-200 block">OS-Style Dynamic Priority Aging</span>
                <span className="text-slate-400 text-[11px]">Auto-escalates tasks as deadlines near</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0 mt-0.5">
                <BarChart3 className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-200 block">Live Workload & Fit Scoring</span>
                <span className="text-slate-400 text-[11px]">Skill matching & overload detection</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0 mt-0.5">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-200 block">Admin Member Chat & Email</span>
                <span className="text-slate-400 text-[11px]">Direct channels and 1-click dispatch</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Pill */}
          <div className="relative z-10 flex items-center gap-2 text-[11px] text-slate-400 pt-4 border-t border-slate-800/80">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secure In-Memory Reactive Architecture</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Sign In Form (7 cols) */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2 border border-indigo-100 dark:border-indigo-900/60">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Admin Authentication Portal</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Sign in to Dashboard
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Access managerial controls, project rosters, and capacity balancing.
              </p>
            </div>

            {/* Quick Demo Fill Button */}
            <button
              type="button"
              onClick={handleDemoFill}
              className="w-full py-2.5 px-3.5 rounded-2xl bg-indigo-50/80 hover:bg-indigo-100/80 dark:bg-indigo-950/50 dark:hover:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>⚡ Quick-Fill Demo Admin Credentials</span>
            </button>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Admin Work Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@smartworkload.internal"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Security Password
                  </label>
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                    Demo Credentials
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password..."
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer transition-colors"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-indigo-500" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700"
                  />
                  <span>Keep admin session active</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating Admin...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Admin Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              <span className="text-[11px] text-slate-400">
                Authorized for Administrator & Team Management Roles
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
