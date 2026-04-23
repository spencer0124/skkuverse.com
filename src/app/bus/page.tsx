import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import BusFaq from "@/components/bus/BusFaq";
import BusAppCta from "@/components/bus/BusAppCta";
import { BUS_FAQ, INJA_ROUTE, INSA_ROUTE } from "@/lib/bus-data";
import { SITE_URL, absoluteUrl } from "@/lib/site";

const PAGE_PATH = "/bus";
const PAGE_TITLE = "성균관대 셔틀버스 요금·시간·정류장";
const PAGE_DESCRIPTION =
  "성균관대 셔틀버스, 두 노선 한 곳에서. 혜화역↔인사캠(편도 400원)과 인사캠↔자과캠(수원) 인자셔틀(무료)의 요금·시간·정류장까지. 정확한 출발 시각과 실시간 도착정보는 스꾸버스 앱에 있어요.";

export const metadata: Metadata = {
  title: "셔틀버스",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    type: "website",
    url: absoluteUrl(PAGE_PATH),
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  twitter: { title: PAGE_TITLE, description: PAGE_DESCRIPTION },
};

const breadcrumbJsonLd = {
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "셔틀버스",
      item: absoluteUrl(PAGE_PATH),
    },
  ],
};

const faqJsonLd = {
  "@type": "FAQPage",
  mainEntity: BUS_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

// Minimal selector card — click through to a dedicated detail page.
// Kept inline because it only appears here on the hub.
function RouteSelectorCard({
  href,
  routeName,
  fromTo,
  fare,
  tagline,
}: {
  href: string;
  routeName: string;
  fromTo: string;
  fare: string;
  tagline: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-3xl bg-white border border-grey-100 shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-8 md:p-10 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-shadow"
    >
      <p className="text-t7 md:text-t6 font-bold text-brand tracking-tight mb-2">
        {fromTo}
      </p>
      <h2 className="text-[26px] md:text-[32px] font-bold text-grey-900 leading-tight tracking-tight mb-3">
        {routeName}
      </h2>
      <p className="text-t6 md:text-t5 text-grey-600 leading-relaxed mb-6">
        {tagline}
      </p>
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-grey-100 text-t7 font-bold text-grey-800">
          {fare}
        </span>
        <span className="text-t6 font-bold text-grey-600 group-hover:text-brand transition-colors">
          자세히 보기 →
        </span>
      </div>
    </Link>
  );
}

export default function BusPage() {
  return (
    <>
      <JsonLd id="ld-bus-breadcrumb" data={breadcrumbJsonLd} />
      <JsonLd id="ld-bus-faq" data={faqJsonLd} />

      <Header />

      <main className="pt-32 pb-24">
        {/* Hero */}
        <section className="mx-auto max-w-[1140px] px-6">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-t7 text-grey-500">
              <li>
                <Link href="/" className="hover:text-grey-700">
                  홈
                </Link>
              </li>
              <li aria-hidden>›</li>
              <li className="text-grey-700 font-medium">셔틀버스</li>
            </ol>
          </nav>

          <h1 className="text-[36px] md:text-hero font-bold text-grey-900 leading-[1.15] tracking-tight whitespace-pre-line">
            {"두 개의 셔틀,\n어디로 가세요?"}
          </h1>
          <p className="mt-6 max-w-[720px] text-t5 md:text-t4 text-grey-600 leading-relaxed whitespace-pre-line">
            {"성균관대엔 두 개의 셔틀이 있어요.\n인사캠 셔틀은 편도 400원,\n인자셔틀은 무료예요."}
          </p>
        </section>

        {/* Route selector — each card links to its dedicated detail page */}
        <section
          aria-label="셔틀 선택"
          className="mx-auto max-w-[1140px] px-6 mt-16 md:mt-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RouteSelectorCard
              href="/bus/insa"
              routeName={INSA_ROUTE.name}
              fromTo={INSA_ROUTE.summaryFromTo}
              fare={INSA_ROUTE.summaryFare}
              tagline={INSA_ROUTE.tagline}
            />
            <RouteSelectorCard
              href="/bus/inja"
              routeName={INJA_ROUTE.name}
              fromTo={INJA_ROUTE.summaryFromTo}
              fare={INJA_ROUTE.summaryFare}
              tagline={INJA_ROUTE.tagline}
            />
          </div>
        </section>

        {/* App CTA — the canonical destination for schedules and realtime info */}
        <section className="mx-auto max-w-[1140px] px-6 mt-16 md:mt-24">
          <BusAppCta />
        </section>

        {/* FAQ */}
        <section
          aria-labelledby="bus-faq-heading"
          className="mx-auto max-w-[720px] px-6 mt-24 md:mt-32"
        >
          <p className="text-t6 md:text-t5 font-bold text-brand tracking-tight mb-2">
            자주 묻는 질문
          </p>
          <h2
            id="bus-faq-heading"
            className="text-[28px] md:text-[40px] font-bold text-grey-900 tracking-tight leading-tight mb-10"
          >
            궁금했던 것,{"\n"}다 모았어요
          </h2>
          <BusFaq />
        </section>

        {/* Semester caveat — kept minimal, no external source list or non-official disclaimer */}
        <section
          aria-label="시간표 변경 안내"
          className="mx-auto max-w-[720px] px-6 mt-16 md:mt-24"
        >
          <p className="text-t7 text-grey-400 leading-relaxed">
            시간표·요금은 학기마다 바뀔 수 있어요.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
