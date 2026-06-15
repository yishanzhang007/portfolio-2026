"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#f8f8f4",
          color: "#21201d",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 20, fontWeight: 500 }}>Something went wrong</p>
          <p style={{ color: "#82807c", fontSize: 14 }}>
            An unexpected error occurred.
          </p>
          <button
            onClick={() => unstable_retry()}
            style={{
              marginTop: 16,
              background: "none",
              border: "none",
              color: "#82807c",
              fontSize: 14,
              cursor: "pointer",
              textDecoration: "underline",
              textUnderlineOffset: "0.2em",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
