import { CaseStudyHero } from "@/components/CaseStudyHero";
import { CaseStudyLayout, SectionDivider } from "@/components/CaseStudyLayout";
import { CaseStudySection } from "@/components/CaseStudySection";

const ROWS: {
  principle: string;
  signal: string;
  prompt: string;
  behavior: React.ReactNode;
}[] = [
  {
    principle: "Sound human.",
    signal:
      "“That was a dead giveaway — it read the numbers back really fast. No human reads numbers back that fast.” — Dr. Salas",
    prompt:
      "Speak times and phone numbers like a person. “Three-thirty Friday,” not “three-three-zero P-M.” If the patient asks for a number, group the digits: “415, 555, 1234.”",
    behavior:
      "The “dead giveaway” pattern stopped surfacing in test calls within one prompt revision.",
  },
  {
    principle: "Never trap the patient.",
    signal:
      "“She repeats back like five times. Patients get frustrated and just hang up.” — Casey Cash",
    prompt:
      "If the patient hesitates twice on the same question, don't ask a third time. Offer to text them the details: “No problem — I can send this in a text, would that be easier?” Then transfer to the inbox.",
    behavior: (
      <>
        Call abandonment rate fell{" "}
        <span className="font-medium">32.6% → 10.6%</span> over four prompt
        revisions.
      </>
    ),
  },
  {
    principle: "Front desk, not doctor.",
    signal:
      "The most consistent worry across 40+ clinic interviews was an AI giving medical advice.",
    prompt:
      "Never answer clinical questions, ever — even ones that sound benign. Default response: “That's a great question for your provider — I'll make sure they follow up. Anything else I can help with?”",
    behavior: (
      <>
        <span className="font-medium">Zero clinical-advice incidents</span>{" "}
        flagged across 10K+ production calls.
      </>
    ),
  },
];

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
          A principle is a wish. A prompt is the rule that turns the wish
          into a constraint on the model. The behavior is what proves the
          constraint actually held. Here&apos;s how three of the voice
          agent&apos;s principles ran through that loop.
        </p>

        <div className="overflow-x-auto -mx-[12px] px-[12px] md:mx-0 md:px-0">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-[1fr_1.5fr_1fr] gap-[16px] py-[12px] text-muted">
              <span>Principle</span>
              <span>Prompt language</span>
              <span>Observable behavior</span>
            </div>
            {ROWS.map((row, i) => (
              <div
                key={row.principle}
                className="grid grid-cols-[1fr_1.5fr_1fr] gap-[16px] py-[16px] border-t border-[#e9e8e6]"
                style={{ borderTopWidth: i === 0 ? "1.5px" : "0.5px" }}
              >
                <div className="flex flex-col gap-[8px]">
                  <span className="font-medium">{row.principle}</span>
                  <span className="text-muted text-[14px] leading-[1.5] italic">
                    {row.signal}
                  </span>
                </div>
                <span className="italic">{row.prompt}</span>
                <span>{row.behavior}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-muted italic">
          A principle without a measurable behavior is a wish. The reason
          the agent shipped to 102 clinics wasn&apos;t that we wrote good
          principles — it&apos;s that every principle had a prompt that
          enforced it and a number that proved it.
        </p>
      </CaseStudySection>
    </CaseStudyLayout>
  );
}
