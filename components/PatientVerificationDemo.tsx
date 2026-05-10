"use client";

import type { ReactNode } from "react";

/* Patient verification UI — translated from Figma node 1153:51817.
   Two elements: a patient avatar+name on the left (vertically centered),
   and a Detail panel on the right that's intentionally taller than the
   tile so its bottom is clipped by the parent's overflow-hidden.
   Tokens map: #21201d = fg/primary, #82807c = neutral/10 (muted text in
   this UI's local palette), #e9e8e6 = neutral/4 (divider), #5b5bd6 =
   iris/9 (avatar + check), #f1f0ef = bg/surface-tertiary (Closed badge),
   #f8f8f4 = bg/panel. Container query scales the whole UI to 0.8 when
   the tile is narrower than the natural design (≤506px) — same approach
   as SmsComposerDemo. */

export function PatientVerificationDemo() {
  return (
    <div className="absolute inset-0 overflow-hidden font-sms text-[#21201d]">
      {/* Left (wide ≥ 488px): avatar + verified name, vertically centered.
         Narrow (<488px): top-left at (33, 30), per Figma 1153:52180. */}
      <div className="absolute left-[46px] top-1/2 -translate-y-1/2 @max-[488px]:left-[33px] @max-[488px]:top-[30px] @max-[488px]:translate-y-0 flex items-center gap-[12px]">
        <div className="size-[24px] shrink-0 rounded-full bg-[#5b5bd6] flex items-center justify-center">
          <span className="text-[13px] leading-none font-medium text-[#fdfdfc]">S</span>
        </div>
        <div className="flex items-center gap-[7.5px]">
          <span className="text-[14px] leading-[18px] font-medium whitespace-nowrap">
            Sam Smith
          </span>
          <CheckCircleFillIcon size={17.5} />
        </div>
      </div>

      {/* Detail panel — fixed pixel offset from tile top-left, so the
         panel's top-left corner is always visible. Right + bottom are
         intrinsically wider/taller than the tile and get clipped by the
         parent's overflow-hidden.
         Wide (≥ 488px): (280, 120) — Figma 1153:51817.
         Narrow (<488px): (33, 140) — Figma 1153:52180, left-aligned with
         Sam Smith. */}
      <div
        className="absolute left-[280px] top-[60px] @max-[488px]:left-[33px] @max-[488px]:top-[140px] w-[400px] bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] shadow-[0_4px_28px_0_rgba(0,0,0,0.04)] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="border-b border-[#e9e8e6] flex items-center justify-between h-[60px] shrink-0 px-[16px] py-[12px]">
          <p className="text-[14px] leading-[18px] font-medium">Patient data</p>
          <span className="size-[28px] rounded-[8px] flex items-center justify-center p-[4px]">
            <XIcon size={16} />
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-[16px] py-[16px] w-[400px]">
          {/* Patient info rows */}
          <div className="px-[16px] flex flex-col gap-[8px]">
            <Field label="Source" value="Athena" />
            <Field label="Name" value="Sam Smith" />
            <Field label="DOB" value="08/01/1990" />
            <Field label="Phone" value="415-123-1234" />
            <Field label="Email" value="samsmith@gmail.com" />
            <div className="flex items-start">
              <span className="text-[14px] leading-[20px] text-[#82807c] w-[120px] shrink-0">
                Address
              </span>
              <span className="text-[14px] leading-[24px] font-medium whitespace-nowrap">
                742 Evergreen Terrace
                <br />
                Springfield, IL 62704
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="px-[16px] py-[8px]">
            <div className="h-px bg-[#e9e8e6]" />
          </div>

          {/* Upcoming appointments */}
          <Section
            icon={<CalendarBlankIcon size={18} />}
            label="Upcoming appointments"
          >
            <Appointment
              date="Nov 12, 2025 at 3:30 PM"
              description="Follow up visit with Dr. Alex Brown"
            />
            <Appointment
              date="May 12, 2026 at 1:00 PM"
              description="Follow up visit with Dr. Hernandez"
            />
          </Section>

          {/* Divider */}
          <div className="px-[16px] py-[8px]">
            <div className="h-px bg-[#e9e8e6]" />
          </div>

          {/* Recent conversations */}
          <Section
            icon={<ChatsCircleIcon size={18} />}
            label="Recent conversations"
          >
            <div className="py-[4px] flex flex-col gap-[8px]">
              <div className="flex items-center justify-between">
                <p className="text-[14px] leading-[18px]">
                  Nov 12, 2025 at 3:03PM
                </p>
                <span className="bg-[#f1f0ef] h-[20px] flex items-center justify-center px-[6px] py-[4px] rounded-[4px]">
                  <span className="text-[12px] leading-[16px] font-medium">
                    Closed
                  </span>
                </span>
              </div>
              <p className="text-[14px] leading-[18px] text-[#82807c] truncate">
                Want to refill Lisinopril 10mg at her regular Walgreens on
              </p>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center h-[28px]">
      <span className="text-[14px] leading-[20px] text-[#82807c] w-[120px] shrink-0">
        {label}
      </span>
      <span className="text-[14px] leading-[20px] font-medium whitespace-nowrap">
        {value}
      </span>
    </div>
  );
}

function Section({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="px-[16px] flex flex-col gap-[16px]">
      <div className="flex items-center justify-between h-[28px]">
        <div className="flex items-center gap-[8px]">
          {icon}
          <span className="text-[14px] leading-[18px] font-medium">{label}</span>
        </div>
        <span className="size-[28px] rounded-[8px] flex items-center justify-center p-[4px]">
          <CaretDownIcon size={14} />
        </span>
      </div>
      <div className="flex flex-col gap-[16px]">{children}</div>
    </div>
  );
}

function Appointment({
  date,
  description,
}: {
  date: string;
  description: string;
}) {
  return (
    <div className="py-[4px] flex flex-col gap-[8px]">
      <p className="text-[14px] leading-[18px] whitespace-nowrap">{date}</p>
      <p className="text-[14px] leading-[18px] text-[#82807c] whitespace-nowrap">
        {description}
      </p>
    </div>
  );
}

// ─── Phosphor-style inline icons ────────────────────────────────────────────

interface IconProps {
  size: number;
  className?: string;
}

/** Filled circle with a checkmark — iris/9 (#5b5bd6) with white check. */
function CheckCircleFillIcon({ size, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <circle cx="9" cy="9" r="7.3125" fill="#1576B6" />
      <path
        d="M5.85 9.225L7.875 11.25L12.15 6.75"
        stroke="#fdfdfc"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function XIcon({ size, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <line x1="3.5" y1="3.5" x2="12.5" y2="12.5" />
      <line x1="12.5" y1="3.5" x2="3.5" y2="12.5" />
    </svg>
  );
}

function CalendarBlankIcon({ size, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <rect x="2.8125" y="3.9375" width="12.375" height="11.25" rx="1.5" />
      <line x1="5.625" y1="1.6875" x2="5.625" y2="4.5" />
      <line x1="12.375" y1="1.6875" x2="12.375" y2="4.5" />
      <line x1="2.8125" y1="6.75" x2="15.1875" y2="6.75" />
    </svg>
  );
}

function CaretDownIcon({ size, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <polyline points="2.625,4.8125 7,9.1875 11.375,4.8125" />
    </svg>
  );
}

function ChatsCircleIcon({ size, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <path d="M2.28 9.7C1.7 8.6 1.55 7.4 1.83 6.18C2.1 4.96 2.8 3.88 3.79 3.13C4.78 2.38 6 2 7.21 2.13C8.43 2.27 9.55 2.84 10.4 3.69C11.25 4.54 11.82 5.66 11.96 6.88C12.09 8.09 11.7 9.31 10.95 10.3C10.2 11.29 9.13 11.99 7.91 12.27C6.69 12.55 5.42 12.4 4.32 11.83L2.41 12.4C2.32 12.42 2.22 12.42 2.13 12.4C2.04 12.37 1.95 12.32 1.88 12.25C1.81 12.18 1.76 12.09 1.74 11.99C1.71 11.9 1.71 11.81 1.74 11.71L2.28 9.7Z" />
      <path d="M11.5 5.6C12.41 5.65 13.27 5.93 14 6.39C14.74 6.86 15.36 7.5 15.79 8.27C16.21 9.04 16.45 9.9 16.45 10.78C16.46 11.66 16.25 12.52 15.83 13.3L16.42 15.32C16.45 15.42 16.45 15.52 16.42 15.61C16.4 15.7 16.35 15.79 16.28 15.86C16.2 15.93 16.11 15.98 16.02 16C15.92 16.03 15.83 16.03 15.74 16L13.74 15.42C13.07 15.78 12.34 16 11.6 16.04C10.85 16.09 10.1 15.97 9.4 15.69C8.7 15.42 8.07 15 7.55 14.46C7.03 13.92 6.62 13.27 6.36 12.55" />
    </svg>
  );
}
