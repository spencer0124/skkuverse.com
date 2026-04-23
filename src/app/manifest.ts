import type { MetadataRoute } from "next";
import {
  BRAND_BG,
  BRAND_COLOR,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_LANGUAGE,
} from "@/lib/site";

// Required with next.config.ts `output: "export"` — emits a static file.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — 성균관 유니버스`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: BRAND_BG,
    theme_color: BRAND_COLOR,
    lang: SITE_LANGUAGE,
    dir: "ltr",
    categories: ["education", "productivity", "utilities"],
    icons: [
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
