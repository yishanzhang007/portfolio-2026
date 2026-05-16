"use client";

import { useReplayKey } from "@/lib/useReplayKey";

function SmileyIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        d="M9 15.75C12.7279 15.75 15.75 12.7279 15.75 9C15.75 5.27208 12.7279 2.25 9 2.25C5.27208 2.25 2.25 5.27208 2.25 9C2.25 12.7279 5.27208 15.75 9 15.75Z"
        stroke="#6744BF"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.46875 8.4375C6.93474 8.4375 7.3125 8.05974 7.3125 7.59375C7.3125 7.12776 6.93474 6.75 6.46875 6.75C6.00276 6.75 5.625 7.12776 5.625 7.59375C5.625 8.05974 6.00276 8.4375 6.46875 8.4375Z"
        fill="#6744BF"
      />
      <path
        d="M11.5312 8.4375C11.9972 8.4375 12.375 8.05974 12.375 7.59375C12.375 7.12776 11.9972 6.75 11.5312 6.75C11.0653 6.75 10.6875 7.12776 10.6875 7.59375C10.6875 8.05974 11.0653 8.4375 11.5312 8.4375Z"
        fill="#6744BF"
      />
      <path
        d="M11.8125 10.6875C11.2289 11.6965 10.2495 12.375 9 12.375C7.75055 12.375 6.77109 11.6965 6.1875 10.6875"
        stroke="#6744BF"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        d="M2.5 6L9 10L15.5 6"
        stroke="#c95c19"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="2.5"
        y="4.5"
        width="13"
        height="10"
        rx="1.5"
        stroke="#c95c19"
        strokeWidth="1.25"
      />
    </svg>
  );
}

export function AgentPlaygroundHero({ visible = false }: { visible?: boolean }) {
  const animKey = useReplayKey(visible);

  const W = 305;
  const H = 100;
  const leftCardX = 0;
  const leftCardW = 34;
  const leftCardCenterY = H / 2;
  const leftLabelX = leftCardW + 8; // 42
  const leftLabelW = 55; // "Greeting" + buffer
  const rightCardW = 34;
  const rightTextW = 86; // "Front desk inbox" natural width
  const rightCardX = W - rightTextW - 8 - rightCardW; // right-aligned: 177
  const rightCardCenterY = H / 2 + 16;

  const CURVE_PADDING = 6;
  const lineStartX = leftLabelX + leftLabelW + CURVE_PADDING; // 103
  const lineStartY = leftCardCenterY;
  const lineEndX = rightCardX - CURVE_PADDING; // 171
  const lineEndY = rightCardCenterY;
  const midX = (lineStartX + lineEndX) / 2;
  const linePath = `M ${lineStartX} ${lineStartY} C ${midX} ${lineStartY}, ${midX} ${lineEndY}, ${lineEndX} ${lineEndY}`;

  return (
    <div className="relative" style={{ width: W, height: H }}>
      <div
        key={`left-card-${animKey}`}
        className="absolute flex items-center justify-center rounded-[8px] animate-agent-card-left"
        style={{
          left: leftCardX,
          top: leftCardCenterY - 17,
          width: leftCardW,
          height: 34,
          background: "rgba(103,68,191,0.06)",
          border: "0.5px solid rgba(103,68,191,0.13)",
        }}
      >
        <SmileyIcon />
      </div>
      <span
        key={`left-label-${animKey}`}
        className="absolute whitespace-nowrap animate-agent-card-left"
        style={{
          left: leftLabelX,
          top: leftCardCenterY - 9,
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: 12,
          lineHeight: "18px",
          color: "#21201d",
        }}
      >
        Greeting
      </span>
      <svg
        key={`line-${animKey}`}
        className="absolute pointer-events-none"
        style={{ left: 0, top: 0, width: W, height: H }}
        viewBox={`0 0 ${W} ${H}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={linePath}
          stroke="#c9c7c2"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          pathLength="1"
          className="animate-agent-line"
        />
      </svg>
      <div
        key={`right-card-${animKey}`}
        className="absolute flex items-center justify-center rounded-[8px] animate-agent-card-right"
        style={{
          left: rightCardX,
          top: rightCardCenterY - 17,
          width: rightCardW,
          height: 34,
          background: "rgba(201,92,25,0.06)",
          border: "0.5px solid rgba(201,92,25,0.13)",
        }}
      >
        <EnvelopeIcon />
      </div>
      <div
        key={`right-text-${animKey}`}
        className="absolute flex flex-col items-start animate-agent-card-right"
        style={{
          left: rightCardX + rightCardW + 8,
          top: rightCardCenterY - 17,
          gap: 0,
        }}
      >
        <span
          className="whitespace-nowrap"
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 12,
            lineHeight: 1.5,
            color: "#21201d",
          }}
        >
          Scheduling
        </span>
        <span
          className="whitespace-nowrap"
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 10,
            lineHeight: 1.5,
            color: "#8e8c88",
          }}
        >
          Front desk inbox
        </span>
      </div>
    </div>
  );
}
