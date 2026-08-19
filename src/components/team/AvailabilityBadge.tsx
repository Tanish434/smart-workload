import React from "react";
import { Badge } from "../ui/Badge";
import type { MemberAvailability } from "../../types/member";

export interface AvailabilityBadgeProps {
  availability: MemberAvailability;
  size?: "sm" | "md";
  showDot?: boolean;
  className?: string;
}

export const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({
  availability,
  size = "md",
  showDot = true,
  className,
}) => {
  return (
    <Badge
      variant={{ type: "availability", value: availability }}
      size={size}
      showDot={showDot}
      className={className}
    />
  );
};
