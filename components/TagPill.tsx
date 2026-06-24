import type { Role } from "@/lib/projects";

interface TagPillProps {
  role: Role;
  dimmed: boolean;
}

export function TagPill({ role, dimmed }: TagPillProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-[6px] border border-[#2e2d2814] border-[0.5px] px-[4px] py-[2px] font-tag text-tag uppercase text-muted shrink-0 transition-layout ${
        dimmed ? "opacity-5" : ""
      }`}
    >
      {role}
    </div>
  );
}
