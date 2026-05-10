import { CaseStudyHero } from "@/components/CaseStudyHero";
import { CaseStudyImage } from "@/components/CaseStudyImage";
import { CaseStudyLayout, SectionDivider } from "@/components/CaseStudyLayout";
import { CaseStudySection } from "@/components/CaseStudySection";
import { InboxAgentDemo } from "@/components/InboxAgentDemo";
import { PatientVerificationDemo } from "@/components/PatientVerificationDemo";
import { PromptCard } from "@/components/PromptCard";
import { SmsComposerDemo } from "@/components/SmsComposerDemo";
import { TerminalCard } from "@/components/TerminalCard";

export function ClinicAIAssistant() {
  return (
    <CaseStudyLayout
      hero={null}
      showTocSections
      showMobileIndex
      intro={
        // Inbox-Agent demo as the lead visual. Breaks out of the 960px
        // intro slot to span the full viewport, with 12px (sm+: 16px)
        // horizontal padding so the demo never touches the screen edge.
        // Demo height stays at native 928px at every viewport — only
        // the width responds (capped at 1207px native). Internal panels
        // collapse via viewport breakpoints inside the demo so the
        // canvas always fills the visible area.
        <div className="relative left-1/2 -translate-x-1/2 w-screen px-[12px]">
          <div className="mx-auto w-full max-w-[1207px]">
            <InboxAgentDemo />
          </div>
        </div>
      }
    >
      <CaseStudySection
        label="Clinic AI Assistant"
        subtitle="Nov 2025 - present • Freed"
        noToc
      >
        <p>
          The hardest design problem wasn&apos;t designing the interface — it
          was naming the twenty ways the AI could fail before we shipped it,
          and fine-tuning the conversational agent until patients wanted to
          engage. Freed&apos;s Clinic AI Assistant is an always-on AI
          receptionist for small-to-medium clinics. I led design and owned
          the roadmap with 6 engineers —{" "}
          <span className="text-header">0 to $1M+ ARR in 6 months</span>.
        </p>
      </CaseStudySection>

      <SectionDivider />

      <CaseStudySection label="Framing the problem" labelClassName="text-[18px]">
        <p>
          40+ clinic conversations surfaced four pains. Three were
          uncomfortable. One was the reason they&apos;d buy.
        </p>
        <ol className="flex flex-col">
          <li className="flex gap-[16px]">
            <span className="text-muted">1.</span>
            <span>Fragmented tools — annoyance</span>
          </li>
          <li className="flex gap-[16px]">
            <span className="text-muted">2.</span>
            <span>Missed revenue — opportunity</span>
          </li>
          <li className="flex gap-[16px]">
            <span className="text-muted">3.</span>
            <span>New-patient intake — drag</span>
          </li>
          <li className="flex gap-[16px]">
            <span className="text-muted">4.</span>
            <span className="text-header">Staffing — existential</span>
          </li>
        </ol>
        <p>
          <span className="text-muted">Our bet:</span> build for the
          existential one. The rest would resolve if we got the front desk
          right.
        </p>
      </CaseStudySection>

      <SectionDivider />

      <CaseStudySection label="Pairing power with safety" labelClassName="text-[18px]">
        <p>
          The hardest problem in healthcare wasn&apos;t what the AI could do. It was knowing
          where it should stop. Every capability we shipped is a{" "}
          <span className="text-header">Power × Safety</span> pair — a
          powerful default, with a safety rail.
        </p>
      </CaseStudySection>

      <div className="h-[32px]" />

      <CaseStudySection label="" noDivider>
        <p className="text-body font-medium">
          <span className="text-muted">#1: </span>
          <span>Two-way SMS messaging</span>
        </p>
        <CaseStudyImage aspectRatio="640 / 400">
          <SmsComposerDemo />
        </CaseStudyImage>
        <div className="flex flex-col gap-[4px] mt-[8px] md:mt-0">
          <p>
            <span className="text-muted">Power:</span> staff and respond to appointments
            end-to-end.
          </p>
          <p>
            <span className="text-muted">Safety:</span> PHI detection to prevent
            accidentally sending sensitive information.
          </p>
        </div>
      </CaseStudySection>

      <div className="h-[32px]" />

      <CaseStudySection label="" noDivider>
        <p className="text-body font-medium">
          <span className="text-muted">#2: </span>
          <span>Patient verification</span>
        </p>
        <CaseStudyImage className="h-[360px]">
          <PatientVerificationDemo />
        </CaseStudyImage>
        <p className="mt-[8px] md:mt-0">
          <span className="text-muted">Power:</span> We can verify the patient on the call to
          pull up their record and look up upcoming appointments or current medications.
        </p>
        <div className="mt-[32px]">
          <TerminalCard />
        </div>
        <p>
          <span className="text-muted">Safety:</span> I defined the taxonomy of different
          cases and designed test cases and evals to ensure safety.
        </p>
      </CaseStudySection>

      <SectionDivider />

      <CaseStudySection
        label="Designing the eval"
        labelClassName="text-[18px]"
      >
        <p>
          You can&apos;t prove a thing is safe until you can name what
          unsafe looks like. The first design move on Patient Verification
          wasn&apos;t a screen — it was a list of 20 ways the agent could
          fail. Building the eval taught me three things.
        </p>

        {/* #1 — The taxonomy is the design */}
        <div className="flex flex-col gap-[8px] mt-[32px]">
          <p className="text-body font-medium">
            <span className="text-muted">#1 - </span>
            <span>The taxonomy is the design</span>
          </p>

          {/* Scroll wrapper: on mobile, extends to viewport edges so the
              scroll surface feels native; on md+ the negative margin/padding
              collapse to 0 and the table sits inside the body. The inner
              `min-w-[480px]` keeps the desktop 2-column layout intact on
              mobile so labels never wrap. */}
          <div className="overflow-x-auto -mx-[12px] px-[12px] md:mx-0 md:px-0">
            <div className="min-w-[480px]">
              <div className="grid grid-cols-2 gap-[16px] py-[12px] text-muted">
                <span>Outcome</span>
                <span>Action</span>
              </div>
              {[
                {
                  label: "confident",
                  desc: "1 exact match",
                  action: "Finalize as verified",
                },
                {
                  label: "ambiguous",
                  desc: "two or more matches",
                  action: "Ask one disambiguator",
                },
                {
                  label: "no_match",
                  desc: "zero matches",
                  action: "Branch by sub-type — see below*",
                },
                {
                  label: "system_error",
                  desc: "",
                  action: "Retry once, then hand to staff",
                },
              ].map((row, i) => (
                <div
                  key={row.label}
                  className="grid grid-cols-2 gap-[16px] py-[12px] border-t border-[#e9e8e6]"
                  style={{ borderTopWidth: i === 0 ? "1.5px" : "0.5px" }}
                >
                  <div className="flex gap-[8px] items-center flex-wrap">
                    <span className="font-mono text-[14px] bg-panel rounded-[4px] px-[4px] py-[2px] inline-block">
                      {row.label}
                    </span>
                    {row.desc && (
                      <span className="text-muted">{row.desc}</span>
                    )}
                  </div>
                  <span>{row.action}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-muted text-[14px] leading-[1.5]">
            *No match has 4 different categories with different recoveries.
            Generic fallback, Family-on-behalf, Name change, and Clinic data
            error.
          </p>
        </div>

        {/* #2 — Label-only evals lie */}
        <div className="flex flex-col gap-[16px] mt-[32px]">
          <p className="text-body font-medium">
            <span className="text-muted">#2 - </span>
            <span>Label-only evals lie.</span>
          </p>
          <p>
            First scorer asked: right label? 20 of 20. Looked great. I added
            a second scorer for the reasoning. 15 of 20 — the agent was
            getting Family-on-behalf cases right by saying &ldquo;no record
            exists,&rdquo; missing the recovery entirely.
          </p>

          <div className="overflow-x-auto -mx-[12px] px-[12px] md:mx-0 md:px-0">
            <div className="min-w-[480px]">
              <p className="text-muted py-[12px]">
                The reasoning-score-by-label
              </p>
              {[
                { label: "confident", score: "4.50" },
                { label: "ambiguous", score: "4.50" },
                { label: "no_match", score: "2.75" },
                { label: "system_error", score: "5.00" },
              ].map((row, i) => (
                <div
                  key={row.label}
                  className="grid grid-cols-2 gap-[16px] py-[12px] border-t border-[#e9e8e6]"
                  style={{ borderTopWidth: i === 0 ? "1.5px" : "0.5px" }}
                >
                  <span className="font-mono text-[14px] bg-panel rounded-[4px] px-[4px] py-[2px] inline-block w-fit">
                    {row.label}
                  </span>
                  <span className="relative inline-block w-fit">
                    {row.score} <span className="text-muted">/ 5</span>
                    {row.label === "no_match" && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src="/work/clinic-ai-assistant/Circle.svg"
                        alt=""
                        width={60}
                        height={28}
                        aria-hidden
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[1.1] pointer-events-none"
                      />
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* #3 — Sometimes the eval is grading the wrong thing */}
        <div className="flex flex-col gap-[16px] mt-[32px]">
          <p className="text-body font-medium">
            <span className="text-muted">#3 - </span>
            <span>Sometimes the eval is grading the wrong thing.</span>
          </p>
          <p>
            Two of my scenarios were indistinguishable at the input layer.
            Both cases caller said their own name and DOB, and got zero
            results. But one is because of misheard ASR, the other is family
            calling on behalf.
          </p>
          <p>
            Same input. Different recoveries. No prompt could separate them
            — the fix lived upstream. The voice agent had to ask{" "}
            <em>&ldquo;is this for yourself or someone else?&rdquo;</em>{" "}
            before verification ever ran.
          </p>
        </div>
      </CaseStudySection>

      <SectionDivider />

      <CaseStudySection label="Tuning the voice agent" labelClassName="text-[18px]">
        {/* #1 — Picking the model */}
        <div className="flex flex-col gap-[16px]">
          <p className="text-body font-medium">
            <span className="text-muted">#1 - </span>
            <span>Picking the model</span>
          </p>
          <p>
            We started on{" "}
            <span className="text-header">ElevenLabs Turbo</span> for the
            ease of use and warm preset voices, but under HIPAA-routed
            production traffic the latency was bad enough that callers were
            hanging up. After three months we switched to{" "}
            <span className="text-header">OpenAI Realtime</span> — ~3× the
            per-minute cost, fewer voices, none as warm — and traded
            warmth for presence.
          </p>

          <div className="mt-[8px] overflow-x-auto -mx-[12px] px-[12px] md:mx-0 md:px-0">
            <div className="min-w-[540px]">
              <div className="grid grid-cols-[116px_1fr_1fr] gap-[16px] py-[12px] text-muted">
                <span />
                <span>ElevenLabs Turbo</span>
                <span>OpenAI Realtime</span>
              </div>
              {[
                {
                  label: "Latency",
                  a: "High — call hangs up",
                  b: "Low — feels present",
                },
                {
                  label: "Architecture",
                  a: "ASR → LLM → TTS",
                  b: "Speech-to-speech",
                },
                {
                  label: "Voice quality",
                  a: "Great (3000+ voices)",
                  b: "Limited (6–7 preset)",
                },
                {
                  label: "Price",
                  a: "~ $0.10/min",
                  b: "~ $0.30/min",
                },
                {
                  label: "Verdict",
                  a: "Easy to start, wrong substrate",
                  b: "3× cost, but the product",
                  emphasis: true,
                },
              ].map((row, i) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[116px_1fr_1fr] gap-[16px] py-[12px] border-t border-[#e9e8e6]"
                  style={{ borderTopWidth: i === 0 ? "1.5px" : "0.5px" }}
                >
                  <span
                    className={`text-muted ${row.emphasis ? "font-medium" : ""}`}
                  >
                    {row.label}
                  </span>
                  <span className={row.emphasis ? "font-medium" : ""}>
                    {row.a}
                  </span>
                  <span className={row.emphasis ? "font-medium" : ""}>
                    {row.b}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-[32px]">
          <p className="text-body font-medium">
            <span className="text-muted">#2 - </span>
            <span>Iterating on the prompt</span>
          </p>
        </div>

        <p>
          Once the substrate worked, the agent still didn&apos;t. It repeated,
          over-confirmed, and patients hung up. I worked from one principle:{" "}
          <span className="text-header">
            a friendly agent is one that trusts what it heard.
          </span>{" "}
          Every iteration removed a redundant confirm, a re-ask, or a fallback
          that fired too eagerly. I ran each version against a bench of
          recorded calls and tracked repetition rate and abandonment as the
          two metrics that mattered.
        </p>

        <p className="text-muted text-[14px] leading-[1.5] mt-[16px]">
          Quote from a user interview
        </p>
        <div className="bg-panel rounded-[6px] p-[12px] -mt-[8px]">
          <p className="font-['NType_82'] text-[14px] md:text-[18px] xl:text-[20px] leading-[1.3]">
            “She repeats back like five times. And patients get frustrated that she keeps
            repeating the same thing and they just hang up.”
          </p>
          <p className="text-muted text-[14px] leading-[1.5] mt-[24px]">
            Casey Cash, owner at The Iris Center
          </p>
        </div>

        <p className="text-muted text-[14px] leading-[1.5] mt-[16px]">
          Prompt iteration to reduce repetition
        </p>
        <div className="-mt-[8px]">
          <PromptCard />
        </div>

        <div className="mt-[32px]">
          <p className="text-body font-medium">
            <span className="text-muted">#3 - </span>
            <span>Impact</span>
          </p>
        </div>

        <p>
          Across the substrate switch and prompt iteration, call
          abandonment dropped from{" "}
          <span className="text-header">32.6% to 10.6%</span>.
        </p>
        <iframe
          src="/work/clinic-ai-assistant/abandonment-rate-chart.html"
          title="Call abandonment rate over time"
          className="w-full block border-0 -mt-[8px]"
          style={{ height: 320 }}
        />
        <p className="text-muted text-[14px] leading-[1.5] -mt-[8px]">
          % of calls where the patient hung up
        </p>
      </CaseStudySection>

      <SectionDivider />

      <CaseStudySection label="Shipping the product" labelClassName="text-[18px]">
        <div className="flex flex-col gap-[16px]">
          <p>
            <span className="font-medium">Where it landed.</span> 102 clinics,
            $1M+ ARR. Abandonment{" "}
            <span className="text-header">32.6% → 10.6%</span>.
          </p>
          <p>
            <span className="font-medium">What I&apos;d take back.</span> We
            traded voice warmth for latency and never revisited it. The next
            version should test a custom voice clone or a hybrid route for
            high-stakes calls.
          </p>
          <p>
            <span className="font-medium">What&apos;s next.</span> Scheduling
            has ~3× the failure modes of verification and no eval taxonomy
            yet. That&apos;s the next thing I&apos;d design.
          </p>
        </div>

        <div className="bg-panel rounded-[6px] p-[12px] mt-[16px]">
          <p className="font-['NType_82'] text-[14px] md:text-[18px] xl:text-[20px] leading-[1.3]">
            “I&apos;ve been very impressed with everything. This is obviously
            the right way to go — AI automation for the front desk for sure.”
          </p>
          <p className="text-muted text-[14px] leading-[1.5] mt-[24px]">
            Manoj Doss, owner at Institute for Integrative Therapies
          </p>
        </div>
      </CaseStudySection>
    </CaseStudyLayout>
  );
}
