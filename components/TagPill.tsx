import type { Role } from "@/lib/projects";

interface TagPillProps {
  role: Role;
  dimmed: boolean;
}

export function TagPill({ role, dimmed }: TagPillProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-[4px] border border-hairline border-[0.5px] px-[5px] pt-[2px] pb-[2px] font-tag text-tag uppercase text-muted shrink-0 transition-layout ${
        dimmed ? "opacity-5" : ""
      }`}
    >
      {role}
    </div>
  );
}
