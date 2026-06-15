import type { ReactNode } from "react";
import { CaseStudyHero } from "@/components/CaseStudyHero";
import { CaseStudyLayout, SectionDivider } from "@/components/CaseStudyLayout";
import { CaseStudySection } from "@/components/CaseStudySection";
import { CodeCardChrome } from "@/components/CodeCardChrome";
import { QuoteCard } from "@/components/QuoteCard";
import { SubstrateComparisonTable } from "@/components/SubstrateComparisonTable";

function SmallLabel({ children }: { children: ReactNode }) {
  return <p className="text-muted">{children}</p>;
}

function PromptBlock({
  filename,
  children,
}: {
  filename?: string;
  children: string;
}) {
  return (
    <CodeCardChrome filename={filename}>
      <pre className="bg-white p-[12px] m-0 font-mono text-[12px] xl:text-[14px] leading-[1.5] whitespace-pre-wrap text-ink">
        {children}
      </pre>
    </CodeCardChrome>
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
      showTocSections
    >
      <CaseStudySection
        label="Conversational agent"
        subtitle="Nov 2025 - present • Freed"
        noToc
      >
        <p>
          One of the most important parts of the project is to design a
          human-like and a genuinely helpful conversational agent to collect
          patient information. I designed the user flow and defined principles
          to help define the agent behavior.
        </p>
      </CaseStudySection>

      <SectionDivider />

      <CaseStudySection label="Picking the substrate" labelClassName="text-[18px]">
        <p>
          Before any prompt could work, I had to pick the substrate that made
          real-time conversation possible. We started on{" "}
          <span className="text-header">ElevenLabs Turbo</span> for ease of use
          and its catalog of warm preset voices. Under HIPAA-routed production
          traffic the latency was bad enough that callers were hanging up.
          After three months we switched to{" "}
          <span className="text-header">OpenAI Realtime</span> — ~3× the
          per-minute cost, fewer voices, none as warm — and traded warmth for
          presence.
        </p>

        <div className="mt-[8px]">
          <SubstrateComparisonTable variant="responsive" />
        </div>
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
            <PromptBlock>
              {`### Personality and Tone
Be the warm, efficient person at the front desk — genuinely helpful, not robotic.

### Pronunciation
- **Dates:** say naturally ("January first, nineteen ninety") not formatted
- **Phone numbers:** group digits, skip +1 country code
  - Example: \`+1 (505) 123-4567\` → "five zero five, one two three, four five six seven"`}
            </PromptBlock>
          </div>

          <p>
            <span className="text-muted">Observed:</span> “Dead giveaway”
            moments disappeared within one revision.
          </p>
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

          <p>
            <span className="text-muted">Observed:</span> Abandonment fell{" "}
            <span className="font-medium">32.6% → 10.6%</span> over four
            revisions.
          </p>
        </div>

        {/* #3 — Front desk, not doctor */}
        <div className="flex flex-col gap-[24px] mt-[40px]">
          <p className="text-body font-medium">
            <span className="text-muted">#3 - </span>
            <span>Front desk, not doctor.</span>
          </p>

          <p>
            <span className="text-muted">User needs:</span> The most consistent
            worry across 20+ clinic interviews was an AI giving medical advice.
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

          <p>
            <span className="text-muted">Observed:</span> Zero
            clinical-advice incidents in 10K+ calls.
          </p>
        </div>
      </CaseStudySection>
    </CaseStudyLayout>
  );
}
