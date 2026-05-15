export function OrchidHero() {
  return (
    <div className="flex flex-col items-start" style={{ gap: 8 }}>
      <div
        className="flex items-start rounded-full"
        style={{
          paddingLeft: 8,
          paddingRight: 8,
          paddingTop: 2,
          paddingBottom: 2,
          background: "rgba(0,0,0,0.03)",
          border: "1px solid rgba(0,0,0,0.12)",
        }}
      >
        <span
          className="whitespace-nowrap"
          style={{
            fontFamily: "'GT America', 'Inter', system-ui, sans-serif",
            fontSize: 14,
            lineHeight: 1.3,
            letterSpacing: "-0.336px",
            color: "rgba(0,0,0,0.89)",
          }}
        >
          Medical advisors
        </span>
      </div>
      <span
        className="whitespace-nowrap"
        style={{
          fontFamily: "'GT America Trial', 'GT America', Georgia, serif",
          fontSize: 47,
          lineHeight: 1.05,
          letterSpacing: "-3.29px",
          color: "rgba(0,0,0,0.89)",
        }}
      >
        Orchid
      </span>
    </div>
  );
}
