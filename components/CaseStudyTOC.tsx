"use client";

import { useEffect, useState } from "react";
import { hoverUnderline } from "@/lib/style";
import { BackArrowIcon } from "./BackArrowIcon";

type Item = { id: string; label: string };

export function CaseStudyTOC({ showSections = false }: { showSections?: boolean }) {
  const [items, setItems] = useState<Item[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!showSections) return;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-toc-label]"),
    ).filter((s) => s.id);

    const collected: Item[] = sections.map((s) => ({
      id: s.id,
      label: s.dataset.tocLabel ?? "",
    }));
    setItems(collected);
    if (collected.length === 0) return;

    // Active section = the last one whose top has scrolled past the
    // threshold (~50% from the viewport top — the vertical midpoint).
    // Recomputed on every scroll/resize so the highlight always
    // reflects what's in view, including the last section at max
    // scroll.
    const pickActive = () => {
      const threshold = window.innerHeight * 0.5;
      // Start with no candidate — until a section's top has actually
      // crossed the threshold, the TOC stays unhighlighted (all grey).
      // Avoids the bug where the first list item flashed active before
      // the user scrolled into it.
      let candidate: string | null = null;
      for (const item of collected) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= threshold) candidate = item.id;
      }
      // At max scroll a short last section's top may never cross the
      // threshold — pin it active so the highlight reaches the end.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) candidate = collected[collected.length - 1].id;
      setActiveId(candidate);
    };

    let raf = 0;
    const onScrollOrResize = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        pickActive();
        raf = 0;
      });
    };

    pickActive();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [showSections]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <div className="hidden md:block w-[320px] shrink-0">
      <nav
        aria-label="Case study sections"
        className="sticky top-[80px] flex flex-col"
      >
        <a
          href="/"
          className={`flex items-center gap-[8px] text-body text-muted mb-[40px] ${hoverUnderline}`}
        >
          <BackArrowIcon />
          <span>Index</span>
        </a>
        {showSections && items.length > 0 && (
          <ul className="flex flex-col gap-[4px]">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={activeId === item.id ? "true" : undefined}
                  onClick={(e) => handleClick(e, item.id)}
                  className={`text-body transition-colors duration-150 ${
                    activeId === item.id ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </div>
  );
}
