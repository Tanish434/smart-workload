"use client";

import React, { useState } from "react";
import { clsx } from "clsx";

export interface AvatarProps {
  name: string;
  src?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  status?: "available" | "busy" | "unavailable" | "overloaded" | null;
  className?: string;
}

const GRADIENTS = [
  "from-indigo-500 to-violet-600",
  "from-sky-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-purple-500 to-indigo-600",
  "from-teal-500 to-cyan-600",
  "from-fuchsia-500 to-rose-600",
];

const getGradientForName = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = "md",
  status,
  className,
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    xs: "w-5 h-5 text-[9px]",
    sm: "w-7 h-7 text-[11px]",
    md: "w-9 h-9 text-xs",
    lg: "w-11 h-11 text-sm",
    xl: "w-14 h-14 text-base",
    "2xl": "w-20 h-20 text-xl font-bold",
  };

  const statusDotSizes = {
    xs: "w-1.5 h-1.5 border-[1px]",
    sm: "w-2 h-2 border-[1.5px]",
    md: "w-2.5 h-2.5 border-2",
    lg: "w-3 h-3 border-2",
    xl: "w-3.5 h-3.5 border-2",
    "2xl": "w-4 h-4 border-2",
  };

  const statusColors = {
    available: "bg-emerald-500",
    busy: "bg-amber-500",
    unavailable: "bg-slate-400",
    overloaded: "bg-rose-500 animate-pulse",
  };

  const gradientClass = getGradientForName(name || "User");
  const initials = getInitials(name || "User");

  return (
    <div className={clsx("relative inline-flex shrink-0 select-none", className)}>
      <div
        className={clsx(
          "rounded-full overflow-hidden flex items-center justify-center font-bold text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10",
          sizeClasses[size],
          (!src || imgError) && `bg-gradient-to-tr ${gradientClass}`
        )}
      >
        {src && !imgError ? (
          <img
            src={src}
            alt={name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {status && (
        <span
          className={clsx(
            "absolute bottom-0 right-0 rounded-full border-white dark:border-slate-900 shadow-sm",
            statusDotSizes[size],
            statusColors[status]
          )}
          title={`Status: ${status}`}
        />
      )}
    </div>
  );
};
