import { CaseStudyHero } from "@/components/CaseStudyHero";
import { CaseStudyLayout } from "@/components/CaseStudyLayout";
import { CaseStudySection } from "@/components/CaseStudySection";

export function AgentPlayground() {
  return (
    <CaseStudyLayout
      hero={
        <CaseStudyHero
          src="/work/clinic-ai-assistant/Agent%20playground.svg"
          srcMobile="/work/clinic-ai-assistant/Agent%20playground.png"
          alt="Agent playground — interface for configuring, testing, and deploying conversational agents."
          width={1168}
          height={1042}
          tileColor="#F1F1EE"
          imageInsetTop={80}
          imageInsetBottom={40}
          imageBordered
        />
      }
    >
      <CaseStudySection label="Agent playground">
        <p>
          Clinic staff run mock calls against the AI agent, tune how it
          responds, and ship updates to patients — all from one playground.
        </p>
        <p className="text-muted">Case study coming soon.</p>
      </CaseStudySection>
    </CaseStudyLayout>
  );
}
