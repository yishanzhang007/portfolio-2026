import { CaseStudyHero } from "@/components/CaseStudyHero";
import { CaseStudyLayout } from "@/components/CaseStudyLayout";
import { CaseStudySection } from "@/components/CaseStudySection";

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
        <p className="text-muted">Case study coming soon.</p>
      </CaseStudySection>
    </CaseStudyLayout>
  );
}
