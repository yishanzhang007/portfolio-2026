export function PulseUiHero() {
  return (
    <div className="relative" style={{ width: 97, height: 62 }}>
      <div
        className="absolute flex flex-col items-start"
        style={{ left: 0, top: 0, width: 92, gap: 14 }}
      >
        <div className="flex items-center" style={{ gap: 4 }}>
          <div
            className="rounded-[2px] shrink-0"
            style={{
              width: 20,
              height: 20,
              background: "#21201d",
              border: "0.5px solid rgba(76,76,59,0.3)",
            }}
          />
          <div
            className="rounded-[2px] shrink-0"
            style={{
              width: 20,
              height: 20,
              background: "#f9f9f8",
              border: "0.5px solid rgba(76,76,59,0.3)",
            }}
          />
          <div
            className="rounded-[2px] shrink-0"
            style={{
              width: 20,
              height: 20,
              background: "#5d4ee8",
              border: "0.5px solid rgba(76,76,59,0.3)",
            }}
          />
          <div
            className="rounded-[2px] shrink-0"
            style={{
              width: 20,
              height: 20,
              background: "#f4c346",
              border: "0.5px solid rgba(76,76,59,0.3)",
            }}
          />
        </div>
        <div
          className="flex items-center justify-center rounded-[6px]"
          style={{
            height: 28,
            paddingLeft: 8,
            paddingRight: 8,
            paddingTop: 2,
            paddingBottom: 2,
            background: "#32302c",
          }}
        >
          <span
            className="whitespace-nowrap"
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 12,
              fontWeight: 500,
              lineHeight: "16px",
              color: "#fcfcfc",
            }}
          >
            Confirm
          </span>
        </div>
      </div>
      <svg
        className="absolute"
        style={{ left: 66, top: 34, width: 6, height: 28 }}
        viewBox="0 0 6 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="3" y1="0" x2="3" y2="28" stroke="#f42500" strokeWidth="1" />
        <line x1="0" y1="0" x2="6" y2="0" stroke="#f42500" strokeWidth="1" />
        <line x1="0" y1="28" x2="6" y2="28" stroke="#f42500" strokeWidth="1" />
      </svg>
      <div
        className="absolute flex items-start justify-center rounded-[3.5px] overflow-hidden"
        style={{
          right: 0,
          top: `calc(50% + 17px)`,
          transform: "translateY(-50%)",
          paddingLeft: 3,
          paddingRight: 3,
          paddingTop: 2,
          paddingBottom: 2,
          background: "#f42500",
        }}
      >
        <span
          className="whitespace-nowrap text-center"
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 11,
            fontWeight: 500,
            lineHeight: "16px",
            letterSpacing: "0.11px",
            color: "#ffffff",
          }}
        >
          36
        </span>
      </div>
    </div>
  );
}
