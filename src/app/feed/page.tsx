import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const DESC = "스꾸버스 팀의 공지, 개발기, 그리고 팀 이야기를 모은 공간이에요.";

// Currently a placeholder — actual blog content isn't authored yet. Kept
// noindex + excluded from sitemap to avoid "discovered but not indexed"
// thin-content penalties. Flip `robots.index` to true and switch the
// matching SITE_PAGES entry's `indexable` to true together when real
// posts ship.
export const metadata: Metadata = {
  title: "피드",
  description: DESC,
  alternates: { canonical: "/feed" },
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    url: "/feed",
    title: "피드",
    description: DESC,
  },
  twitter: { title: "피드", description: DESC },
};

export default function FeedIndexPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-[1140px] px-6">
          <h1 className="text-display font-bold text-grey-900">피드</h1>
        </div>
      </main>
      <Footer />
    </>
  );
}
