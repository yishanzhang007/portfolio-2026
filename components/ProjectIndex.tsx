"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { projects } from "@/lib/projects";
import { TagPill } from "./TagPill";
import { HoverMarker } from "./HoverMarker";

interface ProjectIndexProps {
  variant: "desktop" | "mobile";
}

export function ProjectIndex({ variant }: ProjectIndexProps) {
  const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null);
  // Tracks the row the "Read case study" text is currently sitting at.
  // Mirrors HoverMarker's lastRowIndexRef pattern: when the cursor moves
  // through rows, the text invisibly tracks the cursor so its `top` always
  // has a delta to animate against when it fades in on clinic-AI's row.
  const readCaseStudyLastRowRef = useRef<number>(0);

  const isDimmed = (i: number) =>
    activeRowIndex !== null && activeRowIndex !== i;

  if (variant === "mobile") {
    // Tap-to-select: first tap on a row dims the others; the second tap on
    // the same row lets the <Link> navigate. Tapping a different row just
    // re-targets the dim.
    const handleRowClick = (i: number) => (e: React.MouseEvent) => {
      if (activeRowIndex !== i) {
        e.preventDefault();
        setActiveRowIndex(i);
      }
    };

    return (
      <div className="flex flex-col w-full gap-y-[4px] sm:gap-y-0">
        {projects.map((p, i) => {
          const rowContent = (
            <>
              {/* Below sm, title leading matches tag pill height (~19px) so
                  each row is exactly as tall as its tag column. Combined with
                  the parent's gap-y-[4px], every consecutive tag pill has a
                  uniform 4px gap — whether they're stacked inside the same
                  project or in adjacent ones. */}
              <div className="w-[180px] shrink-0 text-body text-ink leading-[19px]! sm:leading-[29px]!">{p.mobileTitle ?? p.title}</div>
              {(() => {
                // Mobile: drop "Development" from Pulse UI per design.
                const mobileRoles =
                  p.slug === "pulse-ui"
                    ? p.roles.filter((r) => r !== "Development")
                    : p.roles;
                return mobileRoles.length > 0 ? (
                  <div className="flex flex-wrap gap-[4px] sm:w-[240px]">
                    {mobileRoles.map((role, j) => (
                      <TagPill key={`${role}-${j}`} role={role} dimmed={false} />
                    ))}
                  </div>
                ) : null;
              })()}
            </>
          );
          if (p.inactive) {
            return (
              <div
                key={p.slug}
                className={`flex flex-row items-start sm:items-center gap-[4px] sm:-my-[2px] transition-layout ${
                  isDimmed(i) ? "opacity-5" : "opacity-100"
                }`}
              >
                {rowContent}
              </div>
            );
          }
          return (
            <Link
              href={`/work/${p.slug}`}
              key={p.slug}
              onClick={handleRowClick(i)}
              className={`flex flex-row items-start sm:items-center gap-[4px] sm:-my-[2px] transition-layout ${
                isDimmed(i) ? "opacity-5" : "opacity-100"
              }`}
            >
              {rowContent}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-start">
      <div className="flex flex-col text-body text-ink transition-layout">
        {projects.map((p, i) => {
          const rowContent = (
            <>
              <span className="w-[320px] shrink-0">{p.title}</span>
              <span className="w-[320px] shrink-0 flex gap-[4px] items-center">
                {p.roles.map((role, j) => (
                  <TagPill key={`${role}-${j}`} role={role} dimmed={false} />
                ))}
              </span>
            </>
          );
          if (p.inactive) {
            return (
              <div
                key={p.slug}
                className={`flex items-center row-cell transition-layout ${
                  isDimmed(i) ? "opacity-5" : "opacity-100"
                }`}
              >
                {rowContent}
              </div>
            );
          }
          return (
            <Link
              href={`/work/${p.slug}`}
              key={p.slug}
              onMouseEnter={() => setActiveRowIndex(i)}
              onMouseLeave={() => setActiveRowIndex(null)}
              className={`flex items-center row-cell transition-layout ${
                isDimmed(i) ? "opacity-5" : "opacity-100"
              }`}
            >
              {rowContent}
            </Link>
          );
        })}
      </div>
      <div className="relative" style={{ width: 0 }}>
        <HoverMarker visible={activeRowIndex !== null} rowIndex={activeRowIndex} />
        {(() => {
          const readableSlugs = new Set(["clinic-ai-assistant", "voice-agent"]);
          const hasAny = projects.some((p) => readableSlugs.has(p.slug));
          if (!hasAny) return null;
          const visible =
            activeRowIndex !== null &&
            readableSlugs.has(projects[activeRowIndex]?.slug ?? "");
          // The text's `top` tracks the cursor's current row while hovering
          // the list, and stays at the last-known row when off-list — same
          // pattern as HoverMarker. This gives the `top` transition something
          // to interpolate against so the text slides into clinic-AI's row
          // (matching the square marker) instead of just blinking in.
          const renderRow = activeRowIndex ?? readCaseStudyLastRowRef.current;
          readCaseStudyLastRowRef.current = renderRow;
          return (
            <span
              aria-hidden
              className="absolute flex items-center text-ink whitespace-nowrap transition-marker pointer-events-none"
              style={{
                left: 16,
                top: `calc(var(--row-stride) * ${renderRow})`,
                height: "var(--row-stride)",
                opacity: visible ? 1 : 0,
              }}
            >
              Read case study
            </span>
          );
        })()}
      </div>
    </div>
  );
}
