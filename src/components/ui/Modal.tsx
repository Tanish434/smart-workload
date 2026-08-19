"use client";

import React, { useEffect } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { X } from "lucide-react";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  maxWidth = "md",
  className,
}) => {
  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [open, onClose]);

  if (!open) return null;

  const maxWidthClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-lg",
    lg: "sm:max-w-2xl",
    xl: "sm:max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal / Bottom Sheet */}
      <div
        className={twMerge(
          clsx(
            "relative w-full bg-white dark:bg-slate-900 shadow-2xl rounded-t-3xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 z-10 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh] animate-slide-up",
            maxWidthClasses[maxWidth],
            className
          )
        )}
      >
        {/* Mobile handle indicator */}
        <div className="sm:hidden w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-3 mb-1" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-4 sm:pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-6">
              {title}
            </h3>
            {description && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
