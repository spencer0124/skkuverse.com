import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "셔틀버스",
  description: "성균관대 셔틀버스 실시간 위치, 시간표, 요금 안내.",
};

export default function BusPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-[1140px] px-6">
          <h1 className="text-display font-bold text-grey-900">셔틀버스</h1>
        </div>
      </main>
      <Footer />
    </>
  );
}
