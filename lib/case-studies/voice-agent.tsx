import type { ReactNode } from "react";
import { CaseStudyHero } from "@/components/CaseStudyHero";
import { CaseStudyLayout, SectionDivider } from "@/components/CaseStudyLayout";
import { CaseStudySection } from "@/components/CaseStudySection";

/* ─── Block-level helpers used by the "Principles → prompt → behavior"
   section. Inlined here rather than promoted to /components because they
   only appear on this case study and have no reuse pressure yet. ─────── */

function SmallLabel({ children }: { children: ReactNode }) {
  return <p className="text-muted text-[14px] leading-[1.5]">{children}</p>;
}

/** A bg-panel quote card with the NType 82 serif quote and muted
 *  attribution. Matches the existing clinic-AI testimonial cards. */
function QuoteCard({
  text,
  attribution,
}: {
  text: string;
  attribution: string;
}) {
  return (
    <div className="bg-panel rounded-[6px] p-[12px]">
      <p
        className="text-[14px] md:text-[18px] xl:text-[20px] leading-[1.3]"
        style={{ fontFamily: "var(--font-ntype), serif" }}
      >
        {text}
      </p>
      <p className="text-muted text-[14px] leading-[1.5] mt-[24px]">
        {attribution}
      </p>
    </div>
  );
}

/** A terminal-style card for displaying literal system-prompt snippets.
 *  Same chrome (white card, traffic-light bar, optional filename) as the
 *  clinic-AI TerminalCard, but accepts plain text instead of typed JSON. */
function PromptBlock({
  filename,
  children,
}: {
  filename?: string;
  children: string;
}) {
  return (
    <div className="w-full bg-white border-[0.5px] border-[rgba(76,76,59,0.3)] rounded-[6px] shadow-[0_4px_16px_0_rgba(0,0,0,0.04)] flex flex-col overflow-hidden">
      <div className="bg-panel h-[40px] flex items-center pl-[12px] pr-[16px] shrink-0 gap-[16px]">
        <div className="flex gap-[8px]">
          <span className="size-[12px] rounded-full bg-[#e76764] border-[0.5px] border-[#df3733]" />
          <span className="size-[12px] rounded-full bg-[#efc944] border-[0.5px] border-[#e9b809]" />
          <span className="size-[12px] rounded-full bg-[#6bc466] border-[0.5px] border-[#3bb036]" />
        </div>
        {filename && (
          <span className="font-mono text-[12px] font-semibold text-[#82807c]">
            {filename}
          </span>
        )}
      </div>
      <pre className="bg-white p-[12px] m-0 font-mono text-[12px] xl:text-[14px] leading-[1.5] whitespace-pre-wrap text-ink">
        {children}
      </pre>
    </div>
  );
}

export function VoiceAgent() {
  return (
    <CaseStudyLayout
      hero={
        <CaseStudyHero
          src="/work/clinic-ai-assistant/Voice%20agent.svg"
          alt="Conversational agent — conversational flow and design principles."
          width={1229}
          height={634}
          tileColor="#F1F1EE"
          imageInsetTop={123}
          centered
        />
      }
    >
      <CaseStudySection label="Conversational agent">
        <p>
          One of the most important parts of the project is to design a
          human-like and a genuinely helpful conversational agent to collect
          patient information. I designed the user flow and defined principles
          to help define the agent behavior.
        </p>
      </CaseStudySection>

      <SectionDivider />

      <CaseStudySection
        label="Principles → prompt → behavior"
        labelClassName="text-[18px]"
      >
        <p>
          I wrote nine behavioral principles for the voice agent. Three of them
          are below — paired with the exact prompt rule each became, and the
          production behavior that confirms the rule is doing its job.
        </p>

        {/* #1 — Sound human */}
        <div className="flex flex-col gap-[24px] mt-[40px]">
          <p className="text-body font-medium">
            <span className="text-muted">#1 - </span>
            <span>Sound human</span>
          </p>

          <div className="flex flex-col gap-[8px]">
            <SmallLabel>User quote</SmallLabel>
            <QuoteCard
              text={`“I really don’t want a Walgreens robot for the patients.”`}
              attribution="Dr. Salas, solo practitioner"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <SmallLabel>Prompt change</SmallLabel>
            <PromptBlock filename="voice-agent-prompt.md">
              {`### Personality and Tone
Be the warm, efficient person at the front desk — genuinely helpful, not robotic.

### Pronunciation
- **Dates:** say naturally ("January first, nineteen ninety") not formatted
- **Phone numbers:** group digits, skip +1 country code
  - Example: \`+1 (505) 123-4567\` → "five zero five, one two three, four five six seven"`}
            </PromptBlock>
          </div>

          <div className="flex flex-col gap-[8px]">
            <SmallLabel>Observable behavior</SmallLabel>
            <p>
              The “dead giveaway” pattern stopped surfacing in test calls within
              one prompt revision.
            </p>
          </div>
        </div>

        {/* #2 — Never trap the patient */}
        <div className="flex flex-col gap-[24px] mt-[40px]">
          <p className="text-body font-medium">
            <span className="text-muted">#2 - </span>
            <span>Never trap the patient.</span>
          </p>

          <div className="flex flex-col gap-[8px]">
            <SmallLabel>User quote</SmallLabel>
            <QuoteCard
              text={`“She repeats back like five times. Patients get frustrated and just hang up.”`}
              attribution="Casey Cash, owner of the Iris Center"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <SmallLabel>Prompt change</SmallLabel>
            <PromptBlock>
              {`- **Unclear input / noise** — if the caller's audio is unclear, garbled, or you cannot understand what they said, ask them to repeat using a short, unique phrase each time. After 3 failed attempts, apologize for the audio trouble, let them know someone from the clinic will call back, and call \`end_call\`. NEVER respond to unclear audio by repeating your previous message.`}
            </PromptBlock>
          </div>

          <div className="flex flex-col gap-[8px]">
            <SmallLabel>Observable behavior</SmallLabel>
            <p>
              Call abandonment rate fell{" "}
              <span className="font-medium">32.6% → 10.6%</span> over four
              prompt revisions.
            </p>
          </div>
        </div>

        {/* #3 — Front desk, not doctor */}
        <div className="flex flex-col gap-[24px] mt-[40px]">
          <p className="text-body font-medium">
            <span className="text-muted">#3 - </span>
            <span>Front desk, not doctor.</span>
          </p>

          <p className="text-muted italic">
            The most consistent worry across 20+ clinic interviews was an AI
            giving medical advice.
          </p>

          <div className="flex flex-col gap-[8px]">
            <SmallLabel>Prompt change</SmallLabel>
            <PromptBlock>
              {`**Symptoms and medical questions:**
- Do NOT diagnose, assess, give medical advice, or ask clarifying medical questions
- Do NOT proactively ask about emergency symptoms or screen for emergencies
- ONLY mention 911 as an option if the patient EXPLICITLY describes a clear emergency unprompted — never instruct them to call
- For everything else, simply take a message for the clinical team`}
            </PromptBlock>
          </div>

          <div className="flex flex-col gap-[8px]">
            <SmallLabel>Observable behavior</SmallLabel>
            <p>
              <span className="font-medium">
                Zero clinical-advice incidents
              </span>{" "}
              flagged across 10K+ production calls.
            </p>
          </div>
        </div>
      </CaseStudySection>
    </CaseStudyLayout>
  );
}
