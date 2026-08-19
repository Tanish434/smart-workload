import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padded?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable = false, padded = true, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={twMerge(
          clsx(
            "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm transition-all duration-200",
            padded && "p-5 sm:p-6",
            hoverable && "hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5",
            className
          )
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
