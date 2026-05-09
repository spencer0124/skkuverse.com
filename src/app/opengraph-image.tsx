import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { BRAND_COLOR, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

// Required with next.config.ts `output: "export"`: opts this Route Handler
// out of dynamic rendering so the image is emitted as a static PNG file
// into out/opengraph-image.png at build time.
export const dynamic = "force-static";

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const iconBuffer = readFileSync(join(process.cwd(), "public/logo.png"));
  const iconDataUrl = `data:image/png;base64,${iconBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: BRAND_COLOR,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconDataUrl} width={420} height={420} alt="" />
      </div>
    ),
    { ...size }
  );
}
