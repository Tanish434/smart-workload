"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { clsx } from "clsx";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "warning" | "error" | "info";

export interface ToastMessage {
  id: string;
  title?: string;
  message: string;
  type?: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType, title?: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = "success", title?: string) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      setToasts((prev) => [...prev, { id, message, type, title }]);

      // Auto dismiss after 3 seconds
      setTimeout(() => {
        removeToast(id);
      }, 3000);
    },
    [removeToast]
  );

  const contextValue: ToastContextValue = {
    toast: addToast,
    success: (msg, title) => addToast(msg, "success", title),
    error: (msg, title) => addToast(msg, "error", title),
    warning: (msg, title) => addToast(msg, "warning", title),
    info: (msg, title) => addToast(msg, "info", title),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Toast container: bottom-right on desktop, bottom-center on mobile */}
      <div className="fixed bottom-16 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm ml-auto">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={clsx(
              "pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-float border backdrop-blur-md transition-all duration-300 animate-slide-up",
              t.type === "success" &&
                "bg-emerald-900/90 text-white border-emerald-700/60 dark:bg-emerald-950/90",
              t.type === "warning" &&
                "bg-amber-900/90 text-white border-amber-700/60 dark:bg-amber-950/90",
              t.type === "error" &&
                "bg-rose-900/90 text-white border-rose-700/60 dark:bg-rose-950/90",
              t.type === "info" &&
                "bg-slate-900/90 text-white border-slate-700/60 dark:bg-slate-900/95"
            )}
          >
            <div className="shrink-0 mt-0.5">
              {t.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-300" />}
              {t.type === "warning" && <AlertCircle className="w-5 h-5 text-amber-300" />}
              {t.type === "error" && <AlertCircle className="w-5 h-5 text-rose-300" />}
              {t.type === "info" && <Info className="w-5 h-5 text-blue-300" />}
            </div>
            <div className="flex-1 text-sm">
              {t.title && <h4 className="font-semibold text-white mb-0.5">{t.title}</h4>}
              <p className="text-slate-100 text-xs sm:text-sm font-medium leading-relaxed">
                {t.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-300 hover:text-white shrink-0 p-1 -mr-1 -mt-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      toast: (msg) => console.log("[Toast]:", msg),
      success: (msg) => console.log("[Toast Success]:", msg),
      error: (msg) => console.error("[Toast Error]:", msg),
      warning: (msg) => console.warn("[Toast Warning]:", msg),
      info: (msg) => console.info("[Toast Info]:", msg),
    };
  }
  return context;
}
