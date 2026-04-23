import { execFileSync } from "node:child_process";

// Returns the ISO-8601 committer date of the most recent commit that
// touched `repoRelativePath`, or `null` if git isn't available / the
// path has no history / the lookup fails for any reason.
//
// Why committer-date (%cI) and not author-date (%aI): rebases and
// cherry-picks preserve the original author-date, which can make a
// "freshly merged" page look stale. Committer-date reflects when the
// change actually landed on the working branch — that's what users see.
//
// Why execFileSync + argv array (no shell): any shell metachars in
// `repoRelativePath` would be attack surface if it were ever
// user-derived. Here it's baked-in repo paths, but the argv form is
// cheap defense-in-depth.
//
// Environmental caveat: Vercel/Netlify default to shallow git clones,
// which can return empty strings for files with older-only history. In
// that case we fall back to the build time in sitemap.ts.
export function gitLastModIso(repoRelativePath: string): string | null {
  try {
    const out = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", repoRelativePath],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
    ).trim();
    return out || null;
  } catch {
    return null;
  }
}
