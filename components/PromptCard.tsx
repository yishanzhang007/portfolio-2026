import { Fragment, type ReactNode } from "react";

/* Same VS Code Light+ palette used by TerminalCard. */
const BOLD = "text-[#0451a5] font-semibold";
const STR = "text-[#a31515]";

/* Markdown source for the prompt excerpt. Rendered with light syntax styling
   for **bold** spans and "quoted" examples — kept minimal so the prose stays
   readable. */
const SOURCE = `**Don't echo, do reflect** — After the caller answers, move forward. Do NOT restate or summarize what they just said. Most of the time, a short transition and the next question is enough. Read a value back ONLY when you're not confident you heard it correctly — unusual name spellings, ambiguous date formats, phone numbers said quickly or with background noise. If a value came through clearly, just move on. Exception: when you're roadmapping (telling them what's coming next) or connecting their answer to the next step, a brief reference to what they said is natural and helpful. But don't use roadmapping as an excuse to restate details — "Let me find a provider for you" is a roadmap; "For a general checkup next Monday at 3 PM, let me find a provider" is an echo with a roadmap stapled on. The test: are you adding context or accuracy, or just proving you listened?`;

/** Inline-render a markdown line: **bold** runs and "quoted" runs get
 *  per-token color, everything else inherits text-ink. */
function renderInline(line: string): ReactNode {
  const tokens: ReactNode[] = [];
  let i = 0;
  let key = 0;
  while (i < line.length) {
    if (line.startsWith("**", i)) {
      const end = line.indexOf("**", i + 2);
      if (end !== -1) {
        tokens.push(
          <span key={key++} className={BOLD}>
            {line.slice(i + 2, end)}
          </span>,
        );
        i = end + 2;
        continue;
      }
    }
    if (line[i] === '"') {
      const end = line.indexOf('"', i + 1);
      if (end !== -1) {
        tokens.push(
          <span key={key++} className={STR}>
            {line.slice(i, end + 1)}
          </span>,
        );
        i = end + 1;
        continue;
      }
    }
    // Accumulate plain text up to the next interesting marker.
    let next = line.length;
    const boldAt = line.indexOf("**", i);
    const quoteAt = line.indexOf('"', i);
    if (boldAt !== -1) next = Math.min(next, boldAt);
    if (quoteAt !== -1) next = Math.min(next, quoteAt);
    tokens.push(<Fragment key={key++}>{line.slice(i, next)}</Fragment>);
    i = next;
  }
  return tokens;
}

export function PromptCard() {
  const lines = SOURCE.split("\n");
  return (
    <div className="w-full bg-white overflow-hidden border-[0.5px] border-[rgba(76,76,59,0.3)] rounded-[6px] shadow-[0_4px_12px_0_rgba(0,0,0,0.04)] flex flex-col">
      {/* chrome bar with filename tab */}
      <div className="bg-panel h-[40px] flex items-center pl-[12px] pr-[16px] shrink-0 gap-[16px]">
        <div className="flex gap-[8px]">
          <span className="size-[12px] rounded-full bg-[#e76764] border-[0.5px] border-[#df3733]" />
          <span className="size-[12px] rounded-full bg-[#efc944] border-[0.5px] border-[#e9b809]" />
          <span className="size-[12px] rounded-full bg-[#6bc466] border-[0.5px] border-[#3bb036]" />
        </div>
        <span className="font-mono text-[12px] font-semibold text-[#82807c]">
          freed-agent-prompt.md
        </span>
      </div>

      {/* body */}
      <pre className="bg-white p-[12px] m-0 font-mono text-[12px] xl:text-[14px] leading-[1.6] whitespace-pre-wrap text-ink">
        {lines.map((line, idx) => (
          <Fragment key={idx}>
            {renderInline(line)}
            {idx < lines.length - 1 ? "\n" : ""}
          </Fragment>
        ))}
      </pre>
    </div>
  );
}
