import { ImageResponse } from "next/og";
import { BRAND_COLOR, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

// Required with next.config.ts `output: "export"`: opts this Route Handler
// out of dynamic rendering so the image is emitted as a static PNG file
// into out/opengraph-image.png at build time.
export const dynamic = "force-static";

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Intentionally Latin-only: Satori (the engine behind ImageResponse) hits
// "lookupType: 6 / substFormat: 1 is not yet supported" when it tries to
// shape Korean text through Wanted Sans OTF. Rather than ship a broken
// build, we render an English-word OG card with brand colors. To re-enable
// a bilingual card later, either (a) drop in a designed static
// src/app/opengraph-image.png (file convention accepts any image file),
// or (b) load a Satori-compatible Korean TTF like Noto Sans KR via readFile.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          background: BRAND_COLOR,
          padding: "80px",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#E9EDEA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: BRAND_COLOR,
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            S
          </div>
          skkuverse
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: 104,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
            }}
          >
            skkuverse
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 400,
              lineHeight: 1.3,
              color: "#E9EDEA",
              opacity: 0.9,
            }}
          >
            SKKU bus · notices · campus — for students, by students
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 24,
            opacity: 0.7,
          }}
        >
          skkuverse.com
        </div>
      </div>
    ),
    { ...size }
  );
}
