const HIGHLIGHT = "var(--color-phi-highlight)";

export function VoiceAgentHero({ visible = false }: { visible?: boolean }) {
  return (
    <div
      className="bg-white rounded-[8px] overflow-hidden flex flex-col items-start"
      style={{
        width: 200,
        border: "0.5px solid rgba(76,76,59,0.2)",
        boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <div
        className="flex items-center w-full shrink-0"
        style={{
          height: 20,
          background: "#f3f3f3",
          paddingLeft: 8,
        }}
      >
        <div className="flex items-center" style={{ gap: 4 }}>
          <div
            className="rounded-full shrink-0"
            style={{ width: 6, height: 6, background: "#FF5F57" }}
          />
          <div
            className="rounded-full shrink-0"
            style={{ width: 6, height: 6, background: "#FEBC2E" }}
          />
          <div
            className="rounded-full shrink-0"
            style={{ width: 6, height: 6, background: "#28C840" }}
          />
        </div>
      </div>
      <div className="flex items-center justify-center" style={{ padding: 6 }}>
        <p
          className="font-mono"
          style={{
            fontSize: 10,
            lineHeight: 1.5,
            letterSpacing: "-0.09px",
            color: "#000",
            width: 188,
          }}
        >
          Be the warm, efficient person at the front desk —{" "}
          <span className="relative inline-block">
            {visible && (
              <span
                aria-hidden
                className="absolute animate-voice-highlight"
                style={{
                  inset: "-1px -2px",
                  background: HIGHLIGHT,
                  zIndex: 0,
                }}
              />
            )}
            <span className="relative" style={{ zIndex: 1 }}>
              genuinely helpful
            </span>
          </span>
          , not robotic.
        </p>
      </div>
    </div>
  );
}
