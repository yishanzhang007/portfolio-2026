"use client";

import { useEffect, useState } from "react";

const BAR_HEIGHTS = [
  2, 2, 2, 2, 2, 2, 2, 2, 5, 2, 2, 7, 2, 11, 2, 2, 2, 15,
  45, 33, 29, 33, 23, 27, 15, 19, 17, 4, 11, 3, 2, 7, 3, 11,
  4, 4, 4, 4, 11, 3, 2, 7, 3,
];
const BARS_DOUBLED = [...BAR_HEIGHTS, ...BAR_HEIGHTS];

const BAR_W = 1.5;
const BAR_GAP = 3;
const SLOT = BAR_W + BAR_GAP;
const SCROLL_DIST = BAR_HEIGHTS.length * SLOT;

const FRAME_W = 174;
const FRAME_H = 88;
const WAVE_H = 49;
const WAVE_TOP = (FRAME_H - WAVE_H) / 2;

const CLIP_W = SLOT;
const CLIP_LEFT = (FRAME_W - CLIP_W) / 2;

const GRAY = "#94918B";
const ORANGE = "#c95c19";

function ScrollingTrack({ color }: { color: string }) {
  return (
    <div
      className="flex items-center animate-clinic-scroll"
      style={{
        gap: BAR_GAP,
        height: WAVE_H,
        width: SCROLL_DIST * 2,
      }}
    >
      {BARS_DOUBLED.map((h, i) => (
        <div
          key={i}
          className="rounded-[1px] shrink-0"
          style={{ width: BAR_W, height: h, background: color }}
        />
      ))}
    </div>
  );
}

export function ClinicAiAssistantHero({
  visible = false,
}: {
  visible?: boolean;
}) {
  void visible;
  const [seconds, setSeconds] = useState(23);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="relative" style={{ width: FRAME_W, height: FRAME_H }}>
      <div
        className="absolute overflow-hidden"
        style={{ left: 0, top: WAVE_TOP, width: FRAME_W, height: WAVE_H }}
      >
        <ScrollingTrack color={GRAY} />
      </div>
      <div
        className="absolute overflow-hidden pointer-events-none"
        style={{
          left: CLIP_LEFT,
          top: WAVE_TOP,
          width: CLIP_W,
          height: WAVE_H,
        }}
      >
        <div style={{ marginLeft: -CLIP_LEFT, width: SCROLL_DIST * 2 }}>
          <ScrollingTrack color={ORANGE} />
        </div>
      </div>
      <div
        className="absolute"
        style={{ left: 49, top: 77, width: 68, height: 18 }}
      >
        <div
          className="absolute rounded-full animate-clinic-ping"
          style={{
            left: 4,
            top: 3,
            width: 12,
            height: 12,
            background: ORANGE,
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            left: 7,
            top: 6,
            width: 6,
            height: 6,
            background: ORANGE,
          }}
        />
        <span
          className="absolute font-tag text-[12px] uppercase whitespace-nowrap"
          style={{
            left: 36,
            top: 0,
            transform: "translateX(-50%)",
            lineHeight: 1.5,
            letterSpacing: "-0.12px",
            color: GRAY,
            opacity: 0.9,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {mm}:{ss}
        </span>
      </div>
    </div>
  );
}
