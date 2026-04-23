import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Required with next.config.ts `output: "export"` — emits /robots.txt at build time.
export const dynamic = "force-static";

// /notice is intentionally crawlable — its pages carry `robots: { index: false }`
// meta, which is the Google-recommended pattern. Blocking it in robots.txt
// would prevent crawl entirely, stopping bots from ever seeing the noindex
// signal (and Google could still list URL-only entries from external links).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // Explicitly welcome AI-search crawlers. Flip to disallow: "/" if the
      // team later decides to opt out of generative-AI training/retrieval.
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      // Korean ecosystem — Naver, Kakao/Daum (Yeti is Naver's primary crawler).
      { userAgent: "Yeti", allow: "/" },
      { userAgent: "NaverBot", allow: "/" },
      { userAgent: "Daum", allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    // `host:` directive omitted — it was a Yandex-only extension and Google
    // / Naver Yeti never honored it. Removing keeps the file minimal-valid.
  };
}
