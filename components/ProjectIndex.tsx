"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { projects } from "@/lib/projects";
import { TagPill } from "./TagPill";
import { HoverMarker } from "./HoverMarker";
import { HoverHero } from "./HoverHero";
import { hoverHeroes } from "./hover-heroes";

interface ProjectIndexProps {
  variant: "desktop" | "mobile";
}

// Mobile only: per-slug margin offsets on the hero wrapper. Some heroes have
// built-in whitespace around their visible content (e.g., the agent-playground
// hero centers its 34-tall card inside a 100-tall box). Negative values
// tighten the gap; positive values push the neighbor row away.
const HERO_TOP_OFFSET: Record<string, number> = {
  "clinic-ai-assistant": -12,
  "agent-playground": -24,
  analytics: -12,
};
const HERO_BOTTOM_OFFSET: Record<string, number> = {
  "clinic-ai-assistant": 8,
  "voice-agent": 8,
  analytics: -12,
  joy: 16,
};

export function ProjectIndex({ variant }: ProjectIndexProps) {
  const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isDimmed = (i: number) =>
    activeRowIndex !== null && activeRowIndex !== i;

  // Dismiss the active row when the user clicks/taps anywhere outside the
  // project list. Only runs while a row is active (no listener cost when
  // nothing is selected). `click` is preferred over `pointerdown` so that
  // scrolling on mobile doesn't accidentally clear state.
  useEffect(() => {
    if (activeRowIndex === null) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setActiveRowIndex(null);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [activeRowIndex]);

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
      <div
        ref={containerRef}
        className="flex flex-col w-full gap-y-[4px] sm:gap-y-0"
      >
        {projects.map((p, i) => {
          const isActive = activeRowIndex === i;
          const rowInner = (
            <div className="flex flex-row items-start sm:items-center gap-[4px] sm:-my-[2px]">
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
            </div>
          );
          // Tap-to-expand hero — left-aligned at the row's leading edge.
          // CSS grid 0fr→1fr animates the row height smoothly; opacity
          // crossfades the hero so it doesn't pop in flat.
          //
          // Per-slug top offset tightens the gap for heroes whose intrinsic
          // box has padding/whitespace above their first visible pixel.
          // Default top spacing is 8px (the wrapper's pt). A negative offset
          // pulls the hero closer to the title row above.
          const heroTopOffset = HERO_TOP_OFFSET[p.slug] ?? 0;
          const heroBottomOffset = HERO_BOTTOM_OFFSET[p.slug] ?? 0;
          const HeroComponent = hoverHeroes[p.slug];
          const heroSlot = !p.inactive && HeroComponent ? (
            <div
              aria-hidden={!isActive}
              className="grid transition-[grid-template-rows] duration-[250ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] motion-reduce:transition-none"
              style={{ gridTemplateRows: isActive ? "1fr" : "0fr" }}
            >
              <div
                className="overflow-hidden transition-opacity duration-200 motion-reduce:transition-none"
                style={{ opacity: isActive ? 1 : 0 }}
              >
                <div
                  className="pt-[8px]"
                  style={{
                    marginTop: heroTopOffset,
                    // Positive bottom offsets grow `pb` (so the gap lives
                    // INSIDE the overflow-hidden region — also gives slack
                    // for any glyph descender that sits below the line-box,
                    // which is what was clipping "JOY"). Negative offsets
                    // become marginBottom (which can be negative, padding
                    // can't) to pull the next row up.
                    paddingBottom: 4 + Math.max(0, heroBottomOffset),
                    marginBottom: Math.min(0, heroBottomOffset),
                  }}
                >
                  <HeroComponent visible={isActive} />
                </div>
              </div>
            </div>
          ) : null;
          if (p.inactive) {
            return (
              <div
                key={p.slug}
                className={`flex flex-col transition-layout ${
                  isDimmed(i) ? "opacity-5" : "opacity-100"
                }`}
              >
                {rowInner}
              </div>
            );
          }
          return (
            <Link
              href={`/work/${p.slug}`}
              key={p.slug}
              onClick={handleRowClick(i)}
              className={`flex flex-col transition-layout ${
                isDimmed(i) ? "opacity-5" : "opacity-100"
              }`}
            >
              {rowInner}
              {heroSlot}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex items-start">
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
      <div className="relative w-[320px]">
        <HoverMarker visible={activeRowIndex !== null} rowIndex={activeRowIndex} />
        <HoverHero
          rowIndex={activeRowIndex}
          slug={activeRowIndex !== null ? projects[activeRowIndex].slug : null}
        />
      </div>
    </div>
  );
}
