import type { ReactNode } from "react";

interface CaseStudySectionProps {
  label: ReactNode;
  children: ReactNode;
  /** Retained for back-compat with sub-section blocks (#1, #2 …). No
   *  visual effect under the new TOC layout — kept so existing call
   *  sites compile without changes. */
  noDivider?: boolean;
  /** Optional muted subtitle rendered directly under the title with no
   *  vertical gap. Used for context like "Nov 2025 - present • Freed". */
  subtitle?: ReactNode;
  /** Suppress this section from the TOC sidebar. The id and inline
   *  title still render so anchors and the body title work. Used for
   *  the case-study-name hero section that would otherwise duplicate
   *  the page title. */
  noToc?: boolean;
  /** Extra className applied to the title `<p>`. Use for per-case-study
   *  size overrides without changing the base `text-header` token. */
  labelClassName?: string;
}

function slugify(label: ReactNode): string | undefined {
  if (typeof label !== "string") return undefined;
  const trimmed = label.trim();
  if (!trimmed) return undefined;
  return trimmed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function CaseStudySection({
  label,
  children,
  subtitle,
  noToc = false,
  labelClassName = "",
}: CaseStudySectionProps) {
  const id = slugify(label);
  const showTitle = typeof label === "string" && label.trim().length > 0;

  return (
    <section
      id={id}
      data-toc-label={showTitle && !noToc ? (label as string) : undefined}
      className="flex flex-col scroll-mt-[120px]"
    >
      {showTitle && (
        <div className="mb-[32px]">
          <p className={`text-section-header ${labelClassName}`}>{label}</p>
          {subtitle && <p className="text-muted">{subtitle}</p>}
        </div>
      )}
      <div className="flex flex-col gap-[16px]">{children}</div>
    </section>
  );
}
