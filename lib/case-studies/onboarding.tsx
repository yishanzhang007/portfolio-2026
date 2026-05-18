import { CaseStudyLayout } from "@/components/CaseStudyLayout";
import { CaseStudySection } from "@/components/CaseStudySection";

/* Onboarding hero — two SVGs side-by-side (1 left, 2 right), vertically
   centered. Tile background matches the Clinic AI Assistant hero. */
function OnboardingHero() {
  return (
    <section className="w-full pt-[12px] md:pt-[48px] px-[12px] md:px-[16px] overflow-hidden">
      <div
        style={{ backgroundColor: "#F1F1EE" }}
        className="w-full max-w-[1320px] mx-auto rounded-[6px] md:rounded-[8px] flex items-center justify-center gap-[24px] md:gap-[48px] py-[48px] md:py-[64px] px-[24px] md:px-[64px] overflow-hidden"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/work/clinic-ai-assistant/Onboarding1@3x.png"
          alt="Onboarding — step 1."
          width={448}
          height={215}
          className="block w-1/2 h-auto"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/work/clinic-ai-assistant/Onboarding2@3x.png"
          alt="Onboarding — step 2."
          width={432}
          height={417}
          className="block w-1/2 h-auto"
        />
      </div>
    </section>
  );
}

export function Onboarding() {
  return (
    <CaseStudyLayout hero={<OnboardingHero />}>
      <CaseStudySection label="Onboarding">
        <p>
          Clinics pick their clinic from Google Maps; we auto-fill their hours,
          address, and website. Signup-to-finish completion rose 40%+.
        </p>
        <p className="text-muted">Case study coming soon.</p>
      </CaseStudySection>
    </CaseStudyLayout>
  );
}
