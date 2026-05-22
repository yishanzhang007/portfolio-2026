import { ImageResponse } from "next/og";

export const alt = "Yishan Zhang — Product designer";
export const size = { width: 1200, height: 1200 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* 4x4 dot in source SVG (260x260 canvas) -> 18px on a 1200x1200 canvas. */}
        <div
          style={{
            width: 18,
            height: 18,
            background: "#21201d",
          }}
        />
      </div>
    ),
    size,
  );
}
