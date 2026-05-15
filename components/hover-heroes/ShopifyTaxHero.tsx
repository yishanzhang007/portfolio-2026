export function ShopifyTaxHero() {
  return (
    <div
      className="flex flex-col items-start"
      style={{
        width: 250,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <div className="flex items-center justify-center w-full" style={{ paddingTop: 16 }}>
        <p
          className="flex-1"
          style={{
            fontSize: 14,
            fontWeight: 650,
            lineHeight: "20px",
            color: "#202223",
          }}
        >
          VAT invoice
        </p>
      </div>
      <div
        className="flex flex-col items-start w-full"
        style={{
          paddingTop: 8,
          paddingBottom: 16,
          fontSize: 13,
          fontWeight: 450,
          lineHeight: "20px",
        }}
      >
        <div className="flex items-start w-full" style={{ gap: 8 }}>
          <p className="flex-1" style={{ color: "#005bd3" }}>INV-IT-25</p>
          <p className="whitespace-nowrap shrink-0" style={{ color: "#616161" }}>Feb 12, 2024</p>
        </div>
        <div className="flex items-start w-full" style={{ gap: 8 }}>
          <p className="flex-1" style={{ color: "#005bd3" }}>INV-IT-26</p>
          <p className="whitespace-nowrap shrink-0" style={{ color: "#616161" }}>Feb 12, 2024</p>
        </div>
      </div>
    </div>
  );
}
