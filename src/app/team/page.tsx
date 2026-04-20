import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "팀 소개 - 스꾸버스",
  description: "스꾸버스를 만드는 사람들.",
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
