import { CaseStudyLayout } from "@/components/CaseStudyLayout";
import { CaseStudySection } from "@/components/CaseStudySection";
import type { Project } from "@/lib/projects";

/* Generic case-study placeholder. Mirrors the structure of the
   clinic-ai-assistant case study (hero tile on top, sectioned content
   below) so every project in /lib/projects renders into the same
   shell — only the copy differs. */

export function CaseStudyPlaceholder({ project }: { project: Project }) {
  return (
    <CaseStudyLayout hero={<PlaceholderHero title={project.title} />}>
      <CaseStudySection label={project.title}>
        <p>
          Case study for {project.title.trim()} is in progress.
          {project.roles.length > 0 && (
            <>
              {" "}
              Worked on this project as{" "}
              <span className="text-header">
                {project.roles.join(", ")}
              </span>
              .
            </>
          )}
        </p>
      </CaseStudySection>
    </CaseStudyLayout>
  );
}

/* Hero stand-in. Same outer + tile shell as `CaseStudyHero` but with
   the project title centered inside the gray tile in place of an
   image. Same `bg-[#464644]`, `rounded-[8px]`, max-width cap, and the
   16px gutter that turns on at sm+. */

function PlaceholderHero({ title }: { title: string }) {
  return (
    <section className="w-full pt-[12px] md:pt-[48px] px-[12px] md:px-[16px] overflow-hidden">
      <div className="w-full max-w-[1320px] mx-auto bg-[#464644] rounded-[6px] md:rounded-[8px] h-[400px] md:h-[500px] xl:h-[700px] flex items-center justify-center px-[24px] overflow-hidden">
        <h1 className="text-[#fdfdfc] font-medium text-[40px] md:text-[64px] xl:text-[80px] leading-[1.1] text-center">
          {title.trim()}
        </h1>
      </div>
    </section>
  );
}
