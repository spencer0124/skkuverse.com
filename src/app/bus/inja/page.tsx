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
import BusMapChips from "@/components/bus/BusMapChips";
import BusAppCta from "@/components/bus/BusAppCta";
import { INJA_ROUTE } from "@/lib/bus-data";
import { SITE_URL, absoluteUrl } from "@/lib/site";

const PAGE_PATH = "/bus/inja";
const PAGE_TITLE = "인자셔틀 시간·무료·운행 경로";
const PAGE_DESCRIPTION =
  "성균관대 인자셔틀 — 인사캠과 자과캠(수원)을 잇는 무료 셔틀. 매주 금요일 운행, 탑승장소는 인사캠 600주년기념관 건너편과 자과캠 N센터 앞. 분실물 연락처까지 한 곳에서 확인하세요.";

export const metadata: Metadata = {
  title: "인자셔틀",
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
      name: "인자셔틀",
      item: absoluteUrl(PAGE_PATH),
    },
  ],
};

const busTripJsonLd = INJA_ROUTE.directions.map((d) => ({
  "@type": "BusTrip",
  name: `${INJA_ROUTE.name} (${d.label})`,
  provider: {
    "@type": "CollegeOrUniversity",
    name: "성균관대학교",
    url: "https://www.skku.edu",
  },
  departureBusStop: {
    "@type": "BusStation",
    name: d.stops[0]?.name,
    address: d.boardingLocation?.name,
  },
  arrivalBusStop: {
    "@type": "BusStation",
    name: d.stops[d.stops.length - 1]?.name,
  },
  offers: {
    "@type": "Offer",
    price: 0,
    priceCurrency: "KRW",
    availability: "https://schema.org/InStock",
  },
}));

export default function InjaBusPage() {
  return (
    <>
      <JsonLd id="ld-inja-breadcrumb" data={breadcrumbJsonLd} />
      <JsonLd id="ld-inja-trips" data={busTripJsonLd} />

      <Header />

      <main className="pt-24 pb-24">
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
              {INJA_ROUTE.name}
            </h1>
          </div>

          {/* Section: 운행시간 */}
          <BusSection
            label="운행시간"
            heading={INJA_ROUTE.operatingHeading}
          >
            <ul className="flex flex-col gap-1 mb-4">
              {INJA_ROUTE.operatingBullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 text-t6 text-grey-600"
                >
                  <span
                    aria-hidden
                    className="mt-[0.5rem] w-1 h-1 rounded-full bg-grey-400 shrink-0"
                  />
                  {b}
                </li>
              ))}
            </ul>
            {INJA_ROUTE.operatingWarning ? (
              <div className="rounded-2xl bg-[#FFF3E0] px-5 py-4 text-t6 font-bold text-[#C75F00]">
                {INJA_ROUTE.operatingWarning}
              </div>
            ) : null}
          </BusSection>

          <BusSectionDivider />

          {/* Section: 요금과 결제 */}
          <BusSection label="요금과 결제" heading={INJA_ROUTE.fareHeading} />

          <BusSectionDivider />

          {/* Section: 참고 / 안내 */}
          <BusSection label="참고" heading={INJA_ROUTE.notesHeading}>
            <ul className="rounded-2xl bg-grey-100 p-5 flex flex-col gap-2.5">
              {INJA_ROUTE.notes.map((n) => (
                <li
                  key={n}
                  className="flex items-start gap-2 text-t6 text-grey-700 leading-relaxed"
                >
                  <span
                    aria-hidden
                    className="mt-[0.55rem] w-1 h-1 rounded-full bg-grey-500 shrink-0"
                  />
                  {n}
                </li>
              ))}
            </ul>
          </BusSection>

          <BusSectionDivider />

          {/* Section: 문의 / 분실물 연락처 */}
          <BusSection label="문의" heading={INJA_ROUTE.contactHeading}>
            <BusContactList contacts={INJA_ROUTE.contacts} />
          </BusSection>

          <BusSectionDivider />

          {/* Section: 노선 / 운행 경로 */}
          <BusSection label="노선" heading="운행 경로">
            <div className="flex flex-col gap-3">
              {INJA_ROUTE.directions.map((d) => (
                <div
                  key={d.label}
                  className="rounded-3xl bg-grey-100 p-6 md:p-7"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-t6 font-bold text-grey-900 mb-5">
                    <span>{d.label.split(" → ")[0]}</span>
                    <span aria-hidden className="text-grey-500">
                      →
                    </span>
                    <span>{d.label.split(" → ")[1]}</span>
                  </div>
                  <BusStopTimeline stops={d.stops} />

                  {d.boardingLocation ? (
                    <div className="mt-6 pt-6 border-t border-grey-200">
                      <p className="text-t7 text-grey-500 mb-1">탑승장소</p>
                      <p className="text-t4 md:text-t3 font-bold text-grey-900 mb-4">
                        {d.boardingLocation.name}
                      </p>
                      <BusMapChips
                        label={d.boardingLocation.name}
                        urls={d.boardingLocation.mapUrls}
                      />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </BusSection>

          <BusSectionDivider />

          <div className="px-6 py-10">
            <BusAppCta />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
