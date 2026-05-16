"use client";

import { useReplayKey } from "@/lib/useReplayKey";

const LINE_PATH =
  "M5 70 L15 60 L25 75 L35 50 L45 65 L55 45 L65 70 L75 35 L85 55 L95 25 L105 50 L115 30 L125 75 L135 40 L145 60 L155 30 L165 65 L175 35 L185 55 L195 20 L205 40 L215 25 L225 65 L235 30 L245 50 L255 35 L265 60";

const FILL_PATH = `${LINE_PATH} L265 90 L5 90 Z`;

const POINTS: [number, number][] = [
  [5, 70], [15, 60], [25, 75], [35, 50], [45, 65], [55, 45],
  [65, 70], [75, 35], [85, 55], [95, 25], [105, 50], [115, 30],
  [125, 75], [135, 40], [145, 60], [155, 30], [165, 65], [175, 35],
  [185, 55], [195, 20], [205, 40], [215, 25], [225, 65], [235, 30],
  [245, 50], [255, 35], [265, 60],
];

const LINE_COLOR = "#5d4ee8";
const LINE_DURATION = 1.4;

export function AnalyticsHero({ visible = false }: { visible?: boolean }) {
  const animKey = useReplayKey(visible);

  return (
    <div className="relative" style={{ width: 270, height: 122 }}>
      <svg
        key={`analytics-${animKey}`}
        width="270"
        height="122"
        viewBox="0 0 270 122"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="analytics-fill"
            x1="0"
            y1="0"
            x2="0"
            y2="90"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={LINE_COLOR} stopOpacity="0.196" />
            <stop offset="100%" stopColor={LINE_COLOR} stopOpacity="0" />
          </linearGradient>
        </defs>
        <line
          x1="0"
          y1="32"
          x2="270"
          y2="32"
          stroke="#dad9d6"
          strokeWidth="0.5"
          strokeDasharray="2 2"
        />
        <line
          x1="0"
          y1="61"
          x2="270"
          y2="61"
          stroke="#dad9d6"
          strokeWidth="0.5"
          strokeDasharray="2 2"
        />
        <line
          x1="0"
          y1="90"
          x2="270"
          y2="90"
          stroke="#dad9d6"
          strokeWidth="0.5"
          strokeDasharray="2 2"
        />
        <path
          d={FILL_PATH}
          fill="url(#analytics-fill)"
          className="animate-analytics-fill"
        />
        <path
          d={LINE_PATH}
          stroke={LINE_COLOR}
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="1"
          strokeDasharray="1"
          className="animate-analytics-line"
        />
        <g fill="#ffffff" stroke={LINE_COLOR} strokeWidth="1">
          {POINTS.map(([x, y], i) => {
            const progress = i / (POINTS.length - 1);
            const delay = LINE_DURATION * (1 - Math.pow(1 - progress, 1 / 3));
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="1.5"
                className="animate-analytics-point"
                style={{ animationDelay: `${delay.toFixed(3)}s` }}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
