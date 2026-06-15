interface QuoteCardProps {
  text: string;
  attribution: string;
  /** Font-size classes for the quote text. Defaults to the voice-agent
   *  sizing (14→18→20). */
  textClassName?: string;
  /** Font-size classes for the attribution line. */
  attributionClassName?: string;
}

export function QuoteCard({
  text,
  attribution,
  textClassName = "text-[14px] md:text-[18px] xl:text-[20px] leading-[1.3]",
  attributionClassName = "text-muted text-[14px] leading-[1.5] mt-[24px]",
}: QuoteCardProps) {
  return (
    <div className="bg-panel rounded-[6px] p-[12px]">
      <p
        className={textClassName}
        style={{ fontFamily: "var(--font-ntype), serif" }}
      >
        {text}
      </p>
      <p className={attributionClassName}>
        {attribution}
      </p>
    </div>
  );
}
