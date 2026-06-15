interface Row {
  label: string;
  a: string;
  b: string;
  emphasis?: boolean;
}

const ROWS: Row[] = [
  { label: "Latency",       a: "High — call hangs up",             b: "Low — feels present" },
  { label: "Architecture",  a: "ASR → LLM → TTS",                 b: "Speech-to-speech" },
  { label: "Voice quality",  a: "Great (3000+ voices)",             b: "Limited (6–7 preset)" },
  { label: "Price",          a: "~ $0.10/min",                      b: "~ $0.30/min" },
  { label: "Verdict",        a: "Easy to start, wrong substrate",   b: "3× cost, but the product", emphasis: true },
];

interface SubstrateComparisonTableProps {
  /** "responsive" stacks rows on mobile (voice-agent page).
   *  "scroll" wraps the table in a horizontal scroll on mobile (clinic-ai page). */
  variant: "responsive" | "scroll";
}

export function SubstrateComparisonTable({ variant }: SubstrateComparisonTableProps) {
  if (variant === "scroll") {
    return (
      <div className="overflow-x-auto -mx-[12px] px-[12px] md:mx-0 md:px-0">
        <div className="min-w-[540px]">
          <div className="grid grid-cols-[116px_1fr_1fr] gap-[16px] py-[12px] text-muted">
            <span />
            <span>ElevenLabs Turbo</span>
            <span>OpenAI Realtime</span>
          </div>
          {ROWS.map((row, i) => (
            <div
              key={row.label}
              className="grid grid-cols-[116px_1fr_1fr] gap-[16px] py-[12px] border-t border-[#e9e8e6]"
              style={{ borderTopWidth: i === 0 ? "1.5px" : "0.5px" }}
            >
              <span className={`text-muted ${row.emphasis ? "font-medium" : ""}`}>
                {row.label}
              </span>
              <span className={row.emphasis ? "font-medium" : ""}>{row.a}</span>
              <span className={row.emphasis ? "font-medium" : ""}>{row.b}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:grid md:grid-cols-[116px_1fr_1fr] gap-[16px] py-[12px] text-muted">
        <span />
        <span>ElevenLabs Turbo</span>
        <span>OpenAI Realtime</span>
      </div>
      {ROWS.map((row, i) => (
        <div
          key={row.label}
          className="grid grid-cols-1 md:grid-cols-[116px_1fr_1fr] gap-[4px] md:gap-[16px] py-[12px] border-t border-[#e9e8e6]"
          style={{ borderTopWidth: i === 0 ? "1.5px" : "0.5px" }}
        >
          <span className={`text-muted ${row.emphasis ? "font-medium" : ""}`}>
            {row.label}
          </span>
          <span className={row.emphasis ? "font-medium" : ""}>{row.a}</span>
          <span className={row.emphasis ? "font-medium" : ""}>{row.b}</span>
        </div>
      ))}
    </>
  );
}
