interface AgentPlaygroundFinalUiProps {
  autoplay?: boolean;
  frame?: "browser" | "none";
  motion?: "on" | "off";
}

export function AgentPlaygroundFinalUi({
  autoplay = true,
  frame = "browser",
  motion = "on",
}: AgentPlaygroundFinalUiProps = {}) {
  const params = new URLSearchParams();
  if (autoplay) params.set("autoplay", "1");
  if (motion === "off") params.set("motion", "off");
  const query = params.toString();
  const iframe = (
    <iframe
      data-testid="agent-playground-final-ui"
      title="Agent customization final solution"
      src={`/work/agent-playground/final-solution/03c-flow-builder-v3.html${query ? `?${query}` : ""}`}
      className="block h-full w-full border-0 bg-transparent"
      loading="eager"
    />
  );

  if (frame === "none") {
    return (
      <section className="h-screen w-full overflow-hidden bg-white">
        {iframe}
      </section>
    );
  }

  return (
    <section className="w-full px-[12px] pt-[16px] md:px-[16px] md:pt-[48px]">
      <div className="mx-auto w-full max-w-[1200px]">
        <div
          data-testid="agent-playground-browser-frame"
          className="relative h-[928px] w-full overflow-hidden rounded-[14px] border-[0.5px] border-[rgba(76,76,59,0.2)] bg-[#f3f3f1]"
        >
          <BrowserChrome />
          <div className="absolute bottom-[4px] left-[4px] right-[4px] top-[36px] flex overflow-hidden rounded-[12px] border-[0.5px] border-[rgba(76,76,59,0.2)] bg-white">
            <div className="min-w-0 flex-1 bg-white">
              {iframe}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BrowserChrome() {
  return (
    <div className="absolute left-0 right-0 top-0 flex h-[36px] items-center gap-[8px] rounded-t-[14px] bg-[#f3f3f1] px-[8px] md:px-[12px]">
      <span className="hidden size-[12px] rounded-full bg-[#ed6a5e] md:block" />
      <span className="hidden size-[12px] rounded-full bg-[#f5bf4f] md:block" />
      <span className="hidden size-[12px] rounded-full bg-[#62c554] md:block" />
      <div className="flex min-w-0 flex-1 items-center justify-center">
        <div className="flex h-[24px] w-full min-w-0 items-center justify-center overflow-hidden whitespace-nowrap rounded-[6px] border-[0.5px] border-[rgba(76,76,59,0.15)] px-[12px] font-sms text-[12px] text-[#A1A09D] md:max-w-[626px]">
          frontdesk.getfreed.ai/agent-playground
        </div>
      </div>
      <span className="hidden w-[60px] md:block" />
    </div>
  );
}
