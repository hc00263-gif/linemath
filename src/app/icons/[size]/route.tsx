import { ImageResponse } from "next/og";

export const dynamic = "force-static";

const SIZES = [192, 512];

export function generateStaticParams() {
  return SIZES.map((size) => ({ size: String(size) }));
}

/** App-install icons (PNG), drawn at build time so there is no binary asset to keep in sync. */
export async function GET(_request: Request, { params }: { params: Promise<{ size: string }> }) {
  const { size } = await params;
  const px = SIZES.includes(Number(size)) ? Number(size) : 192;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0c0e11",
          color: "#ffb020",
          fontSize: px * 0.46,
          fontWeight: 800,
          letterSpacing: -px * 0.02,
        }}
      >
        LM
      </div>
    ),
    { width: px, height: px }
  );
}
