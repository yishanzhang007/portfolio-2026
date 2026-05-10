interface CaseStudyImageHeroProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Apply 8px corner rounding to the image. Default off so existing
   *  bare-hero artwork (which already has its own framing) is unaffected. */
  rounded?: boolean;
  /** Hairline border around the image, matching the tile-bordered style. */
  bordered?: boolean;
  /** Set on a hero that stacks directly below another hero — drops the
   *  md+ 64px top gap so the two heroes sit 16px apart instead. */
  stacked?: boolean;
}

/* Bare hero — no tile, no border, no background. Same outer page padding
   and max-width as `CaseStudyHero` so vertical rhythm matches, but the
   SVG sits directly on the page background. Use for projects whose
   artwork already includes its own framing/canvas. */
export function CaseStudyImageHero({
  src,
  alt,
  width,
  height,
  rounded = false,
  bordered = false,
  stacked = false,
}: CaseStudyImageHeroProps) {
  return (
    <section
      className={`w-full pt-[16px] px-[12px] md:px-[16px] ${
        stacked ? "" : "md:pt-[48px]"
      }`}
    >
      <div className="w-full max-w-[1320px] mx-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`block w-full h-auto ${rounded ? "rounded-[8px]" : ""} ${
            bordered ? "border-[0.5px] border-[rgba(76,76,59,0.3)]" : ""
          }`}
        />
      </div>
    </section>
  );
}
