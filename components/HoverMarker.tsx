"use client";

import { useRef } from "react";

interface HoverMarkerProps {
  visible: boolean;
  rowIndex: number | null;
}

export function HoverMarker({ visible, rowIndex }: HoverMarkerProps) {
  const lastRowIndexRef = useRef(0);
  if (rowIndex !== null) {
    lastRowIndexRef.current = rowIndex;
  }
  const displayRowIndex = lastRowIndexRef.current;

  return (
    <div
      aria-hidden
      className="absolute h-[4px] w-[4px] rounded-[1px] bg-ink transition-marker"
      style={{
        left: 0,
        top: `calc(var(--row-stride) * ${displayRowIndex} + var(--row-marker-offset))`,
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.95)",
      }}
    />
  );
}
