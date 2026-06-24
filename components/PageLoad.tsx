"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

/* Fires once on initial route render — paired with `Reveal`, which uses
   whileInView for scroll-triggered reveals. Use this at the top of a page
   (landing, case study) so the first paint fades in gently instead of snapping. */
export function PageLoad({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fonts = document.fonts;

    if (!fonts || fonts.status === "loaded") {
      setFontsReady(true);
      return;
    }

    fonts.ready.then(() => {
      if (!cancelled) setFontsReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: fontsReady ? 1 : 0 }}
      transition={{ duration: 0.7, ease: "linear" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
