import type { ReactNode } from "react";
import { CaseStudyTOC } from "./CaseStudyTOC";
import { PageLoad } from "./PageLoad";
import { Reveal } from "./PageReveal";

interface CaseStudyLayoutProps {
  hero: ReactNode;
  prelude?: ReactNode;
  /** Optional content rendered between the hero and the TOC+body grid.
   *  Used by the clinic AI case study for the inbox-agent animation. The
   *  TOC sticky-anchors 120px below this slot so the animation plays
   *  before the TOC enters its sticky region. */
  intro?: ReactNode;
  /** When true, the left TOC lists each `CaseStudySection` label as a
   *  scrollspy menu under "Index". Default false — TOC shows only the
   *  Index link. Enabled on the clinic AI case study. */
  showTocSections?: boolean;
  /** When true, render an Index link on mobile (md-) directly above
   *  the body content (the desktop TOC already includes one). 24px gap
   *  above and below. */
  showMobileIndex?: boolean;
  children: ReactNode;
}

export function CaseStudyLayout({
  hero,
  prelude,
  intro,
  showTocSections = false,
  showMobileIndex = true,
  children,
}: CaseStudyLayoutProps) {
  return (
    <PageLoad>
    <main className="min-h-screen bg-cream overflow-x-clip text-ink text-body">
      {prelude && (
        <Reveal>
          <div className="mx-auto w-full max-w-[960px] px-[12px] md:px-[16px] mt-[40px] mb-[8px]">
            {prelude}
          </div>
        </Reveal>
      )}
      {hero}
      {intro && (
        <div className="mx-auto w-full max-w-[960px] px-[12px] md:px-[16px] pt-[12px] md:pt-[48px] md:mb-[80px]">
          {intro}
        </div>
      )}
      <div
        className={`case-study-body mx-auto w-full max-w-[960px] px-[12px] md:px-[16px] pb-[12px] md:pb-[80px] md:flex md:flex-row md:justify-center ${
          intro ? "" : "md:pt-[64px]"
        }`}
      >
        <CaseStudyTOC showSections={showTocSections} />
        <div className="w-full md:w-[640px] flex flex-col">
          {showMobileIndex && (
            <a
              href="/"
              className="md:hidden inline-flex items-center gap-[8px] text-body text-muted mt-[48px] mb-[48px] hover:underline hover:[text-decoration-color:var(--color-underline)] hover:[text-decoration-thickness:10%] hover:[text-underline-offset:0.2em]"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
                className="shrink-0"
              >
                <path d="M9 14L4 9L9 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20 20v-7a4 4 0 0 0-4-4H4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Index</span>
            </a>
          )}
          {children}
        </div>
      </div>
    </main>
    </PageLoad>
  );
}

export function SectionDivider() {
  return <div className="mt-[88px] sm:mt-[96px] md:mt-[64px] mb-[24px]" />;
}
