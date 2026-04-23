import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const DESC = "스꾸버스를 만드는 사람들, 그리고 우리가 믿고 일하는 방식.";

export const metadata: Metadata = {
  title: "팀 소개",
  description: DESC,
  alternates: { canonical: "/team" },
  openGraph: {
    type: "profile",
    url: "/team",
    title: "팀 소개",
    description: DESC,
  },
  twitter: { title: "팀 소개", description: DESC },
};

export default function TeamPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-[1140px] px-6">
          <h1 className="text-display font-bold text-grey-900">팀 소개</h1>
        </div>
      </main>
      <Footer />
    </>
  );
}
