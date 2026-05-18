interface CaseStudyHeroProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  tileColor?: string;
  tileHeight?: number;
  tileMaxWidth?: number;
  /** Negative bottom margin on the image (the bottom-bleed clip).
   *  Default 168px. Lower = more of the image visible at the bottom and a
   *  taller tile. */
  bottomClip?: number;
  /** Horizontal padding (per side, in px) between the image and the tile
   *  frame at md+. Default 24px. */
  imageInsetX?: number;
  /** Top padding between the tile and the image, in px. Default 64px.
   *  Ignored when `centered` or `pinBottom` is true. */
  imageInsetTop?: number;
  /** Optional bottom padding inside the tile, in px. Default 0. Adds a
   *  fluid `clamp(0px, …vw, Npx)` band below the image, growing the tile
   *  by up to N at design width. The image's negative bottom-bleed margin
   *  still applies, but the visible bleed shrinks by this amount. */
  imageInsetBottom?: number;
  bordered?: boolean;
  /** When true, the image is vertically centered inside the tile and the
   *  bottom-clip behavior (negative margin + 64px top padding) is dropped.
   *  Use for tiles with an explicit `tileHeight` where the image fits
   *  inside without needing to bleed off the bottom. */
  centered?: boolean;
  /** When true, the image is pinned to the bottom of the tile (no bleed,
   *  no top padding). Requires an explicit `tileHeight`. */
  pinBottom?: boolean;
  /** Adds a hairline border + soft drop shadow on the inner image so it
   *  reads as a "lifted" screenshot against the tile. */
  imageBordered?: boolean;
}

export function CaseStudyHero({
  src,
  alt,
  width,
  height,
  tileColor = "#464644",
  tileHeight,
  tileMaxWidth = 1320,
  bottomClip = 168,
  imageInsetX = 24,
  imageInsetTop = 64,
  imageInsetBottom = 0,
  bordered = false,
  centered = false,
  pinBottom = false,
  imageBordered = false,
}: CaseStudyHeroProps) {
  const verticalAlignClass = pinBottom
    ? "items-end"
    : centered
      ? "items-center"
      : "";
  const usesTopInset = !pinBottom && !centered;
  // "Snug centered" mode: content-hugging tile with symmetric fluid
  // padding, no bleed. Triggered by `centered` without an explicit
  // `tileHeight` (the fixed-height centered variant keeps its old
  // behavior).
  const usesSymmetricInset = centered && tileHeight === undefined;
  // Fluid inset that hits its design value (`imageInsetTop`) around a
  // 1200px viewport and floors at 24px. The vw slope is derived so any
  // upper bound stays smooth across breakpoints.
  const insetVw = (imageInsetTop / 12).toFixed(2);
  const insetExpr = `clamp(24px, ${insetVw}vw, ${imageInsetTop}px)`;
  const insetBottomVw = (imageInsetBottom / 12).toFixed(2);
  const insetBottomExpr = `clamp(0px, ${insetBottomVw}vw, ${imageInsetBottom}px)`;
  // Always clip 5% of the rendered image height from the bottom (the
  // "bleed"). Derived from the intrinsic aspect ratio so any hero image
  // gets the right clip without per-case tuning. Negatives are baked
  // inside the clamp because `-clamp(...)` is invalid CSS.
  const clipMaxPx = Math.round(height * 0.05);
  const clipVw = (5 * (height / width)).toFixed(2);
  const bottomClipExpr = `clamp(-${clipMaxPx}px, -${clipVw}vw, 0px)`;
  return (
    <section className="w-full pt-[12px] md:pt-[48px] px-[12px] md:px-[16px] overflow-hidden">
      <div
        style={{
          backgroundColor: tileColor,
          maxWidth: tileMaxWidth,
          ...(tileHeight !== undefined
            ? ({ "--tile-h": `${tileHeight}px` } as React.CSSProperties)
            : {}),
          ...(usesTopInset ? { paddingTop: insetExpr } : {}),
          ...(usesSymmetricInset ? { paddingTop: insetExpr, paddingBottom: insetExpr } : {}),
          ...(imageInsetBottom > 0 && !usesSymmetricInset
            ? { paddingBottom: insetBottomExpr }
            : {}),
        }}
        className={`w-full mx-auto rounded-[6px] md:rounded-[8px] flex justify-center overflow-hidden ${
          tileHeight !== undefined ? "md:h-[var(--tile-h)]" : ""
        } ${verticalAlignClass} ${
          bordered ? "border-[0.5px] border-[rgba(76,76,59,0.3)]" : ""
        }`}
      >
        {/* Plain <img> — Next/Image disallows SVGs by default for security.
            Image renders at its declared width, but `max-w-[calc(100%-32px)]`
            shrinks it to fit the tile when the tile is narrower than the
            image, leaving a 16px gutter on each side. h-auto keeps aspect
            ratio. In the default (non-centered) layout, the negative bottom
            margin clips the bottom of the image so it bleeds into the tile
            edge; the centered variant drops it. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          style={{
            ...(imageBordered ? { boxShadow: "0 5px 40px rgba(0, 0, 0, 0.15)" } : {}),
            ...(centered || pinBottom
              ? {}
              : ({ "--bottom-clip": bottomClipExpr } as React.CSSProperties)),
            maxWidth: `calc(100% - ${imageInsetX * 2}px)`,
            // Hint to Safari to use a sharper rasterization path for SVGs
            // displayed via <img>. Mitigates the iOS "blurry SVG" bug where
            // large/complex SVGs get cached as a low-res bitmap.
            imageRendering: "-webkit-optimize-contrast",
          }}
          className={`max-w-[calc(100%-24px)] h-auto rounded-[8px] ${
            centered || pinBottom ? "" : "mb-[var(--bottom-clip)]"
          } ${imageBordered ? "border-[0.5px] border-[rgba(76,76,59,0.3)]" : ""}`}
        />
      </div>
    </section>
  );
}
