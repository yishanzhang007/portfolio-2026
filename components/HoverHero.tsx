"use client";

import { useRef } from "react";
import { hoverHeroes } from "./hover-heroes";

interface HoverHeroProps {
  rowIndex: number | null;
  slug: string | null;
}

export function HoverHero({ rowIndex, slug }: HoverHeroProps) {
  const lastRowIndexRef = useRef(0);
  const lastSlugRef = useRef<string | null>(null);
  if (rowIndex !== null) lastRowIndexRef.current = rowIndex;
  if (slug !== null) lastSlugRef.current = slug;
  const displayRowIndex = lastRowIndexRef.current;
  const displaySlug = lastSlugRef.current;
  const HeroComponent = displaySlug ? hoverHeroes[displaySlug] : null;
  const visible = rowIndex !== null && HeroComponent != null;

  return (
    <div
      aria-hidden
      className="absolute hidden md:block transition-marker pointer-events-none"
      style={{
        right: 0,
        top: `calc(var(--row-stride) * ${displayRowIndex} + var(--row-stride) / 2)`,
        transform: "translateY(-50%)",
        opacity: visible ? 1 : 0,
      }}
    >
      {HeroComponent ? <HeroComponent visible={visible} /> : null}
    </div>
  );
}
