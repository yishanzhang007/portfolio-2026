import { ImageResponse } from "next/og";

export const alt = "Yishan Zhang — Product designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Fetch a single weight of a Google Font, subsetted to just the characters
// we render. Runs once at static-generation time so there's no per-request
// network cost.
async function loadGoogleFont(family: string, weight: number, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family,
  )}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  }).then((r) => r.text());
  const match = css.match(/src:\s*url\(([^)]+)\)/);
  if (!match) throw new Error(`font fetch failed for ${family} ${weight}`);
  return fetch(match[1]).then((r) => r.arrayBuffer());
}

export default async function OpengraphImage() {
  const [interBold, interRegular] = await Promise.all([
    loadGoogleFont("Inter", 700, "Yishan Zhang"),
    loadGoogleFont("Inter", 400, "Product designer"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter",
          color: "#000000",
        }}
      >
        <div style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.1 }}>
          Yishan Zhang
        </div>
        <div style={{ fontSize: 24, fontWeight: 400, marginTop: 4 }}>
          Product designer
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: interBold, weight: 700, style: "normal" },
        { name: "Inter", data: interRegular, weight: 400, style: "normal" },
      ],
    },
  );
}
