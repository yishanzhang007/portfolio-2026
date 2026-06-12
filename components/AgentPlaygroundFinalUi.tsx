export function AgentPlaygroundFinalUi() {
  return (
    <section className="w-full px-[12px] pt-[16px] md:px-[16px] md:pt-[48px]">
      <div className="mx-auto w-full max-w-[1200px]">
        <div
          data-testid="agent-playground-browser-frame"
          className="relative h-[928px] w-full overflow-hidden rounded-[14px] border-[0.5px] border-[rgba(76,76,59,0.2)] bg-[#f3f3f1]"
        >
          <BrowserChrome />
          <div className="absolute bottom-[4px] left-[4px] right-[4px] top-[36px] flex overflow-hidden rounded-[12px] border-[0.5px] border-[rgba(76,76,59,0.2)] bg-white">
            <LeftNavigation />
            <div className="min-w-0 flex-1 bg-white">
              <iframe
                data-testid="agent-playground-final-ui"
                title="Agent customization final solution"
                src="/work/agent-playground/final-solution/03c-flow-builder-v3.html"
                className="block h-full w-full border-0 bg-transparent"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const NAV_ICON_BASE = "/work/agent-playground/sandbox-icons";
const TOP_NAV_ITEMS = [
  {id: "inbox", label: "Inbox", icon: `${NAV_ICON_BASE}/inbox.svg`},
  {id: "agent", label: "Agent customization", icon: `${NAV_ICON_BASE}/agent.svg`, active: true},
  {id: "patients", label: "Patients", icon: `${NAV_ICON_BASE}/patient.svg`},
];
const BOTTOM_NAV_ITEMS = [{id: "settings", label: "Settings", icon: `${NAV_ICON_BASE}/settings.svg`}];

function LeftNavigation() {
  return (
    <aside
      aria-label="Primary app navigation"
      className="flex w-[46px] shrink-0 flex-col items-center border-r border-[#e9e8e6] bg-[#f8f8f7] pb-0 pt-3"
      data-testid="agent-playground-left-nav"
    >
      <nav className="flex flex-1 flex-col items-center gap-2">
        {TOP_NAV_ITEMS.map((item) => (
          <NavigationItem key={item.id} item={item} />
        ))}
      </nav>

      <nav className="mt-auto flex flex-col items-center gap-1 pb-3">
        {BOTTOM_NAV_ITEMS.map((item) => (
          <NavigationItem key={item.id} item={item} />
        ))}
      </nav>
    </aside>
  );
}

function NavigationItem({
  item,
}: {
  item: {id: string; label: string; icon: string; active?: boolean};
}) {
  return (
    <button
      type="button"
      aria-current={item.active ? "page" : undefined}
      aria-label={item.label}
      title={item.label}
      className={`flex size-8 items-center justify-center rounded-lg transition-colors duration-150 ease ${
        item.active ? "bg-[#e5e5e4] text-[#262521]" : "text-[#aaa8a4] hover:bg-[#ececeb] hover:text-[#262521]"
      }`}
    >
      <span
        aria-hidden="true"
        className="block size-[22px] bg-current [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:contain]"
        style={{
          maskImage: `url("${item.icon}")`,
          WebkitMaskImage: `url("${item.icon}")`,
        }}
      />
    </button>
  );
}

function BrowserChrome() {
  return (
    <div className="absolute left-0 right-0 top-0 flex h-[36px] items-center gap-[8px] rounded-t-[14px] bg-[#f3f3f1] px-[12px]">
      <span className="size-[12px] rounded-full bg-[#ed6a5e]" />
      <span className="size-[12px] rounded-full bg-[#f5bf4f]" />
      <span className="size-[12px] rounded-full bg-[#62c554]" />
      <div className="flex flex-1 items-center justify-center">
        <div className="flex h-[24px] w-full max-w-[626px] items-center justify-center rounded-[6px] border-[0.5px] border-[rgba(76,76,59,0.15)] px-[12px] font-sms text-[12px] text-[#A1A09D]">
          frontdesk.getfreed.ai/agent-playground
        </div>
      </div>
      <span className="w-[60px]" />
    </div>
  );
}
