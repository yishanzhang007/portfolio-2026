import { CaseStudyImageHero } from "@/components/CaseStudyImageHero";
import { CaseStudyLayout } from "@/components/CaseStudyLayout";
import { CaseStudySection } from "@/components/CaseStudySection";

export function Joy() {
  return (
    <CaseStudyLayout
      hero={
        <div className="-mt-[4px] md:mt-0">
          <CaseStudyImageHero
            src="/work/clinic-ai-assistant/Joy@3x.png"
            alt="Joy — typography exploration."
            width={1303}
            height={936}
            bordered
            rounded
          />
        </div>
      }
    >
      <CaseStudySection label="Joy Typeface">
        <p>
          A classic, elegant typeface I drew from scratch. I named it Joy
          because that&apos;s how pushing every pixel felt.
        </p>
      </CaseStudySection>
    </CaseStudyLayout>
  );
}
