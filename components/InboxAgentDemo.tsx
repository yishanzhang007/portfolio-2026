"use client";

import { useEffect, useRef, useState } from "react";

/* Inbox-Agent demo — animated 4-state UI for the Clinic AI Assistant case study.
   Translated from Figma node 1206:18275 (Section 4 of the 2026-case-study file).
   The demo loops a mini-story:
     1. State 1: front-desk inbox idle, Jessica Davis active.
     2. State 2: cursor moves to Sam Smith row, clicks. Canvas swaps to Sam's
        cancellation request thread; an "Appointment cancellation request" card
        appears in the canvas with a dark Cancel button.
     3. State 3: cursor moves to the Cancel button, clicks. Button shows spinner.
     4. State 4: cancellation card collapses to "Appointment canceled"; a new
        clinic message confirms the cancellation in the thread.
   The right-panel transcript types out per-character during state 2 dwell using
   the `typewriter` spec from the animate-text skill (240ms enter, 46ms stagger,
   steps(1,end) easing).
   Native design size is 1207×928. The component renders at that fixed pixel
   size and the parent CaseStudyImage container query scales it down to fit. */

type Phase =
  | "state1"
  | "sam-arriving"
  | "sam-unread"
  | "to-sam"
  | "state2"
  | "to-cancel"
  | "loading"
  | "state4-canceled" /** card collapsed, message NOT yet sent */
  | "state4-sent"; /** confirmation message appears + Sam avatar greys out */

/* Timings halved overall (50% faster) per design pass. */
const TIMING = {
  STATE1_DWELL: 750,
  SAM_ARRIVAL: 350,
  SAM_UNREAD_DWELL: 600,
  CURSOR_TRAVEL_TO_SAM: 400,
  CLICK_PULSE: 100,
  STATE2_DWELL: 1500,
  CURSOR_TRAVEL_TO_CANCEL: 450,
  LOADING: 650,
  /** After cancellation succeeds, hold on the empty card briefly before the
   *  follow-up SMS appears in the thread. */
  STATE4_CANCELED_DWELL: 700,
  STATE4_SENT_DWELL: 1500,
};

/* Cursor target positions in design pixels (origin = top-left of the 1207×928
   inner stage; includes the browser chrome). The new Cursor.svg has its
   pointing tip at ~(10, 5) within the 24×24 viewBox, so subtract that offset
   from each target so the visible tip lands on the click target. */
const CURSOR_OFF = { x: 1170, y: 875 };
/* Sam's inbox row center ≈ (148, 194). Tip-adjusted cursor pos = (138, 189). */
const CURSOR_SAM = { x: 138, y: 189 };
/* Cancel-button center (732, 735) measured live → cursor pos (722, 730). */
const CURSOR_CANCEL = { x: 722, y: 730 };

export function InboxAgentDemo() {
  const [phase, setPhase] = useState<Phase>("state1");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [started, setStarted] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) setPhase("state4-sent");
  }, [reducedMotion]);

  useEffect(() => {
    if (started || reducedMotion || !wrapperRef.current) return;
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
      { threshold: 0.3 },
    );
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [started, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !started) return;
    const next: Record<Phase, [Phase, number]> = {
      state1: ["sam-arriving", TIMING.STATE1_DWELL],
      "sam-arriving": ["sam-unread", TIMING.SAM_ARRIVAL],
      "sam-unread": ["to-sam", TIMING.SAM_UNREAD_DWELL],
      "to-sam": [
        "state2",
        TIMING.CURSOR_TRAVEL_TO_SAM + TIMING.CLICK_PULSE,
      ],
      state2: ["to-cancel", TIMING.STATE2_DWELL],
      "to-cancel": [
        "loading",
        TIMING.CURSOR_TRAVEL_TO_CANCEL + TIMING.CLICK_PULSE,
      ],
      loading: ["state4-canceled", TIMING.LOADING],
      "state4-canceled": ["state4-sent", TIMING.STATE4_CANCELED_DWELL],
      "state4-sent": ["state1", TIMING.STATE4_SENT_DWELL],
    };
    const [nextPhase, delay] = next[phase];
    const t = setTimeout(() => setPhase(nextPhase), delay);
    return () => clearTimeout(t);
  }, [phase, reducedMotion, started]);

  // Sam is in the inbox from sam-arriving onward (slide-in plays during that
  // phase via grid-template-rows interpolation).
  const showsSam = phase !== "state1";
  // Sam is the active conversation only after the cursor click (state2+).
  const samSelected =
    phase === "state2" ||
    phase === "to-cancel" ||
    phase === "loading" ||
    phase === "state4-canceled" ||
    phase === "state4-sent";
  // Blue unread dot shows while Sam is in the inbox but not yet selected.
  const samUnread = showsSam && !samSelected;
  // Sam's row avatar greys out (reply-arrow style) once the confirmation SMS
  // has been sent — same treatment as Jessica's "already replied" row.
  const samResolved = phase === "state4-sent";
  const showsCancellationCard = samSelected;
  // Confirmation message in the canvas thread appears only AFTER the brief
  // post-cancel pause (state4-sent), not on the moment cancellation lands.
  const showsConfirmedMessage = phase === "state4-sent";
  const cancelButtonState =
    phase === "loading"
      ? "loading"
      : phase === "state4-canceled" || phase === "state4-sent"
        ? "done"
        : "default";

  // Cursor itinerary: off → Sam → off → Cancel → off.
  const cursorPos =
    phase === "to-sam"
      ? CURSOR_SAM
      : phase === "to-cancel" || phase === "loading"
        ? CURSOR_CANCEL
        : CURSOR_OFF;
  const cursorClicking =
    (phase === "to-sam" || phase === "to-cancel") && started;

  return (
    <div
      ref={wrapperRef}
      className="relative w-full max-w-[1207px] h-[888px] md:h-[928px] overflow-hidden bg-[#f3f3f1] rounded-[14px] border-[0.5px] border-[rgba(76,76,59,0.2)]"
      data-phase={phase}
    >
      <BrowserChrome />
      <div
        className="absolute left-[4px] right-[4px] top-[36px] bottom-[4px] rounded-[12px] border-[0.5px] border-[rgba(76,76,59,0.2)] bg-white overflow-hidden flex"
      >
        <InboxList
          samArrived={showsSam}
          samSelected={samSelected}
          samUnread={samUnread}
          samResolved={samResolved}
        />
        <Canvas
          patient={samSelected ? "sam" : "jessica"}
          showCancellationCard={showsCancellationCard}
          cancelButtonState={cancelButtonState}
          showConfirmedMessage={showsConfirmedMessage}
        />
        <RightPanel patient={samSelected ? "sam" : "jessica"} />
      </div>
      <Cursor x={cursorPos.x} y={cursorPos.y} clicking={cursorClicking} />
    </div>
  );
}

/* ─── Browser chrome (top bar with traffic lights + URL) ──────────────────── */
function BrowserChrome() {
  return (
    <div className="absolute left-0 right-0 top-0 h-[36px] flex items-center px-[12px] gap-[8px] bg-[#f3f3f1] rounded-t-[14px]">
      <span className="size-[12px] rounded-full bg-[#ed6a5e]" />
      <span className="size-[12px] rounded-full bg-[#f5bf4f]" />
      <span className="size-[12px] rounded-full bg-[#62c554]" />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-[626px] border-[0.5px] border-[rgba(76,76,59,0.15)] rounded-[6px] h-[24px] px-[12px] flex items-center justify-center text-[12px] text-[#A1A09D] font-sms">
          frontdesk.getfreed.ai/inbox
        </div>
      </div>
      <span className="w-[60px]" />
    </div>
  );
}

/* ─── Inbox list (left column, 280px) ────────────────────────────────────── */

interface InboxRowData {
  name: string;
  subject: string;
  time: string;
  avatar: { kind: "letter"; letter: string; bg: string } | { kind: "reply" };
}

const ROWS_JESSICA: InboxRowData[] = [
  {
    name: "Jessica Davis",
    subject: "Medication refill",
    time: "5min",
    avatar: { kind: "reply" },
  },
  {
    name: "Karen Taylor",
    subject: "Reschedule appointment",
    time: "10min",
    avatar: { kind: "reply" },
  },
  {
    name: "Karen Taylor",
    subject: "Physiotherapy session",
    time: "15min",
    avatar: { kind: "reply" },
  },
  {
    name: "Clara White",
    subject: "Nutrition consultation",
    time: "1h",
    avatar: { kind: "letter", letter: "C", bg: "#338ccd" },
  },
  {
    name: "Michael Smith",
    subject: "New patient appointment",
    time: "22min",
    avatar: { kind: "letter", letter: "M", bg: "#53b9ab" },
  },
  {
    name: "Liam Rodriguez",
    subject: "Quick advice call",
    time: "20min",
    avatar: { kind: "reply" },
  },
  {
    name: "Tommy Vance",
    subject: "Medication review",
    time: "1min",
    avatar: { kind: "reply" },
  },
  {
    name: "Sophie Daniels",
    subject: "Billing questions",
    time: "1h",
    avatar: { kind: "reply" },
  },
  {
    name: "George Hall",
    subject: "Mental health evaluation",
    time: "1h",
    avatar: { kind: "letter", letter: "G", bg: "#6743d2" },
  },
  {
    name: "Clara White",
    subject: "Nutrition consultation",
    time: "1h",
    avatar: { kind: "reply" },
  },
  {
    name: "Tommy Vance",
    subject: "Medication review",
    time: "1min",
    avatar: { kind: "reply" },
  },
];

const SAM_ROW: InboxRowData = {
  name: "Sam Smith",
  subject: "Cancel an existing patient",
  time: "2 min",
  avatar: { kind: "letter", letter: "S", bg: "#8e4ec6" },
};

/* When the cancellation has been resolved (confirmation SMS sent), Sam's row
   greys out — same treatment as the other "already replied" rows. */
const SAM_ROW_RESOLVED: InboxRowData = {
  ...SAM_ROW,
  avatar: { kind: "reply" },
};

function InboxList({
  samArrived,
  samSelected,
  samUnread,
  samResolved,
}: {
  samArrived: boolean;
  samSelected: boolean;
  samUnread: boolean;
  samResolved: boolean;
}) {
  /* The base list is always rendered (Jessica + 11 others). Sam's row sits in
     a grid-template-rows wrapper above; when `samArrived` flips to true, that
     wrapper interpolates from 0fr → 1fr (modern browsers), pushing the rest
     of the list down — Sam appears as a brand-new conversation arriving. He
     starts unread (blue dot, not active) and only becomes selected (grey
     background, dot gone) after the cursor clicks his row. */
  const baseRows = ROWS_JESSICA.slice(0, 12);
  return (
    <div className="h-full w-0 min-[1072px]:w-[280px] shrink-0 overflow-hidden transition-[width] duration-300 ease-out motion-reduce:transition-none">
    <div className="flex flex-col h-full w-[280px] shrink-0 font-sms">
      {/* Header: Front desk inbox */}
      <div className="flex items-center justify-between h-[52px] pl-[16px] pr-[12px] py-[12px] border-b-[0.5px] border-[rgba(76,76,59,0.2)]">
        <div className="flex items-center gap-[8px]">
          <p className="text-[14px] leading-[18px] font-medium text-[#21201d]">
            Front desk inbox
          </p>
          <CaretDownIcon size={12} className="text-[#A1A09D]" />
        </div>
        <span className="size-[36px] flex items-center justify-center rounded-[8px] p-[8px]">
          <SlidersHorizontalIcon size={18} className="text-[#A1A09D]" />
        </span>
      </div>
      {/* "13 Open" filter row — count bumps with Sam's arrival */}
      <div className="flex items-center justify-between h-[60px] pl-[8px] pr-[12px] py-[12px]">
        <div className="flex items-center gap-[4px] p-[8px]">
          <p className="text-[14px] leading-[18px] font-medium text-[#21201d]">
            {samArrived ? "13 Open" : "12 Open"}
          </p>
          <CaretDownIcon size={12} className="text-[#A1A09D]" />
        </div>
        <span className="size-[36px] flex items-center justify-center rounded-[8px] p-[8px]">
          <ArrowDownIcon size={16} className="text-[#A1A09D]" />
        </span>
      </div>
      {/* List */}
      <div className="flex-1 flex flex-col px-[8px] overflow-hidden">
        {/* Sam's slot — collapsed (0fr) by default; expands to 1fr when he
            arrives. The inner row also fades + slides down ~12px so the entry
            reads like a new item dropping in. */}
        <div
          aria-hidden={!samArrived}
          className="grid"
          style={{
            gridTemplateRows: samArrived ? "1fr" : "0fr",
            transition:
              "grid-template-rows 300ms cubic-bezier(0.215, 0.61, 0.355, 1)",
          }}
        >
          <div className="overflow-hidden">
            <div
              className="pb-[4px]"
              style={{
                opacity: samArrived ? 1 : 0,
                transform: samArrived
                  ? "translateY(0)"
                  : "translateY(-12px)",
                transition:
                  "opacity 175ms ease-out 60ms, transform 250ms cubic-bezier(0.215, 0.61, 0.355, 1)",
              }}
            >
              <InboxRow
                row={samResolved ? SAM_ROW_RESOLVED : SAM_ROW}
                active={samSelected && !samResolved}
                unread={samUnread}
              />
            </div>
          </div>
        </div>
        {/* Existing conversations — Jessica stays active until the cursor
            clicks Sam (samSelected flips true). */}
        <div className="flex flex-col gap-[4px]">
          {baseRows.map((row, i) => (
            <InboxRow
              key={`${row.name}-${i}`}
              row={row}
              active={!samSelected && i === 0}
            />
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}

function InboxRow({
  row,
  active,
  unread = false,
}: {
  row: InboxRowData;
  active: boolean;
  unread?: boolean;
}) {
  return (
    <div
      data-row-name={row.name}
      className={`flex gap-[12px] items-start px-[8px] py-[12px] rounded-[12px] ${
        active ? "bg-[#f9f9f8]" : ""
      }`}
    >
      {row.avatar.kind === "letter" ? (
        <div
          className="size-[20px] shrink-0 rounded-full flex items-center justify-center"
          style={{ backgroundColor: row.avatar.bg }}
        >
          <span className="text-[12px] leading-[16px] font-semibold text-[#fdfdfc]">
            {row.avatar.letter}
          </span>
        </div>
      ) : (
        <div className="size-[20px] shrink-0 rounded-full bg-[#f0f0ee] flex items-center justify-center">
          <ArrowBendUpLeftIcon size={14} className="text-[#A1A09D]" />
        </div>
      )}
      <div className="flex-1 min-w-0 flex flex-col gap-[4px]">
        <div className="flex items-center justify-between gap-[8px]">
          <div className="flex items-center gap-[6px] min-w-0">
            <p
              className={`text-[14px] leading-[18px] font-medium truncate ${
                unread ? "text-[#21201d]" : "text-[#A1A09D]"
              }`}
            >
              {row.name}
            </p>
            {unread && (
              <span
                aria-label="Unread"
                className="size-[8px] shrink-0 rounded-full bg-[#3578e8]"
              />
            )}
          </div>
          <p className="text-[12px] leading-[16px] text-[#A1A09D] shrink-0">
            {row.time}
          </p>
        </div>
        <p
          className={`text-[14px] leading-[18px] truncate ${
            unread ? "text-[#21201d]" : "text-[#A1A09D]"
          }`}
        >
          {row.subject}
        </p>
      </div>
    </div>
  );
}

/* ─── Canvas (middle column) ─────────────────────────────────────────────── */

interface CanvasProps {
  patient: "jessica" | "sam";
  showCancellationCard: boolean;
  cancelButtonState: "default" | "loading" | "done";
  showConfirmedMessage: boolean;
}

function Canvas({
  patient,
  showCancellationCard,
  cancelButtonState,
  showConfirmedMessage,
}: CanvasProps) {
  const isSam = patient === "sam";
  return (
    <div className="flex-1 min-w-0 h-full flex flex-col border-l-0 min-[1072px]:border-l-[0.5px] border-r-0 min-[680px]:border-r-[0.5px] border-[rgba(76,76,59,0.2)] overflow-hidden font-sms">
      {/* Canvas header: avatar + name + Resolve button */}
      <div className="flex items-center gap-[12px] h-[52px] px-[16px] py-[12px] border-b-[0.5px] border-[rgba(76,76,59,0.2)]">
        <div className="flex items-center gap-[8px] flex-1 min-w-0">
          <span className="size-[28px] flex items-center justify-center rounded-[8px] p-[3px]">
            <PanelLeftIcon size={18} className="text-[#A1A09D]" />
          </span>
          <p className="text-[14px] leading-[18px] font-medium text-[#21201d] truncate">
            {isSam ? "Sam Smith" : "Jessica Davis"}
          </p>
        </div>
        <span className="size-[36px] flex items-center justify-center rounded-[8px] p-[8px]">
          <MoreIcon size={18} className="text-[#A1A09D]" />
        </span>
        <div className="h-[32px] min-w-[68px] -ml-[8px] flex items-center justify-center pl-[14px] pr-[10px] bg-white border-[0.5px] border-[rgba(76,76,59,0.2)] rounded-[8px]">
          <span className="text-[14px] leading-[18px] font-medium text-[#21201d]">
            Resolve
          </span>
        </div>
      </div>

      {/* Message thread */}
      <div className="flex-1 overflow-hidden flex flex-col gap-[16px] py-[16px]">
        {/* First patient message — request summary */}
        <div className="px-[16px] flex gap-[8px] items-start justify-end">
          <div
            className="size-[20px] shrink-0 rounded-full flex items-center justify-center"
            style={{ backgroundColor: isSam ? "#8e4ec6" : "#5b5bd6" }}
          >
            <span className="text-[12px] leading-[16px] font-semibold text-[#fdfdfc]">
              {isSam ? "S" : "J"}
            </span>
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-[8px]">
            <div className="bg-[#f9f9f8] rounded-[12px] p-[12px] flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[4px]">
                <p className="flex gap-[4px] text-[14px] leading-[20px] font-medium text-[#21201d]">
                  <span>
                    {isSam
                      ? "Cancel an existing patient"
                      : "Refill for blood pressure medication"}
                  </span>
                  <span>(24:12s)</span>
                </p>
                <p className="text-[14px] leading-[20px] text-[#21201d]">
                  {isSam ? "510-443-7333" : "417-262-1738"}
                </p>
              </div>
              <div className="h-px bg-[rgba(76,76,59,0.15)]" />
              <p className="text-[14px] leading-[20px] text-[#21201d]">
                {isSam
                  ? "Sam Smith wants to cancel his upcoming appointment with Dr. Brown tomorrow at 4 PM."
                  : "Jessica Davis requested a refill for Lisinopril 10mg taken once daily. The AI confirmed the request was sent to her provider for processing within 24-48 hours."}
              </p>
            </div>
            <p className="text-[12px] leading-[16px] text-[#A1A09D] text-left">
              {isSam ? "2 min" : "24 min"}
            </p>
          </div>
          <span className="size-[24px] opacity-0 shrink-0" />
        </div>

        {/* Second message — clinic acknowledgment (lavender). Single avatar
            on the RIGHT. Hidden 24px spacer on the left mirrors the grey
            bubble's avatar gutter, so both bubbles render the same width. */}
        <div className="px-[16px] flex gap-[8px] items-start justify-end">
          <span className="size-[20px] opacity-0 shrink-0" aria-hidden />
          <div className="flex-1 min-w-0 flex flex-col gap-[8px] items-end">
            <div className="bg-[#f6f5ff] rounded-[12px] p-[12px] w-full">
              <p className="text-[14px] leading-[20px] text-[#21201d]">
                Spring Clinic: We&apos;ve received your request and our team
                will follow up within 1-2 business days.
              </p>
            </div>
            <p className="text-[12px] leading-[16px] text-[#A1A09D] text-right">
              {isSam ? "1 min" : "12 min"}
            </p>
          </div>
          <ClinicAvatar />
        </div>

        {/* Third message — Jessica's pharmacy update (only in state 1) */}
        {!isSam && (
          <div className="px-[16px] flex gap-[8px] items-start justify-end">
            <span className="size-[20px] opacity-0 shrink-0" aria-hidden />
            <div className="flex-1 min-w-0 flex flex-col gap-[8px] items-end">
              <div className="bg-[#f6f5ff] rounded-[12px] p-[12px] w-fit max-w-full">
                <p className="text-[14px] leading-[20px] text-[#21201d]">
                  Hi Jessica, we have sent your refill request to your pharmacy
                </p>
              </div>
              <p className="text-[12px] leading-[16px] text-[#A1A09D] text-right">
                12 min
              </p>
            </div>
            <ClinicAvatar />
          </div>
        )}

        {/* Fourth message — clinic confirms cancellation (only in state4-sent,
            after the post-cancel pause). Timestamp reads "just now" because
            the SMS literally just went out. */}
        {showConfirmedMessage && (
          <div className="px-[16px] flex gap-[8px] items-start justify-end animate-clinic-message-send-in">
            <span className="size-[20px] opacity-0 shrink-0" aria-hidden />
            <div className="flex-1 min-w-0 flex flex-col gap-[8px] items-end">
              <div className="bg-[#f6f5ff] rounded-[12px] p-[12px] w-full">
                <p className="text-[14px] leading-[20px] text-[#21201d]">
                  Hi Sam — your appointment with Dr. Alex Brown tomorrow at
                  4 PM is cancelled. Want to reschedule? Reply with a date/time
                  that works.
                </p>
              </div>
              <p className="text-[12px] leading-[16px] text-[#A1A09D] text-right">
                Just now
              </p>
            </div>
            <ClinicAvatar />
          </div>
        )}
      </div>

      {/* Appointment cancellation card (only when Sam is selected). Sits 24px
          narrower than the composer (12px more padding per side, so the card
          stays horizontally centered with the composer below it). No bottom
          border / radius — the composer's top edge meets the card directly. */}
      {showCancellationCard && (
        <div className="px-[28px]">
          <CancellationCard state={cancelButtonState} />
        </div>
      )}

      {/* Reply composer */}
      <div className="px-[16px] pb-[16px]">
        <div className="bg-white border-[0.5px] border-[rgba(76,76,59,0.2)] rounded-[12px] h-[120px] flex flex-col justify-between p-[12px] shadow-[0_4px_14px_0_rgba(0,0,0,0.03)]">
          <p className="text-[14px] leading-[18px] text-[#b2b2b2]">
            Reply to {isSam ? "Sam" : "Jessica"}…
          </p>
          <div className="flex items-center justify-between">
            <span className="h-[28px] -ml-[4px] flex items-center justify-center px-[8px] py-[2px] gap-[4px] rounded-[8px]">
              <ChatsCircleIcon size={14} className="text-[#21201d]" />
              <span className="text-[14px] leading-[18px] text-[#21201d]">
                SMS
              </span>
              <CaretDownIcon size={12} className="text-[#A1A09D]" />
            </span>
            <span className="size-[28px] flex items-center justify-center bg-[#f1f0ef] text-[#bcbbb7] rounded-[8px] p-[6px]">
              <ArrowUpIcon size={14} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CancellationCard({
  state,
}: {
  state: "default" | "loading" | "done";
}) {
  const collapsed = state === "done";
  return (
    <div
      className="border-x-[0.5px] border-t-[0.5px] border-[rgba(76,76,59,0.2)] rounded-t-[12px] overflow-hidden"
      data-cancellation-card
    >
      <div className="bg-[#f9f9f8] flex items-center justify-between h-[44px] px-[12px]">
        <div className="flex items-center gap-[8px] min-w-0">
          {collapsed && (
            <CheckCircleIcon size={16} className="text-[#2a6b2c] shrink-0" />
          )}
          <p className="text-[14px] leading-[18px] text-[#21201d] truncate">
            {collapsed
              ? "Appointment canceled"
              : "Appointment cancellation request"}
          </p>
        </div>
        {/* Once collapsed (done state), rotate the chevron from pointing
            down → pointing right, signalling the card is now an inert summary
            row rather than something to expand. */}
        <CaretDownIcon
          size={12}
          className={`text-[#A1A09D] shrink-0 transition-transform duration-200 ease-out ${
            collapsed ? "-rotate-90" : ""
          }`}
        />
      </div>
      {/* Body collapses with grid-template-rows 1fr → 0fr (modern browsers
          interpolate this property). Per `web-animation-design`: on-screen
          morph → ease-in-out cubic-bezier; only transform / opacity / grid
          row size are touched, so it stays GPU-friendly. Reduced-motion is
          honored via the global `prefers-reduced-motion` guard on the demo
          stage. */}
      <div
        className="grid"
        style={{
          gridTemplateRows: collapsed ? "0fr" : "1fr",
          transition:
            "grid-template-rows 280ms cubic-bezier(0.645, 0.045, 0.355, 1)",
        }}
        aria-hidden={collapsed}
      >
        <div className="overflow-hidden">
          <div
            className="bg-white flex items-center justify-between p-[12px]"
            style={{
              opacity: collapsed ? 0 : 1,
              transform: collapsed ? "translateY(-4px)" : "translateY(0)",
              transition:
                "opacity 200ms ease-out, transform 280ms cubic-bezier(0.645, 0.045, 0.355, 1)",
            }}
          >
            <div className="flex flex-col gap-[2px]">
              <p className="text-[14px] leading-[18px] text-[#21201d]">
                Feb 12, 2026 3:30 PM
              </p>
              <p className="text-[14px] leading-[18px] text-[#A1A09D]">
                Follow up visit with Dr. Alex Brown
              </p>
            </div>
            <button
              type="button"
              data-cancel-button
              className="h-[32px] min-w-[68px] flex items-center justify-center px-[12px] rounded-[8px] bg-[#32302c]"
            >
              {state === "loading" ? (
                <Spinner size={16} />
              ) : (
                <span className="text-[14px] leading-[18px] font-medium text-white">
                  Cancel
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Small clinic-side avatar shown to the RIGHT of clinic message bubbles.
   Uses the Freed clinic logo SVG from /public. */
function ClinicAvatar() {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/work/clinic-ai-assistant/Logo.svg"
      alt=""
      width={24}
      height={24}
      className="size-[24px] shrink-0 rounded-full"
    />
  );
}

/* ─── Right panel (transcript) ───────────────────────────────────────────── */

type TranscriptLine = { speaker: "ai" | "patient"; text: string };

const TRANSCRIPT_SAM: TranscriptLine[] = [
  {
    speaker: "ai",
    text: "Thank you for calling Spring Clinic. I'm Freed, an automated assistant. How can I help you today?",
  },
  {
    speaker: "patient",
    text: "Hi, um… I have an appointment tomorrow with Dr. Brown… at like… 10? And I need to… um… cancel it. Something came up.",
  },
  { speaker: "ai", text: "I can help with that." },
  {
    speaker: "ai",
    text: "Let me check — are you calling for yourself or someone else?",
  },
  { speaker: "patient", text: "For myself" },
  { speaker: "ai", text: "Great. What's your full name and date of birth?" },
  { speaker: "patient", text: "Sam Smith, Jan 2, 1981" },
  {
    speaker: "ai",
    text: "Thank you Sam. What's the date and time for the current appointment?",
  },
  { speaker: "patient", text: "Umm let me check… It's tomorrow at 10am." },
  {
    speaker: "ai",
    text: "And what days/times work best for your new appointment?",
  },
  {
    speaker: "patient",
    text: "Thursdays and Fridays after 2PM work the best for me, but if that doesn't work, I can also do Tuesdays and Wednesdays.",
  },
  {
    speaker: "ai",
    text: "Perfect — Sam, I have you down to reschedule your appointment with Dr. Hernandez to Thursdays after 2PM.",
  },
];

/* Jessica's call: a routine medication-refill request. Original demo dialogue
   illustrating the AI receptionist gathering verification info, the medication
   details, and confirming the pharmacy + processing window. */
const TRANSCRIPT_JESSICA: TranscriptLine[] = [
  {
    speaker: "ai",
    text: "Thank you for calling Spring Clinic. I'm Freed, an automated assistant. How can I help you today?",
  },
  {
    speaker: "patient",
    text: "Hi, this is Jessica. I'd like to refill my blood pressure medication.",
  },
  {
    speaker: "ai",
    text: "Happy to help. Can you confirm your full name and date of birth?",
  },
  { speaker: "patient", text: "Jessica Davis, March 14, 1979." },
  {
    speaker: "ai",
    text: "Thanks, Jessica. Which medication are we refilling today?",
  },
  { speaker: "patient", text: "Lisinopril, 10 milligrams." },
  { speaker: "ai", text: "And how often are you taking it?" },
  { speaker: "patient", text: "Once a day, in the morning." },
  {
    speaker: "ai",
    text: "Got it. Are you still picking up at the Walgreens on Main Street?",
  },
  { speaker: "patient", text: "Yes, same pharmacy." },
  {
    speaker: "ai",
    text: "Perfect. I'll send the request to your provider now — most refills are processed within 24 to 48 hours.",
  },
  {
    speaker: "ai",
    text: "You'll get a text from us as soon as it's ready at the pharmacy.",
  },
];

function RightPanel({ patient }: { patient: "jessica" | "sam" }) {
  const transcript =
    patient === "sam" ? TRANSCRIPT_SAM : TRANSCRIPT_JESSICA;
  const bars = patient === "sam" ? WAVEFORM_SAM : WAVEFORM_JESSICA;
  const duration = patient === "sam" ? DURATION_SAM : DURATION_JESSICA;
  return (
    <div className="h-full w-0 min-[680px]:w-[360px] shrink-0 overflow-hidden transition-[width] duration-300 ease-out motion-reduce:transition-none">
    <div className="flex flex-col h-full w-[360px] shrink-0 font-sms">
      {/* Header */}
      <div className="flex items-center justify-between h-[52px] px-[16px] py-[12px] border-b-[0.5px] border-[rgba(76,76,59,0.2)]">
        <p className="text-[14px] leading-[18px] font-medium text-[#21201d]">
          Detail
        </p>
        <span className="size-[28px] flex items-center justify-center rounded-[8px] p-[4px]">
          <XIcon size={16} className="text-[#A1A09D]" />
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden flex flex-col gap-[16px] px-[16px] py-[16px]">
        {/* Segmented toggle */}
        <div className="bg-[#f9f9f8] rounded-[10px] p-px flex">
          <button className="flex-1 h-[32px] flex items-center justify-center rounded-[8px] bg-white border-[0.5px] border-[rgba(76,76,59,0.2)] text-[14px] leading-[18px] font-medium text-[#21201d]">
            Transcript
          </button>
          <span className="flex-1 h-[32px] flex items-center justify-center text-[14px] leading-[18px] font-medium text-[#A1A09D]">
            Patient
          </span>
          <span className="flex-1 h-[32px] flex items-center justify-center text-[14px] leading-[18px] font-medium text-[#A1A09D]">
            History
          </span>
        </div>

        {/* Audio waveform */}
        <Waveform bars={bars} />

        {/* Player controls row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[4px]">
            <span className="size-[28px] flex items-center justify-center rounded-[8px] bg-white border-[0.5px] border-[rgba(76,76,59,0.2)]">
              <PlayIcon size={12} className="text-[#21201d]" />
            </span>
            <span className="h-[28px] flex items-center px-[8px] text-[14px] leading-[18px] text-[#21201d]">
              1.0x
            </span>
          </div>
          <p className="text-[14px] leading-[18px]">
            <span className="text-[#21201d]">00:00</span>{" "}
            <span className="text-[#A1A09D]">/ {duration}</span>
          </p>
        </div>

        <div className="h-px bg-[rgba(76,76,59,0.15)]" />

        {/* Transcript text — always rendered fully, no per-character animation. */}
        <div className="flex-1 overflow-hidden flex flex-col gap-[16px]">
          {transcript.map((line, i) => (
            <p
              key={i}
              className="text-[14px] leading-[1.5]"
              style={{ color: line.speaker === "ai" ? "#A1A09D" : "#21201d" }}
            >
              {line.text}
            </p>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}

/* Hand-crafted bar heights for each call. Sam's call has a long verification
   stretch (lots of taller bars in the middle); Jessica's is shorter overall
   with calmer dynamics — a quick refill request. Bars are 2px wide, gap 2px,
   max 49px tall, render in muted neutral. */
const WAVEFORM_SAM = [
  2, 2, 2, 2, 2, 11, 2, 2, 7, 2, 7, 9, 2, 2, 2, 5, 2, 2, 7, 2, 11, 2, 2, 2, 15,
  43, 33, 29, 33, 23, 27, 15, 19, 17, 4, 11, 3, 2, 7, 3, 11, 4, 4, 4, 4, 11, 3,
  2, 7, 3, 11, 21, 37, 21, 23, 19, 15, 17, 25, 15, 19, 15, 17, 11, 21, 13, 27,
  4, 4, 4, 4, 11, 3, 2, 7, 3, 2, 2, 2, 11, 5, 2, 2, 7, 2, 2, 9, 13, 23, 11, 5,
  13, 17,
];

/* Jessica's waveform mirrors the approved Figma reference rhythm. The
   Waveform component keeps the existing color, 2px bar width, and section
   width unchanged. */
const WAVEFORM_JESSICA = [
  2, 2, 2, 2, 2, 11, 23, 13, 21, 13, 19, 23, 17, 19, 17, 5, 9, 2, 15,
  37, 27, 45, 13, 17, 15, 2, 4, 11, 3, 2, 7, 3, 11, 4, 4, 4, 4, 33, 29,
  33, 23, 27, 15, 19, 17, 11, 3, 2, 7, 3, 11, 21, 5, 3, 9, 19, 15, 17, 5,
  2, 2, 2, 2, 11, 2, 13, 2, 4, 4, 4, 4, 11, 3, 2, 7, 3, 2, 2, 2, 2, 11,
  5, 2, 2, 7, 2, 2, 9, 13, 23, 11, 5, 13, 17,
];

const DURATION_SAM = "00:42";
const DURATION_JESSICA = "00:34";

function Waveform({ bars }: { bars: number[] }) {
  return (
    <div className="flex items-center gap-[2px] h-[49px] overflow-hidden">
      {bars.map((h, i) => (
        <div
          key={i}
          className="bg-[#dad9d6] rounded-[1px] w-[2px] shrink-0"
          style={{ height: h }}
        />
      ))}
    </div>
  );
}

/* ─── Cursor ──────────────────────────────────────────────────────────────── */

function Cursor({
  x,
  y,
  clicking,
}: {
  x: number;
  y: number;
  clicking: boolean;
}) {
  return (
    <div
      aria-hidden
      className="absolute top-0 left-0 pointer-events-none will-change-transform"
      style={{
        transform: `translate3d(${x}px, ${y}px, 0)`,
        transition:
          "transform 400ms cubic-bezier(0.645, 0.045, 0.355, 1)",
        zIndex: 50,
      }}
    >
      <div
        className="relative"
        style={{
          transform: clicking ? "scale(0.92)" : "scale(1)",
          transition: "transform 180ms cubic-bezier(0.215, 0.61, 0.355, 1)",
        }}
      >
        <CursorArrow />
        {clicking && (
          <span
            className="absolute -inset-3 rounded-full bg-[#5b5bd6]/30"
            style={{
              animation:
                "inbox-cursor-ping 300ms cubic-bezier(0.215, 0.61, 0.355, 1) 1",
            }}
          />
        )}
      </div>
      <style>{`
        @keyframes inbox-cursor-ping {
          0% { transform: scale(0.4); opacity: 0.7; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-phase] * { transition: none !important; animation: none !important; }
        }
      `}</style>
    </div>
  );
}

/* Custom cursor SVG provided by the designer (Freed Cursor asset). Lives in
   /public so we render it as an <img> rather than inlining the path data. */
function CursorArrow() {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/work/clinic-ai-assistant/Cursor.svg"
      alt=""
      width={24}
      height={24}
      draggable={false}
      className="select-none block"
    />
  );
}

/* ─── Inline icons ───────────────────────────────────────────────────────── */

interface IconProps {
  size?: number;
  className?: string;
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

function ArrowDownIcon({ size = 18, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <line x1="9" y1="3" x2="9" y2="15" />
      <polyline points="14 10 9 15 4 10" />
    </svg>
  );
}

function ArrowUpIcon({ size = 14, className = "" }: IconProps) {
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
      <polyline points="4 8 9 3 14 8" />
    </svg>
  );
}

function SlidersHorizontalIcon({ size = 18, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <line x1="3" y1="6" x2="9.5" y2="6" />
      <line x1="11.5" y1="6" x2="15" y2="6" />
      <circle cx="10.5" cy="6" r="1.6" />
      <line x1="3" y1="12" x2="6" y2="12" />
      <line x1="8" y1="12" x2="15" y2="12" />
      <circle cx="7" cy="12" r="1.6" />
    </svg>
  );
}

function MoreIcon({ size = 18, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <circle cx="4" cy="10" r="1.6" />
      <circle cx="10" cy="10" r="1.6" />
      <circle cx="16" cy="10" r="1.6" />
    </svg>
  );
}

function PanelLeftIcon({ size = 18, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <rect x="2.4" y="3" width="13.2" height="12" rx="1.6" />
      <line x1="6.6" y1="3" x2="6.6" y2="15" />
    </svg>
  );
}

function CheckIcon({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <polyline points="3 8 7 12 13 4" />
    </svg>
  );
}

function CheckCircleIcon({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <circle cx="8" cy="8" r="7" fill="currentColor" />
      <polyline
        points="4.8 8.2 7 10.3 11.2 5.7"
        stroke="#fdfdfc"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function ArrowBendUpLeftIcon({ size = 14, className = "" }: IconProps) {
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
      aria-hidden
      className={className}
    >
      <polyline points="5 3 2 6 5 9" />
      <path d="M2 6 H8 a4 4 0 0 1 4 4 V11" />
    </svg>
  );
}

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
      <path d="M2.03 8.6 C1.52 7.67 1.37 6.57 1.61 5.52 C1.84 4.46 2.45 3.53 3.32 2.89 C4.19 2.24 5.25 1.93 6.33 2.01 C7.41 2.09 8.42 2.56 9.18 3.32 C9.95 4.08 10.41 5.09 10.49 6.17 C10.57 7.25 10.26 8.32 9.61 9.18 C8.97 10.05 8.04 10.66 6.98 10.89 C5.93 11.13 4.83 10.98 3.88 10.47 L2.14 10.98 C2.05 11 1.96 11.01 1.88 10.98 C1.79 10.96 1.71 10.92 1.65 10.85 C1.58 10.79 1.54 10.71 1.52 10.62 C1.49 10.54 1.5 10.44 1.52 10.36 L2.03 8.6 Z" />
      <path d="M10.25 5 C11 5.05 11.74 5.28 12.38 5.68 C13.02 6.08 13.55 6.63 13.92 7.29 C14.3 7.95 14.49 8.7 14.5 9.45 C14.51 10.21 14.33 10.96 13.97 11.62 L14.48 13.36 C14.5 13.45 14.51 13.54 14.48 13.62 C14.46 13.71 14.42 13.79 14.35 13.85 C14.29 13.92 14.21 13.96 14.12 13.99 C14.04 14.01 13.94 14 13.86 13.98 L12.13 13.47 C11.55 13.77 10.92 13.95 10.27 13.99 C9.62 14.03 8.98 13.93 8.37 13.7 C7.77 13.46 7.22 13.1 6.77 12.63 C6.31 12.16 5.97 11.61 5.75 10.99" />
    </svg>
  );
}

function XIcon({ size = 16, className = "" }: IconProps) {
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
      <line x1="3.5" y1="3.5" x2="12.5" y2="12.5" />
      <line x1="12.5" y1="3.5" x2="3.5" y2="12.5" />
    </svg>
  );
}

function PlayIcon({ size = 10, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <polygon points="2 1.5 2 8.5 8 5" />
    </svg>
  );
}

function Spinner({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      style={{ animation: "inbox-spin 800ms linear infinite" }}
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.6"
      />
      <path
        d="M14 8 a6 6 0 0 0 -6 -6"
        stroke="#fdfdfc"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <style>{`@keyframes inbox-spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}
