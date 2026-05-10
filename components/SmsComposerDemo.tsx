"use client";

import { useEffect, useRef, useState } from "react";

const FULL_TEXT =
  "I’m following up on your recent lab results. Your HbA1c came back at 8.2%, which is higher than our target range. ";
const PHI_TEXT = "HbA1c came back at 8.2%";
const PHI_START = FULL_TEXT.indexOf(PHI_TEXT);
const PHI_END = PHI_START + PHI_TEXT.length;
/** PHI keyword "HbA1c" finishes typing at this character index — that's the
 *  earliest the LLM could plausibly recognize the lab marker. */
const PHI_DETECT_AT = PHI_START + "HbA1c".length;

const TIMING = {
  IDLE: 800,
  READING: 600,
  /** 30% slower than the typewriter spec's 33ms cadence. */
  TYPE_INTERVAL: 43,
  /** "LLM analysis" pause that begins as soon as `HbA1c` is fully typed.
   *  Banner + highlight + disabled-send all surface together when it elapses,
   *  while the typewriter is still finishing the sentence. */
  DETECTION_PAUSE: 1500,
  COMPLETE: 2500,
};

type Phase = "idle" | "reading" | "typing" | "complete";

export function SmsComposerDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [charIndex, setCharIndex] = useState(0);
  const [phiDetected, setPhiDetected] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [started, setStarted] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Reduced motion → snap to final state
  useEffect(() => {
    if (reducedMotion) {
      setPhase("complete");
      setCharIndex(FULL_TEXT.length);
      setPhiDetected(true);
    }
  }, [reducedMotion]);

  // IntersectionObserver gate — start the cycle when the demo enters the viewport
  useEffect(() => {
    if (started || reducedMotion) return;
    if (!wrapperRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setStarted(true);
            observer.disconnect();
            return;
          }
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [started, reducedMotion]);

  // Phase orchestration: idle → reading → typing → complete → idle (loop)
  useEffect(() => {
    if (reducedMotion || !started) return;

    if (phase === "idle") {
      const t = setTimeout(() => setPhase("reading"), TIMING.IDLE);
      return () => clearTimeout(t);
    }
    if (phase === "reading") {
      const t = setTimeout(() => setPhase("typing"), TIMING.READING);
      return () => clearTimeout(t);
    }
    if (phase === "complete") {
      const t = setTimeout(() => {
        setCharIndex(0);
        setPhiDetected(false);
        setPhase("idle");
      }, TIMING.COMPLETE);
      return () => clearTimeout(t);
    }
  }, [phase, reducedMotion, started]);

  // Typewriter tick during the typing phase
  useEffect(() => {
    if (phase !== "typing" || reducedMotion) return;
    const interval = setInterval(() => {
      setCharIndex((i) => (i >= FULL_TEXT.length ? i : i + 1));
    }, TIMING.TYPE_INTERVAL);
    return () => clearInterval(interval);
  }, [phase, reducedMotion]);

  // PHI detection — fires DETECTION_PAUSE ms after the typewriter would have
  // reached PHI_DETECT_AT (the end of "HbA1c"). Scheduled once when typing
  // begins so it isn't reset on every character tick. Falls mid-typing.
  useEffect(() => {
    if (phase !== "typing" || reducedMotion) return;
    const delay =
      PHI_DETECT_AT * TIMING.TYPE_INTERVAL + TIMING.DETECTION_PAUSE;
    const t = setTimeout(() => setPhiDetected(true), delay);
    return () => clearTimeout(t);
  }, [phase, reducedMotion]);

  // Typing → complete when the typewriter reaches the end
  useEffect(() => {
    if (phase === "typing" && charIndex >= FULL_TEXT.length) {
      setPhase("complete");
    }
  }, [phase, charIndex]);

  const visibleChars = reducedMotion ? FULL_TEXT.length : charIndex;
  const phiActive = phiDetected;
  const showCaret = !reducedMotion && phase !== "complete";

  const prefix = FULL_TEXT.slice(0, Math.min(visibleChars, PHI_START));
  const phi = FULL_TEXT.slice(PHI_START, Math.min(visibleChars, PHI_END));
  const suffix = FULL_TEXT.slice(PHI_END, visibleChars);

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 flex items-center justify-center font-sms text-sms-text"
    >
      <div className="relative w-[506px] h-[136px] @max-[506px]:scale-[0.8]">
        {/* Banner — pinned 44px above the card so the card itself stays
            vertically centered in the gray tile in idle state. z-0 keeps it
            behind the card. Starts 80px below its resting place (deep behind
            the card) at opacity 0, slides UP and fades in when PHI activates. */}
        <div
          aria-hidden={!phiActive}
          className={`absolute left-[12px] right-[12px] -top-[44px] z-0 transition-banner-slide ${
            phiActive
              ? "translate-y-0 opacity-100"
              : "translate-y-[80px] opacity-0 pointer-events-none"
          }`}
        >
          <div className="bg-white border-l-[0.5px] border-r-[0.5px] border-t-[0.5px] border-sms-border rounded-t-[8px] overflow-hidden">
            <div className="bg-warning-bg flex items-center justify-between pl-[16px] pr-[12px] py-[8px]">
              <div className="flex items-center gap-[8px]">
                <WarningIcon size={16} className="text-warning shrink-0" />
                <p className="font-medium text-[14px] leading-[18px] text-warning whitespace-nowrap">
                  Remove PHI to enable SMS
                </p>
              </div>
              <span className="size-[28px] flex items-center justify-center rounded-[8px] p-[4px]">
                <CaretDownIcon size={14} className="-rotate-90 text-warning-caret" />
              </span>
            </div>
          </div>
        </div>

        {/* AI Chat composer card — z-10, sits in front of the banner. Fills
            the inner 136px container so it stays vertically centered in the
            gray tile via the parent's flex-center. */}
        <div className="absolute inset-0 z-10 bg-white border-[0.5px] border-sms-border rounded-[8px] pt-[16px] pl-[16px] pr-[12px] pb-[12px] flex flex-col justify-between overflow-hidden">
          <p className="text-[14px] leading-[22px] min-h-[22px]">
            {prefix}
            {phi.length > 0 && (
              <span className="phi-stroke" data-active={phiActive}>
                {phi}
              </span>
            )}
            {suffix}
            {showCaret && <Caret />}
          </p>

          <div className="flex items-center justify-between">
            {/* SMS dropdown */}
            <span className="h-[28px] flex items-center justify-center px-[8px] py-[2px] gap-[4px] rounded-[6px]">
              <ChatsCircleIcon size={16} className="text-sms-text shrink-0" />
              <span className="text-[14px] leading-[18px]">SMS</span>
              <CaretDownIcon size={12} className="text-sms-text shrink-0" />
            </span>

            {/* Send button — dark/enabled by default, gray-disabled when PHI is detected. */}
            <span
              aria-disabled={phiActive}
              className={`size-[28px] flex items-center justify-center rounded-[6px] p-[6px] transition-sms ${
                phiActive
                  ? "bg-send-disabled text-send-disabled-fg"
                  : "bg-ink text-canvas"
              }`}
            >
              <ArrowUpIcon size={16} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Caret cursor ────────────────────────────────────────────────────────────

function Caret() {
  return (
    <span
      aria-hidden
      className="inline-block w-[1.5px] h-[14px] bg-current align-middle ml-[1px] -translate-y-[1px] animate-caret-blink"
    />
  );
}

// ─── Inline SVG icons ────────────────────────────────────────────────────────

interface IconProps {
  size?: number;
  className?: string;
}

/** Warning triangle — paths from
 *  /public/work/clinic-ai-assistant/.VisitList/Warning.svg.
 *  Stroke + fill set to currentColor so it inherits the banner text color. */
function WarningIcon({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M8.89971 2.51375L14.366 12.0056C14.7491 12.6744 14.2541 13.5 13.4653 13.5H2.53284C1.74409 13.5 1.24909 12.6744 1.63221 12.0056L7.09846 2.51375C7.49221 1.82875 8.50596 1.82875 8.89971 2.51375Z" />
      <path d="M8 9V6.5" />
      <path
        d="M8 11.1504C8.05523 11.1504 8.09961 11.1948 8.09961 11.25C8.09961 11.3052 8.05523 11.3496 8 11.3496C7.94477 11.3496 7.90039 11.3052 7.90039 11.25C7.90039 11.1948 7.94477 11.1504 8 11.1504Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CaretDownIcon({ size = 12, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M3.4 5.6 L4.4 4.6 L8 8.2 L11.6 4.6 L12.6 5.6 L8 10.2 Z" />
    </svg>
  );
}

/** Two-bubble "chats-circle" icon — paths come straight from
 *  /public/work/clinic-ai-assistant/Left icon.svg. Stroke set to currentColor
 *  so the icon picks up its container's text color. */
function ChatsCircleIcon({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M2.03262 8.62511C1.52328 7.67356 1.3729 6.57064 1.60891 5.51747C1.84492 4.46429 2.45158 3.53102 3.31829 2.88783C4.185 2.24464 5.254 1.93438 6.33038 2.01361C7.40676 2.09285 8.41881 2.55631 9.18199 3.31949C9.94516 4.08267 10.4086 5.09472 10.4879 6.1711C10.5671 7.24748 10.2568 8.31648 9.61365 9.18319C8.97046 10.0499 8.03718 10.6566 6.98401 10.8926C5.93084 11.1286 4.82792 10.9782 3.87637 10.4689L2.14137 10.9789C2.05522 11.0042 1.96384 11.0058 1.87684 10.9836C1.78984 10.9614 1.71042 10.9162 1.64693 10.8527C1.58344 10.7892 1.53822 10.7098 1.51602 10.6228C1.49381 10.5358 1.49545 10.4444 1.52075 10.3582L2.03262 8.62511Z" />
      <path d="M10.2464 5.00684C11.0024 5.04793 11.7357 5.27909 12.3786 5.6789C13.0215 6.07872 13.5531 6.63426 13.9243 7.29411C14.2954 7.95396 14.4941 8.69679 14.5019 9.45381C14.5097 10.2108 14.3264 10.9576 13.9689 11.625L14.4789 13.36C14.5042 13.4461 14.5058 13.5375 14.4836 13.6245C14.4614 13.7115 14.4162 13.7909 14.3527 13.8544C14.2892 13.9179 14.2098 13.9631 14.1228 13.9853C14.0358 14.0075 13.9444 14.0059 13.8583 13.9806L12.1252 13.4687C11.5526 13.7749 10.9207 13.9536 10.2726 13.9927C9.62458 14.0318 8.97573 13.9303 8.37057 13.6952C7.76541 13.46 7.21825 13.0968 6.7666 12.6304C6.31495 12.164 5.96949 11.6055 5.75391 10.9931" />
    </svg>
  );
}

function ArrowUpIcon({ size = 18, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <line x1="9" y1="3" x2="9" y2="15" />
      <polyline points="4,8 9,3 14,8" />
    </svg>
  );
}
