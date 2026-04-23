import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import BusSection, {
  BusSectionDivider,
} from "@/components/bus/BusSection";
import BusStopTimeline from "@/components/bus/BusStopTimeline";
import BusContactList from "@/components/bus/BusContactList";
import BusAppCta from "@/components/bus/BusAppCta";
import { INSA_ROUTE } from "@/lib/bus-data";
import { SITE_URL, absoluteUrl } from "@/lib/site";

const PAGE_PATH = "/bus/insa";
const PAGE_TITLE = "인사캠 셔틀버스 시간·요금·노선";
const PAGE_DESCRIPTION =
  "성균관대 인사캠 셔틀버스 — 혜화역과 인사캠을 잇는 공식 셔틀. 편도 400원, 월~금 운행(학기중 07:00~23:00, 방학중 07:00~19:00). 정류장·결제수단·연락처를 한 곳에서 확인하세요.";

export const metadata: Metadata = {
  title: "인사캠 셔틀버스",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    type: "article",
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
      item: absoluteUrl("/bus"),
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "인사캠 셔틀버스",
      item: absoluteUrl(PAGE_PATH),
    },
  ],
};

const busTripJsonLd = INSA_ROUTE.directions.map((d) => ({
  "@type": "BusTrip",
  name: `${INSA_ROUTE.name} (${d.label})`,
  provider: {
    "@type": "CollegeOrUniversity",
    name: "성균관대학교",
    url: "https://www.skku.edu",
  },
  departureBusStop: {
    "@type": "BusStation",
    name: d.stops[0]?.name,
  },
  arrivalBusStop: {
    "@type": "BusStation",
    name: d.stops[d.stops.length - 1]?.name,
  },
  offers: {
    "@type": "Offer",
    price: 400,
    priceCurrency: "KRW",
    availability: "https://schema.org/InStock",
  },
}));

export default function InsaBusPage() {
  return (
    <>
      <JsonLd id="ld-insa-breadcrumb" data={breadcrumbJsonLd} />
      <JsonLd id="ld-insa-trips" data={busTripJsonLd} />

      <Header />

      <main className="pt-24 pb-24">
        {/* Page header: back link + centered title, mirrors the app's top bar */}
        <div className="mx-auto max-w-[720px]">
          <div className="relative flex items-center justify-center h-14 px-6">
            <Link
              href="/bus"
              aria-label="셔틀버스 허브로 돌아가기"
              className="absolute left-6 text-grey-700 hover:text-grey-900 transition-colors"
            >
              ← 셔틀버스
            </Link>
            <h1 className="text-t4 md:text-t3 font-bold text-grey-900">
              {INSA_ROUTE.name}
            </h1>
          </div>

          {/* Section: 운행시간 */}
          <BusSection
            label="운행시간"
            heading={INSA_ROUTE.operatingHeading}
          >
            <ul className="flex flex-col gap-1 mb-5">
              {INSA_ROUTE.operatingBullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-t6 text-grey-600">
                  <span aria-hidden className="mt-[0.5rem] w-1 h-1 rounded-full bg-grey-400 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-2 gap-3">
              {INSA_ROUTE.timeCards.map((c) => (
                <div
                  key={c.label}
                  className="rounded-2xl bg-grey-100 px-5 py-6 text-center"
                >
                  <p className="text-t7 text-grey-500 mb-2">{c.label}</p>
                  <p className="text-t3 md:text-t2 font-bold text-grey-900 tracking-tight">
                    {c.time}
                  </p>
                </div>
              ))}
            </div>
          </BusSection>

          <BusSectionDivider />

          {/* Section: 요금과 결제 */}
          <BusSection label="요금과 결제" heading={INSA_ROUTE.fareHeading}>
            <p className="text-t6 text-grey-500 mb-2">결제할 수 있어요</p>
            <ul className="rounded-2xl bg-grey-100 p-5 flex flex-col gap-3 mb-5">
              {INSA_ROUTE.acceptedPayments.map((p) => (
                <li key={p.name}>
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="inline-flex items-center justify-center w-5 h-5 text-grey-700 text-t5 font-bold"
                    >
                      ✓
                    </span>
                    <span className="text-t5 font-bold text-grey-900">
                      {p.name}
                    </span>
                  </div>
                  {p.note ? (
                    <p className="mt-1 ml-8 text-t7 text-grey-500">{p.note}</p>
                  ) : null}
                </li>
              ))}
            </ul>

            <p className="text-t6 text-grey-500 mb-2">결제할 수 없어요</p>
            <ul className="rounded-2xl bg-grey-100 p-5 flex flex-col gap-3">
              {INSA_ROUTE.rejectedPayments.map((name) => (
                <li key={name} className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="inline-flex items-center justify-center w-5 h-5 text-grey-400 text-t5 font-bold"
                  >
                    ×
                  </span>
                  <span className="text-t5 text-grey-500">{name}</span>
                </li>
              ))}
            </ul>
          </BusSection>

          <BusSectionDivider />

          {/* Section: 문의 */}
          <BusSection label="문의" heading={INSA_ROUTE.contactHeading}>
            <BusContactList contacts={INSA_ROUTE.contacts} />
          </BusSection>

          <BusSectionDivider />

          {/* Section: 노선 / 운행 경로 */}
          <BusSection label="노선" heading="운행 경로">
            <div className="flex flex-col gap-3">
              {INSA_ROUTE.directions.map((d) => (
                <div
                  key={d.label}
                  className="rounded-3xl bg-grey-100 p-6 md:p-7"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-t6 font-bold text-grey-900 mb-5">
                    <span>{d.label.split(" → ")[0]}</span>
                    <span aria-hidden className="text-grey-500">→</span>
                    <span>{d.label.split(" → ")[1]}</span>
                  </div>
                  <BusStopTimeline stops={d.stops} />
                </div>
              ))}
            </div>
          </BusSection>

          <BusSectionDivider />

          {/* App CTA at bottom — user just absorbed detail, prime moment to convert */}
          <div className="px-6 py-10">
            <BusAppCta />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
