import type { Role } from "@/lib/projects";

interface TagPillProps {
  role: Role;
  dimmed: boolean;
}

export function TagPill({ role, dimmed }: TagPillProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-[6px] border border-[rgba(46,45,40,0.05)] border-[1px] px-[4px] py-[2px] font-tag text-tag uppercase text-[rgba(46,45,40,0.5)] shrink-0 transition-layout ${
        dimmed ? "opacity-5" : ""
      }`}
    >
      {role}
    </div>
  );
}
