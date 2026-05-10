"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const easeOutCubic = [0.215, 0.61, 0.355, 1] as const;

/* Fires once on initial route render — paired with `Reveal`, which uses
   whileInView for scroll-triggered reveals. Use this at the top of a page
   (landing, case study) so the first paint settles in instead of snapping. */
export function PageLoad({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: easeOutCubic }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
