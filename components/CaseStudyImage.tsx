import type { ReactNode } from "react";
import Image from "next/image";

interface CaseStudyImageProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  /** Aspect ratio when rendering an empty placeholder panel (no src) — e.g. "560/373". */
  aspectRatio?: string;
  /** Add inner panel padding around the image so the gray panel shows around it. */
  padded?: boolean;
  /** Custom content rendered inside the gray panel. Takes precedence over src. */
  children?: ReactNode;
  /** Extra utility classes appended to the panel — used for outer spacing overrides. */
  className?: string;
}

export function CaseStudyImage({
  src,
  alt,
  width,
  height,
  aspectRatio,
  padded = false,
  children,
  className = "",
}: CaseStudyImageProps) {
  const aspectStyle = aspectRatio ? { aspectRatio } : undefined;
  return (
    <div
      className={`@container bg-panel rounded-[4px] flex items-center justify-center overflow-hidden relative ${
        padded ? "p-[10px]" : ""
      } ${className}`}
      style={aspectStyle}
    >
      {children ??
        (src && width && height ? (
          <Image
            src={src}
            alt={alt ?? ""}
            width={width}
            height={height}
            className="w-full h-auto"
          />
        ) : null)}
    </div>
  );
}
