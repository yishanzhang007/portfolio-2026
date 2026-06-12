import { AgentPlaygroundFinalUi } from "@/components/AgentPlaygroundFinalUi";
import { CaseStudyLayout } from "@/components/CaseStudyLayout";
import { CaseStudySection } from "@/components/CaseStudySection";

export function AgentPlayground() {
  return (
    <CaseStudyLayout
      hero={<AgentPlaygroundFinalUi />}
    >
      <CaseStudySection label="Agent customization">
        <p>
          Freed built a one-size-fits all voice agent, but clinics aren't one size fit all. We want to build the toolkit to allow clinics to customize their own voice agent.
        </p>
        <p className="text-muted">Case study coming soon.</p>
      </CaseStudySection>
    </CaseStudyLayout>
  );
}
