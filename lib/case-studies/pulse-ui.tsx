import { CaseStudyLayout } from "@/components/CaseStudyLayout";
import { CaseStudySection } from "@/components/CaseStudySection";

export function PulseUI() {
  return (
    <CaseStudyLayout hero={<PulseHero />}>
      <CaseStudySection label="Pulse UI">
        <p>
          I designed and launched Freed&rsquo;s first design system Pulse UI.
          It was built to accelerate AI coding. After we roll out the component,
          it has increased implementation velocity across 3 product pods, as
          well as improving product quality and consistency.
        </p>
      </CaseStudySection>
    </CaseStudyLayout>
  );
}

/* Pulse hero — same outer page padding as `CaseStudyHero` but no dark tile.
   The SVG is shown directly inside a bordered, rounded frame. */
function PulseHero() {
  return (
    <section className="w-full pt-[12px] md:pt-[48px] px-[12px] md:px-[16px] overflow-hidden">
      <div className="w-full max-w-[1320px] mx-auto rounded-[6px] md:rounded-[8px] border-[0.5px] border-[rgba(76,76,59,0.3)] overflow-hidden">
        {/* Mobile: PNG export (sharper on iOS than the large SVG). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/work/clinic-ai-assistant/Pulse.png"
          alt="Pulse UI — design system overview."
          className="block md:hidden w-full h-auto"
        />
        {/* Desktop: original SVG. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/work/clinic-ai-assistant/Pulse.svg"
          alt="Pulse UI — design system overview."
          className="hidden md:block w-full h-auto"
        />
      </div>
    </section>
  );
}
