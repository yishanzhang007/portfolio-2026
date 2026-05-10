import { CaseStudyImageHero } from "@/components/CaseStudyImageHero";
import { CaseStudyLayout } from "@/components/CaseStudyLayout";
import { CaseStudySection } from "@/components/CaseStudySection";

export function SoutheastCommunityCenter() {
  return (
    <CaseStudyLayout
      hero={
        <>
          <CaseStudyImageHero
            src="/work/clinic-ai-assistant/Southeast%202.svg"
            alt="Southeast Community Center — architectural drawing 2."
            width={1293}
            height={828}
            rounded
          />
          <div className="-mt-[4px] md:mt-0">
            <CaseStudyImageHero
              src="/work/clinic-ai-assistant/Southeast%201.svg"
              alt="Southeast Community Center — architectural drawing 1."
              width={1293}
              height={781}
              rounded
              stacked
            />
          </div>
        </>
      }
    >
      <CaseStudySection label="Southeast Community Center">
        <p>
          As an architect at SF Public Works, I was part of a 100+ person
          cross-functional team that designed the Southeast Community Center.
          Construction completed in 2023, and the building now welcomes
          thousands of community members every week.
        </p>
      </CaseStudySection>
    </CaseStudyLayout>
  );
}
