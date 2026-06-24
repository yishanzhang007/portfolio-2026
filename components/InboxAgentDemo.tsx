"use client";

/* eslint-disable @next/next/no-img-element */

import {
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

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

const ICON_BUTTON_CLASS =
  "group flex size-[30px] shrink-0 items-center justify-center rounded-[10px] text-[#B2B2B2] transition-colors hover:bg-[#F7F7F7] hover:text-[#21201D]";
const CHAT_ROW_CLASS = "chat-message-row grid w-full items-start";
const CHAT_COLUMN_CLASS = "chat-layout-column w-full";
const CHAT_ACTION_COLUMN_CLASS =
  "chat-layout-column chat-action-column w-full";
const CHAT_BUBBLE_WIDTH_CLASS = "chat-bubble";
const CHAT_INCOMING_CONTENT_CLASS =
  "col-start-2 min-w-0 flex flex-col gap-[8px] items-start";
const CHAT_OUTGOING_CONTENT_CLASS =
  "col-start-2 min-w-0 flex flex-col gap-[8px] items-end";
const CHAT_LAYOUT_CSS = `
  [data-chat-canvas] {
    container: clinic-chat-canvas / inline-size;
  }

  .chat-layout-column,
  .chat-message-row {
    box-sizing: border-box;
    margin-inline: auto;
    width: 100%;
    max-width: min(100%, 832px);
    padding-inline: 16px;
  }

  .chat-message-row {
    column-gap: 8px;
    grid-template-columns: 20px minmax(0, 1fr) 20px;
  }

  .chat-action-column {
    padding-inline: 28px;
  }

  .chat-bubble {
    max-width: min(100%, 600px);
  }
`;

/* Cursor target positions in design pixels (origin = top-left of the 1207×928
   inner stage; includes the browser chrome). The new Cursor.svg has its
   pointing tip at ~(10, 5) within the 24×24 viewBox, so subtract that offset
   from each target so the visible tip lands on the click target. */
const CURSOR_OFF = { x: 1170, y: 875 };
/* Sam's inbox row center ≈ (148, 194). Tip-adjusted cursor pos = (138, 189). */
const CURSOR_SAM = { x: 138, y: 189 };
/* Cancel-button center (732, 735) measured live → cursor pos (722, 730). */
const CURSOR_CANCEL = { x: 722, y: 730 };

type DemoMode = "animated" | "manual";

interface InboxAgentDemoProps {
  mode?: DemoMode;
  presentation?: "framed" | "fullscreen";
}

export function InboxAgentDemo({
  mode = "animated",
  presentation = "framed",
}: InboxAgentDemoProps = {}) {
  const isAnimated = mode === "animated";
  const isFullscreen = presentation === "fullscreen";
  const [phase, setPhase] = useState<Phase>(() =>
    isAnimated ? "state1" : "state2",
  );
  const [isInboxCollapsed, setIsInboxCollapsed] = useState(false);
  const [inboxFilter, setInboxFilter] = useState<InboxFilter>("open");
  const [selectedConversationId, setSelectedConversationId] = useState("sam");
  const [unreadConversationIds, setUnreadConversationIds] = useState<
    Set<string>
  >(() => new Set(["sam"]));
  const [deletedConversationIds, setDeletedConversationIds] = useState<
    Set<string>
  >(() => new Set());
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
    if (isAnimated && reducedMotion) setPhase("state4-sent");
  }, [isAnimated, reducedMotion]);

  useEffect(() => {
    if (!isAnimated || started || reducedMotion || !wrapperRef.current) return;
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
  }, [isAnimated, started, reducedMotion]);

  useEffect(() => {
    if (!isAnimated || reducedMotion || !started) return;
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
  }, [isAnimated, phase, reducedMotion, started]);

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
  const sortedConversations = sortConversationsByRecency(CONVERSATIONS);
  const visibleConversations = sortedConversations.filter(
    (conversation) => !deletedConversationIds.has(conversation.id),
  );
  const selectedConversation = isAnimated
    ? samSelected
      ? SAM_ROW
      : JESSICA_ROW
    : visibleConversations.find(
        (conversation) => conversation.id === selectedConversationId,
      ) ??
      visibleConversations.find(
        (conversation) => conversation.status === inboxFilter,
      ) ??
      visibleConversations[0] ??
      SAM_ROW;
  const selectedConversationIsUnread =
    !isAnimated && unreadConversationIds.has(selectedConversation.id);
  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setUnreadConversationIds((current) => {
      if (!current.has(conversationId)) return current;
      const next = new Set(current);
      next.delete(conversationId);
      return next;
    });
  };
  const handleInboxFilterChange = (nextFilter: InboxFilter) => {
    setInboxFilter(nextFilter);
    const firstConversation = visibleConversations.find(
      (conversation) => conversation.status === nextFilter,
    );
    if (firstConversation) setSelectedConversationId(firstConversation.id);
  };
  const handleToggleConversationReadState = () => {
    setUnreadConversationIds((current) => {
      const next = new Set(current);
      if (next.has(selectedConversation.id)) {
        next.delete(selectedConversation.id);
      } else {
        next.add(selectedConversation.id);
      }
      return next;
    });
  };
  const handleDeleteConversation = () => {
    const deletedId = selectedConversation.id;
    const remainingConversations = visibleConversations.filter(
      (conversation) => conversation.id !== deletedId,
    );
    const nextConversation =
      remainingConversations.find(
        (conversation) => conversation.status === inboxFilter,
      ) ?? remainingConversations[0];

    setDeletedConversationIds((current) => {
      const next = new Set(current);
      next.add(deletedId);
      return next;
    });
    setUnreadConversationIds((current) => {
      const next = new Set(current);
      next.delete(deletedId);
      return next;
    });

    if (nextConversation) {
      setSelectedConversationId(nextConversation.id);
      if (nextConversation.status !== inboxFilter) {
        setInboxFilter(nextConversation.status);
      }
    }
  };

  // Cursor itinerary: off → Sam → off → Cancel → off.
  const cursorPos =
    phase === "to-sam"
      ? CURSOR_SAM
      : phase === "to-cancel" || phase === "loading"
        ? CURSOR_CANCEL
        : CURSOR_OFF;
  const cursorRenderPos = isFullscreen
    ? { x: cursorPos.x - 4, y: cursorPos.y - 36 }
    : cursorPos;
  const cursorClicking =
    isAnimated && (phase === "to-sam" || phase === "to-cancel") && started;
  const handleSamClick =
    !isAnimated && phase === "sam-unread"
      ? () => setPhase("state2")
      : undefined;
  const handleCancelAppointment =
    !isAnimated && cancelButtonState === "default"
      ? () => setPhase("state4-sent")
      : undefined;

  return (
    <div
      ref={wrapperRef}
      className={
        isFullscreen
          ? "relative h-full w-full overflow-hidden bg-white"
          : "relative w-full max-w-[1207px] h-[888px] md:h-[928px] overflow-hidden bg-[#F7F7F7] rounded-[14px] border-[0.5px] border-[rgba(76,76,59,0.2)]"
      }
      data-phase={phase}
      data-motion={isAnimated ? "on" : "off"}
    >
      {!isAnimated && (
        <style>{`
          [data-motion="off"] *,
          [data-motion="off"] *::before,
          [data-motion="off"] *::after {
            animation: none !important;
            transition: none !important;
          }
        `}</style>
      )}
      <style>{CHAT_LAYOUT_CSS}</style>
      {!isFullscreen && <BrowserChrome />}
      <div
        className={
          isFullscreen
            ? "absolute inset-0 bg-white overflow-hidden flex"
            : "absolute left-[4px] right-[4px] top-[36px] bottom-[4px] rounded-[12px] border-[0.5px] border-[rgba(76,76,59,0.2)] bg-white overflow-hidden flex"
        }
      >
        <InboxList
          samArrived={showsSam}
          samSelected={samSelected}
          samUnread={samUnread}
          samResolved={samResolved}
          onSamClick={handleSamClick}
          conversations={visibleConversations}
          selectedConversationId={selectedConversation.id}
          unreadConversationIds={unreadConversationIds}
          inboxFilter={inboxFilter}
          onInboxFilterChange={handleInboxFilterChange}
          onConversationSelect={
            isAnimated ? undefined : handleConversationSelect
          }
          isAnimated={isAnimated}
          collapsed={isInboxCollapsed}
        />
        <Canvas
          conversation={selectedConversation}
          showCancellationCard={
            isAnimated &&
            showsCancellationCard &&
            selectedConversation.id === "sam"
          }
          cancelButtonState={cancelButtonState}
          showConfirmedMessage={
            showsConfirmedMessage && selectedConversation.id === "sam"
          }
          animateMessages={isAnimated}
          onCancelAppointment={handleCancelAppointment}
          isInboxCollapsed={isInboxCollapsed}
          onToggleInbox={() => setIsInboxCollapsed((collapsed) => !collapsed)}
          isConversationUnread={selectedConversationIsUnread}
          onToggleConversationReadState={handleToggleConversationReadState}
          onDeleteConversation={handleDeleteConversation}
        />
        <RightPanel conversation={selectedConversation} />
      </div>
      {isAnimated && (
        <Cursor
          x={cursorRenderPos.x}
          y={cursorRenderPos.y}
          clicking={cursorClicking}
        />
      )}
    </div>
  );
}

/* ─── Browser chrome (top bar with traffic lights + URL) ──────────────────── */
function BrowserChrome() {
  return (
    <div className="absolute left-0 right-0 top-0 h-[36px] flex items-center px-[12px] gap-[8px] bg-[#F7F7F7] rounded-t-[14px]">
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
  id: string;
  name: string;
  subject: string;
  time: string;
  status: InboxFilter;
  phone: string;
  summaryDuration: string;
  summary: string;
  clinicReply: string;
  audioDuration: string;
  avatar: { kind: "letter"; letter: string; bg: string } | { kind: "reply" };
}

type InboxFilter = "open" | "resolved" | "ai-resolved";

const INBOX_FILTER_OPTIONS: Array<{ id: InboxFilter; label: string }> = [
  { id: "open", label: "Open" },
  { id: "resolved", label: "Resolved" },
  { id: "ai-resolved", label: "AI resolved" },
];

const CONVERSATIONS: InboxRowData[] = [
  {
    id: "sam",
    name: "Sam Smith",
    subject: "Cancel an existing patient",
    time: "2 min",
    status: "open",
    phone: "510-443-7333",
    summaryDuration: "24:12s",
    summary:
      "Sam Smith wants to cancel his upcoming appointment with Dr. Brown tomorrow at 4 PM.",
    clinicReply:
      "Spring Clinic: We've received your cancellation request and our team will follow up if anything else is needed.",
    audioDuration: "00:42",
    avatar: { kind: "letter", letter: "S", bg: "#8e4ec6" },
  },
  {
    id: "jessica",
    name: "Jessica Davis",
    subject: "Medication refill",
    time: "5min",
    status: "open",
    phone: "417-262-1738",
    summaryDuration: "18:36s",
    summary:
      "Jessica Davis requested a refill for Lisinopril 10mg and confirmed Walgreens on Main Street as her pharmacy.",
    clinicReply:
      "Spring Clinic: We've sent your refill request to your provider and will text you when it is ready.",
    audioDuration: "00:34",
    avatar: { kind: "reply" },
  },
  {
    id: "karen-reschedule",
    name: "Karen Taylor",
    subject: "Move annual visit to Friday",
    time: "10min",
    status: "open",
    phone: "925-304-1182",
    summaryDuration: "12:08s",
    summary:
      "Karen Taylor needs to move her annual visit to a Friday afternoon and prefers the same provider.",
    clinicReply:
      "Spring Clinic: We noted your Friday afternoon preference and will send available times shortly.",
    avatar: { kind: "reply" },
    audioDuration: "00:31",
  },
  {
    id: "avery-labs",
    name: "Avery Chen",
    subject: "Lab result question",
    time: "15min",
    status: "open",
    phone: "510-882-0199",
    summaryDuration: "09:54s",
    summary:
      "Avery Chen saw a flagged cholesterol result in the portal and wants to know if a follow-up is needed.",
    clinicReply:
      "Spring Clinic: We sent your question to the care team. They will review your lab result and respond.",
    audioDuration: "00:29",
    avatar: { kind: "letter", letter: "A", bg: "#3578e8" },
  },
  {
    id: "clara-nutrition",
    name: "Clara White",
    subject: "Nutrition referral status",
    time: "1h",
    status: "open",
    phone: "650-442-7811",
    summaryDuration: "11:40s",
    summary:
      "Clara White is checking whether her nutrition referral was sent to the specialist office.",
    clinicReply:
      "Spring Clinic: We will confirm the referral status and text you once the specialist office has it.",
    audioDuration: "00:27",
    avatar: { kind: "letter", letter: "C", bg: "#338ccd" },
  },
  {
    id: "michael-new-patient",
    name: "Michael Smith",
    subject: "New patient appointment",
    time: "22min",
    status: "open",
    phone: "408-903-2201",
    summaryDuration: "14:22s",
    summary:
      "Michael Smith is a new patient looking for the earliest primary care appointment next week.",
    clinicReply:
      "Spring Clinic: We collected your scheduling preferences and will text the first available openings.",
    audioDuration: "00:38",
    avatar: { kind: "letter", letter: "M", bg: "#53b9ab" },
  },
  {
    id: "liam-advice",
    name: "Liam Rodriguez",
    subject: "Nurse advice request",
    time: "20min",
    status: "open",
    phone: "415-772-4408",
    summaryDuration: "10:35s",
    summary:
      "Liam Rodriguez has mild dizziness after starting a new medication and wants to know whether to continue it.",
    clinicReply:
      "Spring Clinic: A nurse will review your symptoms and call back if a medication change is needed.",
    audioDuration: "00:33",
    avatar: { kind: "reply" },
  },
  {
    id: "tommy-medication",
    name: "Tommy Vance",
    subject: "Medication side effects",
    time: "1min",
    status: "open",
    phone: "925-601-4470",
    summaryDuration: "08:48s",
    summary:
      "Tommy Vance reports nausea after increasing his Metformin dose and asks whether that is expected.",
    clinicReply:
      "Spring Clinic: We documented the side effect and sent it to your provider for review.",
    audioDuration: "00:26",
    avatar: { kind: "reply" },
  },
  {
    id: "sophie-billing",
    name: "Sophie Daniels",
    subject: "Billing question",
    time: "1h",
    status: "open",
    phone: "510-915-3340",
    summaryDuration: "07:20s",
    summary:
      "Sophie Daniels received a balance after her preventive visit and wants clarification on the charge.",
    clinicReply:
      "Spring Clinic: We routed your question to billing and they will follow up with an explanation.",
    audioDuration: "00:24",
    avatar: { kind: "reply" },
  },
  {
    id: "george-mental-health",
    name: "George Hall",
    subject: "Anxiety medication follow-up",
    time: "1h",
    status: "open",
    phone: "415-628-1093",
    summaryDuration: "15:05s",
    summary:
      "George Hall wants a follow-up after two weeks on his anxiety medication and prefers telehealth.",
    clinicReply:
      "Spring Clinic: We captured your telehealth preference and will text available follow-up times.",
    audioDuration: "00:40",
    avatar: { kind: "letter", letter: "G", bg: "#6743d2" },
  },
  {
    id: "nina-insurance",
    name: "Nina Patel",
    subject: "Insurance verification",
    time: "1h",
    status: "open",
    phone: "408-773-9022",
    summaryDuration: "06:50s",
    summary:
      "Nina Patel changed insurance plans and wants to confirm coverage before her dermatology visit.",
    clinicReply:
      "Spring Clinic: We saved your new insurance details and will confirm coverage before the appointment.",
    audioDuration: "00:22",
    avatar: { kind: "reply" },
  },
  {
    id: "owen-imaging",
    name: "Owen Brooks",
    subject: "Imaging referral status",
    time: "2h",
    status: "open",
    phone: "650-337-8901",
    summaryDuration: "09:18s",
    summary:
      "Owen Brooks is checking whether his shoulder MRI order was sent to Bay Imaging.",
    clinicReply:
      "Spring Clinic: We will verify the imaging order and text you once Bay Imaging has received it.",
    audioDuration: "00:28",
    avatar: { kind: "letter", letter: "O", bg: "#8e4ec6" },
  },
  {
    id: "priya-vaccine",
    name: "Priya Shah",
    subject: "Vaccine appointment",
    time: "2h",
    status: "open",
    phone: "510-229-4420",
    summaryDuration: "05:55s",
    summary:
      "Priya Shah wants to schedule a flu shot for herself and her son on the same afternoon.",
    clinicReply:
      "Spring Clinic: We noted the family scheduling request and will send matching flu-shot times.",
    audioDuration: "00:20",
    avatar: { kind: "reply" },
  },
  {
    id: "elena-rx",
    name: "Elena Ramirez",
    subject: "Prescription sent",
    time: "Yesterday",
    status: "resolved",
    phone: "415-901-3320",
    summaryDuration: "06:12s",
    summary:
      "Elena Ramirez asked whether her antibiotic prescription had been sent to the pharmacy.",
    clinicReply:
      "Spring Clinic: Your prescription was sent to the pharmacy on file yesterday afternoon.",
    audioDuration: "00:21",
    avatar: { kind: "reply" },
  },
  {
    id: "victor-records",
    name: "Victor Lee",
    subject: "Records request completed",
    time: "Yesterday",
    status: "resolved",
    phone: "650-472-9088",
    summaryDuration: "07:36s",
    summary:
      "Victor Lee requested a copy of his recent visit notes for an outside specialist.",
    clinicReply:
      "Spring Clinic: Your records request has been completed and sent through the patient portal.",
    audioDuration: "00:25",
    avatar: { kind: "letter", letter: "V", bg: "#338ccd" },
  },
  {
    id: "maya-form",
    name: "Maya Johnson",
    subject: "School form ready",
    time: "Mon",
    status: "resolved",
    phone: "510-700-1288",
    summaryDuration: "08:05s",
    summary:
      "Maya Johnson called about a school physical form that needed provider signature.",
    clinicReply:
      "Spring Clinic: Your school form is complete and available in the portal.",
    audioDuration: "00:23",
    avatar: { kind: "letter", letter: "M", bg: "#53b9ab" },
  },
  {
    id: "peter-copay",
    name: "Peter Kim",
    subject: "Copay receipt sent",
    time: "Mon",
    status: "resolved",
    phone: "408-200-8711",
    summaryDuration: "04:44s",
    summary:
      "Peter Kim needed a receipt for his specialist visit copay.",
    clinicReply:
      "Spring Clinic: We sent the copay receipt to your email on file.",
    audioDuration: "00:18",
    avatar: { kind: "reply" },
  },
  {
    id: "iris-directions",
    name: "Iris Martin",
    subject: "Clinic hours answered",
    time: "Today",
    status: "ai-resolved",
    phone: "925-882-1401",
    summaryDuration: "03:35s",
    summary:
      "Iris Martin asked for Saturday lab hours and parking instructions.",
    clinicReply:
      "Spring Clinic: The AI answered with Saturday lab hours and parking details.",
    audioDuration: "00:16",
    avatar: { kind: "reply" },
  },
  {
    id: "noah-address",
    name: "Noah Wilson",
    subject: "Address update captured",
    time: "Today",
    status: "ai-resolved",
    phone: "415-310-2881",
    summaryDuration: "04:10s",
    summary:
      "Noah Wilson called to update his mailing address before a statement was sent.",
    clinicReply:
      "Spring Clinic: The AI updated the mailing-address note for staff review.",
    audioDuration: "00:17",
    avatar: { kind: "letter", letter: "N", bg: "#6743d2" },
  },
  {
    id: "amara-portal",
    name: "Amara Singh",
    subject: "Portal reset instructions",
    time: "Today",
    status: "ai-resolved",
    phone: "650-882-9910",
    summaryDuration: "03:58s",
    summary:
      "Amara Singh needed instructions to reset her patient portal password.",
    clinicReply:
      "Spring Clinic: The AI sent portal reset instructions by text.",
    audioDuration: "00:15",
    avatar: { kind: "reply" },
  },
];

const SAM_ROW = CONVERSATIONS[0]!;
const JESSICA_ROW = CONVERSATIONS[1]!;

function getConversationRecencyRank(time: string) {
  const normalized = time.trim().toLowerCase();
  const minutes = normalized.match(/^(\d+)\s*min$/);
  if (minutes) return Number(minutes[1]);

  const hours = normalized.match(/^(\d+)\s*h$/);
  if (hours) return Number(hours[1]) * 60;

  if (normalized === "today") return 24 * 60;
  if (normalized === "yesterday") return 48 * 60;

  const weekdayOrder: Record<string, number> = {
    mon: 3,
    tue: 4,
    wed: 5,
    thu: 6,
    fri: 7,
    sat: 8,
    sun: 9,
  };
  return (weekdayOrder[normalized.slice(0, 3)] ?? 99) * 24 * 60;
}

function sortConversationsByRecency(conversations: InboxRowData[]) {
  const originalIndex = new Map(
    conversations.map((conversation, index) => [conversation.id, index]),
  );

  return [...conversations].sort((a, b) => {
    const recencyDelta =
      getConversationRecencyRank(a.time) - getConversationRecencyRank(b.time);
    if (recencyDelta !== 0) return recencyDelta;
    return (originalIndex.get(a.id) ?? 0) - (originalIndex.get(b.id) ?? 0);
  });
}

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
  onSamClick,
  conversations,
  selectedConversationId,
  unreadConversationIds,
  inboxFilter,
  onInboxFilterChange,
  onConversationSelect,
  isAnimated,
  collapsed,
}: {
  samArrived: boolean;
  samSelected: boolean;
  samUnread: boolean;
  samResolved: boolean;
  onSamClick?: () => void;
  conversations: InboxRowData[];
  selectedConversationId: string;
  unreadConversationIds: Set<string>;
  inboxFilter: InboxFilter;
  onInboxFilterChange: (filter: InboxFilter) => void;
  onConversationSelect?: (conversationId: string) => void;
  isAnimated: boolean;
  collapsed: boolean;
}) {
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const filterCounts = INBOX_FILTER_OPTIONS.reduce(
    (counts, option) => {
      counts[option.id] = conversations.filter(
        (conversation) => conversation.status === option.id,
      ).length;
      return counts;
    },
    {} as Record<InboxFilter, number>,
  );
  const activeFilterOption =
    INBOX_FILTER_OPTIONS.find((option) => option.id === inboxFilter) ??
    INBOX_FILTER_OPTIONS[0];
  const visibleRows = conversations.filter(
    (conversation) => conversation.status === inboxFilter,
  );
  const showAnimatedSamSlot = isAnimated && inboxFilter === "open";
  const baseRows = showAnimatedSamSlot
    ? visibleRows.filter((conversation) => conversation.id !== "sam")
    : visibleRows;
  const activeRowId = isAnimated
    ? samSelected
      ? "sam"
      : "jessica"
    : selectedConversationId;

  return (
    <div
      data-inbox-panel
      data-collapsed={collapsed ? "true" : "false"}
      className={`h-full shrink-0 overflow-hidden transition-[width] duration-300 ease-out motion-reduce:transition-none ${
        collapsed ? "w-0" : "w-0 min-[1072px]:w-[280px]"
      }`}
    >
    <div className="flex flex-col h-full w-[280px] shrink-0 font-sms">
      {/* Header: Front desk inbox */}
      <div className="flex items-center justify-between h-[52px] pl-[8px] pr-[12px] py-[12px] border-b-[0.5px] border-[rgba(76,76,59,0.2)]">
        <div
          data-text-button
          className="group flex h-[32px] items-center gap-[8px] rounded-[10px] px-[8px] transition-colors hover:bg-[#F7F7F7]"
        >
          <p className="text-[14px] leading-[18px] font-medium text-[#21201d]">
            Front desk inbox
          </p>
          <CaretDownIcon
            size={18}
            className="text-[#B2B2B2] group-hover:text-[#21201D]"
          />
        </div>
        <IconButton>
          <SlidersHorizontalIcon size={18} />
        </IconButton>
      </div>
      {/* Filter row */}
      <div className="relative flex h-[44px] items-center justify-between pl-[8px] pr-[12px] py-[6px]">
        <button
          type="button"
          data-open-selector
          aria-expanded={filterMenuOpen}
          data-text-button
          className="group flex h-[32px] items-center gap-[4px] rounded-[10px] px-[8px] transition-colors hover:bg-[#F7F7F7]"
          onClick={() => setFilterMenuOpen((open) => !open)}
        >
          <p className="text-[14px] leading-[18px] font-medium text-[#21201d]">
            {filterCounts[inboxFilter]} {activeFilterOption.label}
          </p>
          <CaretDownIcon
            size={18}
            className="text-[#B2B2B2] group-hover:text-[#21201D]"
          />
        </button>
        {filterMenuOpen && (
          <div
            data-open-selector-menu
            className="absolute left-[8px] top-[44px] z-50 min-w-[188px] overflow-hidden rounded-md border border-[rgba(76,76,59,0.16)] bg-white p-1 text-[14px] shadow-md"
          >
            {INBOX_FILTER_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`flex h-[32px] w-full items-center justify-between rounded-sm px-2 text-left text-[14px] leading-[18px] outline-none transition-colors hover:bg-[#F7F7F7] ${
                  option.id === inboxFilter
                    ? "text-[#21201d]"
                    : "text-[#82807C]"
                }`}
                onClick={() => {
                  onInboxFilterChange(option.id);
                  setFilterMenuOpen(false);
                }}
              >
                <span>{option.label}</span>
                <span className="text-[#A1A09D]">
                  {filterCounts[option.id]}
                </span>
              </button>
            ))}
          </div>
        )}
        <IconButton>
          <ArrowDownIcon size={20} />
        </IconButton>
      </div>
      {/* List */}
      <div className="flex-1 flex flex-col px-[8px] overflow-hidden">
        {/* Sam's slot — collapsed (0fr) by default; expands to 1fr when he
            arrives. The inner row also fades + slides down ~12px so the entry
            reads like a new item dropping in. */}
        {showAnimatedSamSlot && (
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
                  onClick={onSamClick}
                />
              </div>
            </div>
          </div>
        )}
        {/* Existing conversations */}
        <div className="flex flex-col gap-[4px]">
          {baseRows.map((row) => (
            <InboxRow
              key={row.id}
              row={row}
              active={row.id === activeRowId}
              unread={!isAnimated && unreadConversationIds.has(row.id)}
              onClick={
                onConversationSelect
                  ? () => onConversationSelect(row.id)
                  : undefined
              }
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
  onClick,
}: {
  row: InboxRowData;
  active: boolean;
  unread?: boolean;
  onClick?: () => void;
}) {
  const className = `flex w-full gap-[12px] items-start px-[8px] py-[12px] rounded-[12px] text-left transition-colors hover:bg-[#F7F7F7] ${
    onClick ? "cursor-pointer" : ""
  } ${active ? "bg-[#F7F7F7]" : ""}`;
  const content = (
    <>
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
        <div className="size-[20px] shrink-0 rounded-full bg-[#EBEBEB] flex items-center justify-center">
          <ArrowBendUpLeftIcon size={12} className="text-[#21201D]" />
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
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        data-row-name={row.name}
        className={`${className} appearance-none border-0 font-[inherit]`}
        onClick={onClick}
      >
        {content}
      </button>
    );
  }

  return (
    <div data-row-name={row.name} className={className}>
      {content}
    </div>
  );
}

/* ─── Canvas (middle column) ─────────────────────────────────────────────── */

interface CanvasProps {
  conversation: InboxRowData;
  showCancellationCard: boolean;
  cancelButtonState: "default" | "loading" | "done";
  showConfirmedMessage: boolean;
  animateMessages: boolean;
  onCancelAppointment?: () => void;
  isInboxCollapsed: boolean;
  onToggleInbox: () => void;
  isConversationUnread: boolean;
  onToggleConversationReadState: () => void;
  onDeleteConversation: () => void;
}

function Canvas({
  conversation,
  showCancellationCard,
  cancelButtonState,
  showConfirmedMessage,
  animateMessages,
  onCancelAppointment,
  isInboxCollapsed,
  onToggleInbox,
  isConversationUnread,
  onToggleConversationReadState,
  onDeleteConversation,
}: CanvasProps) {
  const isSam = conversation.id === "sam";
  const isJessica = conversation.id === "jessica";
  const firstName = conversation.name.split(" ")[0] ?? conversation.name;
  const [draft, setDraft] = useState("");
  const [sentMessagesByConversation, setSentMessagesByConversation] = useState<
    Record<string, string[]>
  >({});
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const sentMessages = sentMessagesByConversation[conversation.id] ?? [];
  const canSendMessage = draft.trim().length > 0;
  const useFigmaChatLayout = isSam && !animateMessages;
  const acknowledgementText = useFigmaChatLayout
    ? "[Clinic Name]: We've received your request and our team will follow up within 1-2 business days.\n\nReply STOP to opt out."
    : conversation.clinicReply;
  const summaryTimestamp = useFigmaChatLayout ? "24 min" : conversation.time;
  const acknowledgementTimestamp = useFigmaChatLayout
    ? "12 min"
    : isSam
      ? "1 min"
      : "12 min";
  const patientAvatar =
    conversation.avatar.kind === "letter"
      ? conversation.avatar
      : {
          kind: "letter" as const,
          letter: conversation.name.charAt(0),
          bg: isSam ? "#8e4ec6" : "#5b5bd6",
        };
  const handleSendMessage = () => {
    const message = draft.trim();
    if (!message) return;
    setSentMessagesByConversation((current) => ({
      ...current,
      [conversation.id]: [...(current[conversation.id] ?? []), message],
    }));
    setDraft("");
  };
  const handleComposerKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };
  const handleToggleReadState = () => {
    onToggleConversationReadState();
    setActionMenuOpen(false);
  };
  const handleDeleteConversation = () => {
    onDeleteConversation();
    setActionMenuOpen(false);
  };
  return (
    <div
      data-chat-canvas
      className="flex-1 min-w-0 h-full flex flex-col border-l-0 min-[1072px]:border-l-[0.5px] border-r-0 min-[1200px]:border-r-[0.5px] border-[rgba(76,76,59,0.2)] overflow-hidden font-sms"
    >
      {/* Canvas header: avatar + name + Resolve button */}
      <div className="flex items-center gap-[12px] h-[52px] pl-[10px] pr-[16px] py-[12px] border-b-[0.5px] border-[rgba(76,76,59,0.2)]">
        <div className="flex items-center gap-[4px] flex-1 min-w-0">
          <IconButton
            ariaLabel={
              isInboxCollapsed ? "Open inbox panel" : "Collapse inbox panel"
            }
            onClick={onToggleInbox}
            pressed={isInboxCollapsed}
            dataAttribute="collapse"
          >
            <PanelLeftIcon closed={isInboxCollapsed} size={20} />
          </IconButton>
          <p className="text-[14px] leading-[18px] font-medium text-[#21201d] truncate">
            {conversation.name}
          </p>
        </div>
        <div className="relative">
          <IconButton
            ariaLabel="Conversation actions"
            onClick={() => setActionMenuOpen((open) => !open)}
            pressed={actionMenuOpen}
            dataAttribute="conversation-actions"
          >
            <MoreIcon size={20} />
          </IconButton>
          {actionMenuOpen && (
            <div
              data-conversation-actions-menu
              className="absolute right-0 top-[36px] z-50 min-w-[204px] overflow-hidden rounded-md border border-[rgba(76,76,59,0.16)] bg-white p-1 text-[14px] shadow-md"
            >
              <button
                type="button"
                className="flex h-[32px] w-full items-center rounded-sm px-2 text-left text-[14px] leading-[18px] text-[#21201d] outline-none transition-colors hover:bg-[#F7F7F7]"
                onClick={handleToggleReadState}
              >
                {isConversationUnread ? "Mark as read" : "Mark as unread"}
              </button>
              <button
                type="button"
                className="flex h-[32px] w-full items-center rounded-sm px-2 text-left text-[14px] leading-[18px] text-[#21201d] outline-none transition-colors hover:bg-[#F7F7F7]"
                onClick={handleDeleteConversation}
              >
                Delete conversation
              </button>
            </div>
          )}
        </div>
        <div
          data-text-button
          className="h-[32px] min-w-[68px] -ml-[8px] flex items-center justify-center pl-[14px] pr-[10px] bg-white border-[0.5px] border-[rgba(76,76,59,0.2)] rounded-[10px]"
        >
          <span className="text-[14px] leading-[18px] font-medium text-[#21201d]">
            Resolve
          </span>
        </div>
      </div>

      {/* Message thread */}
      <div className="flex-1 overflow-hidden flex flex-col gap-[16px] py-[16px]">
        {/* First patient message — request summary */}
        <div className={`${CHAT_ROW_CLASS} justify-start`}>
          <div
            className="col-start-1 size-[20px] shrink-0 rounded-full flex items-center justify-center"
            style={{ backgroundColor: patientAvatar.bg }}
          >
            <span className="text-[12px] leading-[16px] font-semibold text-[#fdfdfc]">
              {patientAvatar.letter}
            </span>
          </div>
          <div className={CHAT_INCOMING_CONTENT_CLASS}>
            <div
              className={`bg-[#F7F7F7] rounded-[12px] px-[14px] py-[10px] flex w-fit ${CHAT_BUBBLE_WIDTH_CLASS} flex-col gap-[8px]`}
            >
              <div className="flex flex-col gap-[4px]">
                <p className="flex gap-[4px] text-[14px] leading-[20px] font-medium text-[#21201d]">
                  <span>{conversation.subject}</span>
                  <span>({conversation.summaryDuration})</span>
                </p>
                <p className="text-[14px] leading-[20px] text-[#21201d]">
                  {conversation.phone}
                </p>
              </div>
              <div className="h-px bg-[rgba(76,76,59,0.15)]" />
              <p className="text-[14px] leading-[20px] text-[#21201d]">
                {conversation.summary}
              </p>
            </div>
            <p className="text-[12px] leading-[16px] text-[#A1A09D] text-left">
              {summaryTimestamp}
            </p>
          </div>
        </div>

        {/* Second message — clinic acknowledgment (lavender). Single avatar
            on the RIGHT; the bubble aligns to the right edge of the column. */}
        <div className={`${CHAT_ROW_CLASS} justify-end`}>
          <div className={CHAT_OUTGOING_CONTENT_CLASS}>
            <div
              className={`bg-[#f6f5ff] rounded-[12px] px-[12px] py-[10px] w-fit ${CHAT_BUBBLE_WIDTH_CLASS}`}
            >
              <p className="whitespace-pre-line text-[14px] leading-[20px] text-[#21201d]">
                {acknowledgementText}
              </p>
            </div>
            <p className="text-[12px] leading-[16px] text-[#A1A09D] text-right">
              {acknowledgementTimestamp}
            </p>
          </div>
          <div className="col-start-3 justify-self-end">
            <ClinicAvatar />
          </div>
        </div>

        {useFigmaChatLayout && (
          <>
            <div className={`${CHAT_ROW_CLASS} justify-end`}>
              <div className={CHAT_OUTGOING_CONTENT_CLASS}>
                <div
                  className={`bg-[#f6f5ff] rounded-[12px] px-[12px] py-[10px] w-fit ${CHAT_BUBBLE_WIDTH_CLASS}`}
                >
                  <p className="text-[14px] leading-[20px] text-[#21201d]">
                    Hi Sam, do you want to schedule your appointment at another
                    time?
                  </p>
                </div>
                <p className="text-[12px] leading-[16px] text-[#A1A09D] text-right">
                  12 min
                </p>
              </div>
              <div className="col-start-3 justify-self-end">
                <ClinicAvatar />
              </div>
            </div>

            <div className={`${CHAT_ROW_CLASS} justify-start`}>
              <div
                className="col-start-1 size-[20px] shrink-0 rounded-full flex items-center justify-center"
                style={{ backgroundColor: patientAvatar.bg }}
              >
                <span className="text-[12px] leading-[16px] font-semibold text-[#fdfdfc]">
                  {patientAvatar.letter}
                </span>
              </div>
              <div className={CHAT_INCOMING_CONTENT_CLASS}>
                <div
                  className={`bg-[#F7F7F7] rounded-[12px] px-[14px] py-[10px] w-fit ${CHAT_BUBBLE_WIDTH_CLASS}`}
                >
                  <p className="text-[14px] leading-[20px] text-[#21201d]">
                    I&apos;m good for now.
                  </p>
                </div>
                <p className="text-[12px] leading-[16px] text-[#A1A09D] text-left">
                  1 min
                </p>
              </div>
            </div>
          </>
        )}

        {/* Third message — Jessica's pharmacy update (only in state 1) */}
        {isJessica && (
          <div className={`${CHAT_ROW_CLASS} justify-end`}>
            <div className={CHAT_OUTGOING_CONTENT_CLASS}>
              <div
                className={`bg-[#f6f5ff] rounded-[12px] px-[12px] py-[10px] w-fit ${CHAT_BUBBLE_WIDTH_CLASS}`}
              >
                <p className="text-[14px] leading-[20px] text-[#21201d]">
                  Hi Jessica, we have sent your refill request to your pharmacy
                </p>
              </div>
              <p className="text-[12px] leading-[16px] text-[#A1A09D] text-right">
                12 min
              </p>
            </div>
            <div className="col-start-3 justify-self-end">
              <ClinicAvatar />
            </div>
          </div>
        )}

        {/* Fourth message — clinic confirms cancellation (only in state4-sent,
            after the post-cancel pause). Timestamp reads "just now" because
            the SMS literally just went out. */}
        {showConfirmedMessage && (
          <div
            className={`${CHAT_ROW_CLASS} justify-end ${
              animateMessages ? "animate-clinic-message-send-in" : ""
            }`}
          >
            <div className={CHAT_OUTGOING_CONTENT_CLASS}>
              <div
                className={`bg-[#f6f5ff] rounded-[12px] px-[12px] py-[10px] w-fit ${CHAT_BUBBLE_WIDTH_CLASS}`}
              >
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
            <div className="col-start-3 justify-self-end">
              <ClinicAvatar />
            </div>
          </div>
        )}

        {sentMessages.map((message, index) => (
          <div
            key={`${conversation.id}-sent-${index}`}
            data-sent-message
            className={`${CHAT_ROW_CLASS} justify-end`}
          >
            <div className={CHAT_OUTGOING_CONTENT_CLASS}>
              <div
                className={`bg-[#f6f5ff] rounded-[12px] px-[12px] py-[10px] w-fit ${CHAT_BUBBLE_WIDTH_CLASS}`}
              >
                <p className="text-[14px] leading-[20px] text-[#21201d]">
                  {message}
                </p>
              </div>
              <p className="text-[12px] leading-[16px] text-[#A1A09D] text-right">
                Just now
              </p>
            </div>
            <div className="col-start-3 justify-self-end">
              <ClinicAvatar />
            </div>
          </div>
        ))}
      </div>

      {/* Appointment cancellation card (only when Sam is selected). Sits 24px
          narrower than the composer (12px more padding per side, so the card
          stays horizontally centered with the composer below it). No bottom
          border / radius — the composer's top edge meets the card directly. */}
      {showCancellationCard && (
        <div className={CHAT_ACTION_COLUMN_CLASS}>
          <CancellationCard
            state={cancelButtonState}
            onCancel={onCancelAppointment}
          />
        </div>
      )}

      {/* Reply composer */}
      <div className={`${CHAT_COLUMN_CLASS} pb-[16px]`}>
        <div
          data-reply-composer
          className="bg-white border-[0.5px] border-[rgba(76,76,59,0.2)] rounded-[16px] h-[120px] flex flex-col justify-between px-[8px] pb-[6px] pt-[8px] shadow-[0_4px_14px_0_rgba(0,0,0,0.03)]"
        >
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleComposerKeyDown}
            placeholder={`Reply to ${firstName}...`}
            aria-label={`Reply to ${conversation.name}`}
            data-reply-input
            data-reply-placeholder
            className="min-h-0 flex-1 resize-none bg-transparent pl-[8px] pt-[8px] text-[14px] leading-[18px] text-[#21201d] outline-none placeholder:text-[#b2b2b2]"
          />
          <div className="flex -translate-y-[4px] items-center justify-between">
            <span
              data-text-button
              className="group ml-0 flex h-[32px] translate-y-[2px] items-center justify-center gap-[4px] rounded-[10px] px-[8px] transition-colors hover:bg-[#F7F7F7]"
            >
              <ChatsCircleIcon
                size={20}
                className="text-[#B2B2B2] group-hover:text-[#21201D]"
              />
              <span className="text-[14px] leading-[18px] text-[#21201d]">
                SMS
              </span>
              <CaretDownIcon
                size={18}
                className="text-[#B2B2B2] group-hover:text-[#21201D]"
              />
            </span>
            <PrimaryIconButton
              ariaLabel="Send message"
              onClick={handleSendMessage}
              disabled={!canSendMessage}
            >
              <ArrowUpIcon size={20} />
            </PrimaryIconButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function CancellationCard({
  state,
  onCancel,
}: {
  state: "default" | "loading" | "done";
  onCancel?: () => void;
}) {
  const collapsed = state === "done";
  return (
    <div
      className="border-x-[0.5px] border-t-[0.5px] border-[rgba(76,76,59,0.2)] rounded-t-[12px] overflow-hidden"
      data-cancellation-card
    >
      <div className="bg-[#F7F7F7] flex items-center justify-between h-[44px] px-[12px]">
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
          size={18}
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
              data-text-button
              data-cancel-button
              onClick={onCancel}
              disabled={collapsed}
              className="h-[32px] min-w-[68px] flex items-center justify-center px-[12px] rounded-[10px] bg-[#32302c]"
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
      width={20}
      height={20}
      className="size-[20px] shrink-0 rounded-full"
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

function getTranscript(conversation: InboxRowData): TranscriptLine[] {
  if (conversation.id === "sam") return TRANSCRIPT_SAM;
  if (conversation.id === "jessica") return TRANSCRIPT_JESSICA;
  return [
    {
      speaker: "ai",
      text: "Thank you for calling Spring Clinic. I'm Freed, an automated assistant. How can I help you today?",
    },
    {
      speaker: "patient",
      text: conversation.summary,
    },
    {
      speaker: "ai",
      text: conversation.clinicReply,
    },
  ];
}

function RightPanel({ conversation }: { conversation: InboxRowData }) {
  const transcript = getTranscript(conversation);
  const bars = conversation.id === "sam" ? WAVEFORM_SAM : WAVEFORM_JESSICA;
  const duration = conversation.audioDuration;
  return (
    <div className="h-full w-0 min-[1200px]:w-[400px] shrink-0 overflow-hidden transition-[width] duration-300 ease-out motion-reduce:transition-none">
    <div className="flex flex-col h-full w-[400px] shrink-0 font-sms">
      {/* Header */}
      <div className="flex items-center justify-between h-[52px] px-[14px] py-[12px] border-b-[0.5px] border-[rgba(76,76,59,0.2)]">
        <p className="text-[14px] leading-[18px] font-medium text-[#21201d]">
          Detail
        </p>
        <IconButton>
          <XIcon size={20} />
        </IconButton>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden flex flex-col gap-[16px] px-[16px] py-[16px]">
        {/* Segmented toggle */}
        <div className="bg-[#F7F7F7] rounded-[10px] p-px flex">
          <button
            data-text-button
            className="flex-1 h-[32px] flex items-center justify-center rounded-[10px] bg-white border-[0.5px] border-[rgba(76,76,59,0.2)] text-[14px] leading-[18px] font-medium text-[#21201d]"
          >
            Transcript
          </button>
          <span
            data-text-button
            className="flex-1 h-[32px] flex items-center justify-center rounded-[10px] text-[14px] leading-[18px] font-medium text-[#A1A09D]"
          >
            Patient
          </span>
        </div>

        {/* Audio waveform */}
        <Waveform bars={bars} />

        {/* Player controls row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0">
            <IconButton className="size-[28px]! border-[0.5px] border-[rgba(76,76,59,0.2)] bg-white text-[#21201D]">
              <PlayIcon size={24} className="text-[#21201D]" />
            </IconButton>
            <span
              data-text-button
              className="h-[32px] flex items-center rounded-[10px] px-[8px] text-[14px] leading-[18px] text-[#21201d]"
            >
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

const FIGMA_ICON_DIR = "/work/clinic-ai-assistant/icons";

function IconStage({
  size,
  className = "",
  children,
}: {
  size: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      aria-hidden
      className={`relative block shrink-0 overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      {children}
    </span>
  );
}

function IconButton({
  children,
  className = "",
  ariaLabel,
  onClick,
  pressed,
  dataAttribute,
}: {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
  pressed?: boolean;
  dataAttribute?: "collapse" | "conversation-actions";
}) {
  if (onClick) {
    return (
      <button
        type="button"
        aria-label={ariaLabel}
        aria-pressed={pressed}
        data-icon-button
        data-collapse-button={dataAttribute === "collapse" ? "" : undefined}
        data-conversation-actions-button={
          dataAttribute === "conversation-actions" ? "" : undefined
        }
        onClick={onClick}
        className={`${ICON_BUTTON_CLASS} ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <span
      data-icon-button
      className={`${ICON_BUTTON_CLASS} ${className}`}
    >
      {children}
    </span>
  );
}

function PrimaryIconButton({
  children,
  ariaLabel,
  onClick,
  disabled = false,
}: {
  children: ReactNode;
  ariaLabel?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      data-icon-button
      data-send-icon-button
      className={`group mr-[2px] flex size-[32px] shrink-0 items-center justify-center rounded-[10px] transition-colors ${
        disabled
          ? "cursor-default bg-[#F7F7F7] text-[#bcbbb7] hover:bg-[#F7F7F7] hover:text-[#bcbbb7]"
          : "bg-[#32302c] text-white hover:bg-[#32302c] hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function IconAsset({
  name,
  className = "absolute inset-0 block size-full max-w-none",
}: {
  name: string;
  className?: string;
}) {
  const url = `${FIGMA_ICON_DIR}/${name}`;
  const maskStyle: CSSProperties = {
    WebkitMask: `url("${url}") center / 100% 100% no-repeat`,
    mask: `url("${url}") center / 100% 100% no-repeat`,
    backgroundColor: "currentColor",
  };

  return (
    <span
      aria-hidden
      className={`${className} pointer-events-none select-none`}
      style={maskStyle}
    />
  );
}

function CaretDownIcon({ size = 18, className = "" }: IconProps) {
  return (
    <IconStage
      size={size}
      className={`-translate-x-[2px] -translate-y-[1px] ${className}`}
    >
      <span
        className="absolute"
        style={{ inset: "41.25% 25% 31.25% 27.5%" }}
      >
        <IconAsset name="chevron-down.svg" />
      </span>
    </IconStage>
  );
}

function ArrowDownIcon({ size = 20, className = "" }: IconProps) {
  return (
    <IconStage size={size} className={className}>
      <span className="absolute" style={{ inset: "17.5% 26.25%" }}>
        <IconAsset name="arrow-down.svg" />
      </span>
    </IconStage>
  );
}

function ArrowUpIcon({ size = 20, className = "" }: IconProps) {
  return (
    <IconStage size={size} className={className}>
      <span className="absolute" style={{ inset: "17.5% 26.25%" }}>
        <IconAsset name="arrow-up-vector.svg" />
      </span>
    </IconStage>
  );
}

function SlidersHorizontalIcon({ size = 20, className = "" }: IconProps) {
  return (
    <IconStage size={size} className={className}>
      <span
        className="absolute"
        style={{ inset: "19.99% 15% 49.99% 15%" }}
      >
        <IconAsset name="adjust-top.svg" />
      </span>
      <span className="absolute" style={{ inset: "49.99% 15% 20% 15%" }}>
        <IconAsset name="adjust-bottom.svg" />
      </span>
    </IconStage>
  );
}

function MoreIcon({ size = 20, className = "" }: IconProps) {
  return (
    <IconStage size={size} className={className}>
      <span className="absolute" style={{ inset: "42.5% 70% 42.5% 15%" }}>
        <IconAsset name="menu-dot-1.svg" />
      </span>
      <span className="absolute" style={{ inset: "42.5%" }}>
        <IconAsset name="menu-dot-2.svg" />
      </span>
      <span
        className="absolute"
        style={{ inset: "42.5% 15% 42.5% 69.99%" }}
      >
        <IconAsset name="menu-dot-3.svg" />
      </span>
    </IconStage>
  );
}

function PanelLeftIcon({
  size = 20,
  className = "",
  closed = false,
}: IconProps & { closed?: boolean }) {
  return (
    <IconStage size={size} className={className}>
      <IconAsset name={closed ? "dock-side-closed.svg" : "dock-side.svg"} />
    </IconStage>
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
    <img
      src={`${FIGMA_ICON_DIR}/reply-arrow.svg`}
      alt=""
      width={size}
      height={size}
      draggable={false}
      className={`block shrink-0 select-none ${className}`}
    />
  );
}

function ChatsCircleIcon({ size = 20, className = "" }: IconProps) {
  return (
    <IconStage size={size} className={className}>
      <span
        className="absolute"
        style={{ inset: "36.25% 35% 56.25% 30%" }}
      >
        <IconAsset name="chat-line-1.svg" />
      </span>
      <span className="absolute" style={{ inset: "47.5% 45% 45% 30%" }}>
        <IconAsset name="chat-line-2.svg" />
      </span>
      <span className="absolute" style={{ inset: "20% 15% 16.25% 15%" }}>
        <IconAsset name="chat-bubble.svg" />
      </span>
    </IconStage>
  );
}

function XIcon({ size = 20, className = "" }: IconProps) {
  return (
    <IconStage size={size} className={className}>
      <span className="absolute" style={{ inset: "23.75%" }}>
        <IconAsset name="x.svg" />
      </span>
    </IconStage>
  );
}

function PlayIcon({ size = 28, className = "" }: IconProps) {
  return (
    <IconStage size={size} className={className}>
      <IconAsset name="play.svg" />
    </IconStage>
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
