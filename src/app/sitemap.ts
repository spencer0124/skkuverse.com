import type { MetadataRoute } from "next";
import { SITE_PAGES, SITE_URL } from "@/lib/site";
import { gitLastModIso } from "@/lib/git-mod";

// Required with next.config.ts `output: "export"` — emits /sitemap.xml at build time.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // Single "now" fallback used when git history lookup fails (shallow
  // clone on some CI providers, or a page without commit history yet).
  // Better than making every URL identical — only the pages missing
  // git metadata land on this single bucket.
  const buildTime = new Date();

  return SITE_PAGES.filter((p) => p.indexable).map((page) => {
    const gitIso = page.sourceFile ? gitLastModIso(page.sourceFile) : null;
    return {
      url: `${SITE_URL}${page.path === "/" ? "" : page.path}`,
      lastModified: gitIso ? new Date(gitIso) : buildTime,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    };
  });
}
