"use client";

import { useCallback, useEffect, useRef } from "react";

const POINTS = 128;
const TWO_PI = Math.PI * 2;
const SIZE = 200;

export function OnboardingHero({ visible = false }: { visible?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const maxRadius = Math.min(w, h) * 0.37;

    timeRef.current += 0.032;
    const t = timeRef.current;

    const lerpColor = (
      r1: number,
      g1: number,
      b1: number,
      r2: number,
      g2: number,
      b2: number,
      tt: number,
    ) => [
      Math.round(r1 + (r2 - r1) * tt),
      Math.round(g1 + (g2 - g1) * tt),
      Math.round(b1 + (b2 - b1) * tt),
    ];

    // Idle palette — blue↔purple lerp at 0.5 = bluish-purple.
    const [cr, cg, cb] = lerpColor(80, 160, 255, 170, 70, 255, 0.5);
    const [mr, mg, mb] = lerpColor(90, 140, 255, 185, 80, 255, 0.5);

    const breathe = 1 + Math.sin(t * 1.2) * 0.06;
    const baseRadius = maxRadius * breathe;

    // 3-layer outer glow.
    for (let layer = 3; layer >= 1; layer--) {
      const glowRadius = baseRadius + layer * 16;
      const glowAlpha = 0.02 * (1 / layer);

      const glowGrad = ctx.createRadialGradient(
        cx,
        cy,
        baseRadius * 0.5,
        cx,
        cy,
        glowRadius,
      );
      glowGrad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${glowAlpha})`);
      glowGrad.addColorStop(0.5, `rgba(${mr}, ${mg}, ${mb}, ${glowAlpha * 0.5})`);
      glowGrad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);

      ctx.beginPath();
      ctx.arc(cx, cy, glowRadius, 0, TWO_PI);
      ctx.fillStyle = glowGrad;
      ctx.fill();
    }

    // Perimeter points with idle wobble.
    const points: Array<[number, number]> = [];
    for (let i = 0; i < POINTS; i++) {
      const angle = (i / POINTS) * TWO_PI;

      const idleWobble =
        Math.sin(angle * 2 + t * 0.5) * 3.5 +
        Math.sin(angle * 3 + t * 0.7) * 2.0 +
        Math.sin(angle * 5 + t * 0.3) * 1.0;

      const r = baseRadius + idleWobble;
      points.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]);
    }

    // Cardinal spline through the points.
    ctx.beginPath();
    if (points.length > 2) {
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 0; i < points.length; i++) {
        const p0 = points[(i - 1 + points.length) % points.length];
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];
        const p3 = points[(i + 2) % points.length];

        const tension = 0.35;
        const cp1x = p1[0] + (p2[0] - p0[0]) * tension;
        const cp1y = p1[1] + (p2[1] - p0[1]) * tension;
        const cp2x = p2[0] - (p3[0] - p1[0]) * tension;
        const cp2y = p2[1] - (p3[1] - p1[1]) * tension;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2[0], p2[1]);
      }
    }
    ctx.closePath();

    // Main radial fill.
    const fillGrad = ctx.createRadialGradient(
      cx - baseRadius * 0.2,
      cy - baseRadius * 0.2,
      baseRadius * 0.1,
      cx,
      cy,
      baseRadius * 1.2,
    );
    fillGrad.addColorStop(0, "rgba(190, 215, 255, 0.95)");
    fillGrad.addColorStop(0.3, `rgba(${cr}, ${cg}, ${cb}, 0.9)`);
    fillGrad.addColorStop(0.7, `rgba(${mr}, ${mg}, ${mb}, 0.6)`);
    fillGrad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
    ctx.fillStyle = fillGrad;
    ctx.fill();

    // Inner highlight (top-left light spot).
    const highlightGrad = ctx.createRadialGradient(
      cx - baseRadius * 0.25,
      cy - baseRadius * 0.3,
      0,
      cx - baseRadius * 0.1,
      cy - baseRadius * 0.1,
      baseRadius * 0.6,
    );
    highlightGrad.addColorStop(0, "rgba(255, 255, 255, 0.35)");
    highlightGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.08)");
    highlightGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = highlightGrad;
    ctx.fill();

    // Subtle edge stroke.
    ctx.strokeStyle = `rgba(${mr}, ${mg}, ${mb}, 0.08)`;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Center glow with slow pulse.
    const centerGlowSize = baseRadius * 0.4;
    const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, centerGlowSize);
    const centerAlpha = 0.06 + Math.sin(t * 1.5) * 0.03;
    centerGrad.addColorStop(0, `rgba(255, 255, 255, ${centerAlpha})`);
    centerGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.beginPath();
    ctx.arc(cx, cy, centerGlowSize, 0, TWO_PI);
    ctx.fillStyle = centerGrad;
    ctx.fill();

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    if (!visible) return;
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible, draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: SIZE,
        height: SIZE,
        display: "block",
        pointerEvents: "none",
      }}
    />
  );
}
