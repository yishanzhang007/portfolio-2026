import { CaseStudyHero } from "@/components/CaseStudyHero";
import { CaseStudyLayout } from "@/components/CaseStudyLayout";
import { CaseStudySection } from "@/components/CaseStudySection";

export function TradingVault() {
  return (
    <CaseStudyLayout
      hero={
        <CaseStudyHero
          src="/work/clinic-ai-assistant/Trading%20vault.svg"
          alt="Trading vault — interface."
          width={1235}
          height={786}
          tileColor="#F1F1EE"
          imageBordered
        />
      }
    >
      <CaseStudySection label="Trading vault">
        <p>
          Case study for Trading vault is in progress. Worked on this project as{" "}
          <span className="text-header">Design</span>.
        </p>
      </CaseStudySection>
    </CaseStudyLayout>
  );
}
