"use client";

import type { Role } from "@/lib/projects";
import { TagPill } from "./TagPill";

interface TagRowProps {
  roles: Role[];
  dimmed: boolean;
  onRowEnter: () => void;
  onRowLeave: () => void;
}

export function TagRow({ roles, dimmed, onRowEnter, onRowLeave }: TagRowProps) {
  return (
    <div
      className="flex gap-[4px] items-center shrink-0 row-cell"
      onMouseEnter={onRowEnter}
      onMouseLeave={onRowLeave}
    >
      {roles.map((role, i) => (
        <TagPill key={`${role}-${i}`} role={role} dimmed={dimmed} />
      ))}
    </div>
  );
}
