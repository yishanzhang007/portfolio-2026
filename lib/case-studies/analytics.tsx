import { CaseStudyImageHero } from "@/components/CaseStudyImageHero";
import { CaseStudyLayout } from "@/components/CaseStudyLayout";
import { CaseStudySection } from "@/components/CaseStudySection";

export function Analytics() {
  return (
    <CaseStudyLayout
      hero={
        <>
          <CaseStudyImageHero
            src="/work/clinic-ai-assistant/Analytics%201@3x.png"
            alt="Analytics — chart 1."
            width={1293}
            height={828}
            rounded
          />
          <div className="-mt-[4px] md:mt-0">
            <CaseStudyImageHero
              src="/work/clinic-ai-assistant/Analytics%202@3x.png"
              alt="Analytics — chart 2."
              width={1293}
              height={880}
              rounded
              stacked
            />
          </div>
        </>
      }
    >
      <CaseStudySection label="DevRev Analytics">
        <p>
          At DevRev I built analytics from zero to one — a design system for
          charts and the dashboards on top of it. The product became one of
          the company&apos;s key verticals.
        </p>
      </CaseStudySection>
    </CaseStudyLayout>
  );
}
