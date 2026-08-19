import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100";

    const variantStyles = {
      primary:
        "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-sm focus:ring-indigo-500",
      secondary:
        "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-sm focus:ring-slate-400",
      danger:
        "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm focus:ring-rose-500",
      ghost:
        "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white focus:ring-slate-300",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5 font-medium",
      md: "text-sm px-4 py-2.5 gap-2",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={twMerge(
          clsx(
            baseStyles,
            variantStyles[variant],
            sizeStyles[size],
            fullWidth ? "w-full" : "w-auto",
            className
          )
        )}
        {...props}
      >
        {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
