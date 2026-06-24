import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { InboxAgentDemo } from "@/components/InboxAgentDemo";

export const metadata: Metadata = {
  title: "Clinic AI Assistant Hero",
};

export default function ClinicAiAssistantHeroPage() {
  return (
    <main className="flex h-screen w-screen overflow-hidden bg-white text-body text-ink">
      <ClinicAssistantNav />
      <div className="h-full min-w-0 flex-1">
        <InboxAgentDemo mode="manual" presentation="fullscreen" />
      </div>
    </main>
  );
}

const NAV_ICON_BUTTON_CLASS =
  "group flex size-[30px] shrink-0 items-center justify-center rounded-[10px] transition-colors";
const NAV_ICON_BUTTON_IDLE_CLASS =
  "text-[#B2B2B2] hover:bg-[#2E2D28]/[0.06] hover:text-[#21201D]";
const NAV_ICON_BUTTON_SELECTED_CLASS =
  "bg-[#2E2D28]/[0.06] text-[#21201D]";

function ClinicAssistantNav() {
  return (
    <aside
      aria-label="Clinic assistant navigation"
      className="flex h-full w-[52px] shrink-0 flex-col items-center justify-between border-r-[0.5px] border-[rgba(76,76,59,0.2)] bg-[#f9f9f8] px-[10px] pb-[16px] pt-[12px]"
    >
      <div className="flex shrink-0 flex-col items-start gap-[8px]">
        <NavIconButton label="Inbox" selected>
          <div className="relative size-[20px] shrink-0 overflow-hidden">
            <div className="absolute inset-[17.5%]">
              <MaskedAsset src="/work/clinic-ai-assistant/nav/order.svg" />
            </div>
          </div>
        </NavIconButton>

        <NavIconButton label="Patients">
          <div className="relative size-[20px] shrink-0 overflow-hidden">
            <div
              className="absolute"
              style={{
                bottom: "50%",
                left: "32.5%",
                right: "32.5%",
                top: "15%",
              }}
            >
              <MaskedAsset src="/work/clinic-ai-assistant/nav/person-head.svg" />
            </div>
            <div
              className="absolute"
              style={{
                inset: "55% 19.56% 15% 19.56%",
              }}
            >
              <MaskedAsset src="/work/clinic-ai-assistant/nav/person-body.svg" />
            </div>
          </div>
        </NavIconButton>

        <NavIconButton label="Agent customization">
          <div className="relative size-[20px] shrink-0">
            <MaskedAsset src="/work/clinic-ai-assistant/nav/profile-icon.svg" />
          </div>
        </NavIconButton>
      </div>

      <div className="flex shrink-0 flex-col items-center">
        <img
          data-nav-avatar
          src="/work/clinic-ai-assistant/nav/Avatar.svg"
          alt=""
          width={20}
          height={20}
          className="size-[20px] shrink-0 rounded-full object-cover"
        />
      </div>
    </aside>
  );
}

function NavIconButton({
  children,
  className = "",
  label,
  selected = false,
}: {
  children: ReactNode;
  className?: string;
  label: string;
  selected?: boolean;
}) {
  const stateClass = selected
    ? NAV_ICON_BUTTON_SELECTED_CLASS
    : NAV_ICON_BUTTON_IDLE_CLASS;

  return (
    <span
      aria-label={label}
      data-icon-button
      data-selected={selected ? "true" : undefined}
      className={`${NAV_ICON_BUTTON_CLASS} relative ${stateClass} ${className}`}
    >
      {children}
      <span
        data-nav-tooltip
        className="pointer-events-none absolute left-[calc(100%+8px)] top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-[8px] bg-[#2E2D28] px-[8px] py-[5px] font-sms text-[12px] font-medium leading-[16px] text-white opacity-0 shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-opacity duration-150 group-hover:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}

function MaskedAsset({
  src,
  className = "absolute inset-0 block size-full max-w-none",
}: {
  src: string;
  className?: string;
}) {
  const maskStyle: CSSProperties = {
    WebkitMask: `url("${src}") center / 100% 100% no-repeat`,
    mask: `url("${src}") center / 100% 100% no-repeat`,
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
