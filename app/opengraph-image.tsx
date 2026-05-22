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
          display: "flex",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: "#c95c19",
          }}
        />
      </div>
    ),
    size,
  );
}
