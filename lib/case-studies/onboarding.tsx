import { CaseStudyLayout } from "@/components/CaseStudyLayout";
import { CaseStudySection } from "@/components/CaseStudySection";

/* Onboarding hero — two SVGs side-by-side (1 left, 2 right), vertically
   centered on desktop. Mobile uses a single flat PNG that combines both
   panes into one image (sharper on iOS than the SVG pair). Tile background
   matches the Clinic AI Assistant hero. */
function OnboardingHero() {
  return (
    <section className="w-full pt-[12px] md:pt-[48px] px-[12px] md:px-[16px] overflow-hidden">
      <div
        style={{ backgroundColor: "#F1F1EE" }}
        className="w-full max-w-[1320px] mx-auto rounded-[6px] md:rounded-[8px] flex items-center justify-center gap-[24px] md:gap-[48px] py-[48px] md:py-[64px] px-[24px] md:px-[64px] overflow-hidden"
      >
        {/* Mobile: single combined PNG. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/work/clinic-ai-assistant/Onboarding.png"
          alt="Onboarding — autocomplete and detail steps."
          className="block md:hidden w-full h-auto"
        />
        {/* Desktop: original 2 SVGs side-by-side. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/work/clinic-ai-assistant/Onboarding1.svg"
          alt="Onboarding — step 1."
          width={448}
          height={215}
          className="hidden md:block w-1/2 h-auto"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/work/clinic-ai-assistant/Onboarding2.svg"
          alt="Onboarding — step 2."
          width={432}
          height={417}
          className="hidden md:block w-1/2 h-auto"
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
