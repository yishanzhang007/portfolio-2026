import { CaseStudyImageHero } from "@/components/CaseStudyImageHero";
import { CaseStudyLayout } from "@/components/CaseStudyLayout";
import { CaseStudySection } from "@/components/CaseStudySection";

export function Orchid() {
  return (
    <CaseStudyLayout
      hero={
        <CaseStudyImageHero
          src="/work/clinic-ai-assistant/Orchid.svg"
          alt="Orchid — branding exploration."
          width={1303}
          height={936}
          bordered
          rounded
        />
      }
    >
      <CaseStudySection label="Orchid Branding">
        <p>
          For Orchid, a healthcare company, I defined the brand language and
          applied it across their landing page and marketing assets.
        </p>
      </CaseStudySection>
    </CaseStudyLayout>
  );
}
