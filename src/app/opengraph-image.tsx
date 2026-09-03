import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social-share preview image, generated at build/request time so there's no binary
 * asset to keep in sync with the copy. Inherited by any route that doesn't define its own. */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0b0d10",
          color: "#f5f5f0",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 96, fontWeight: 800, letterSpacing: -2 }}>
          <span>Line</span>
          <span style={{ color: "#f5a623" }}>Math</span>
        </div>
        <div style={{ display: "flex", fontSize: 32, marginTop: 24, color: "#a1a1aa" }}>
          Free Sports Betting Calculators — No Signup Required
        </div>
      </div>
    ),
    { ...size }
  );
}
