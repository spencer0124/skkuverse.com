"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import PhoneMockup from "@/components/ui/PhoneMockup";
import AnimatedReveal from "@/components/ui/AnimatedReveal";

export default function MapSection() {
  return (
    <section className="py-24 md:py-32 bg-grey-50">
      <div className="mx-auto max-w-[1140px] px-6">
        <SectionHeading
          label="캠퍼스 맵"
          title={"인사캠, 자과캠\n손 위에서 한눈에"}
          description="네이버 지도 기반 캠퍼스 맵으로 건물, 편의시설, 경로를 바로 찾아보세요."
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 order-2 md:order-1">
            <AnimatedReveal delay={0.1}>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  🗺️
                </div>
                <div>
                  <h3 className="text-t5 font-bold text-grey-900">
                    네이버 지도 연동
                  </h3>
                  <p className="mt-1 text-t6 text-grey-500">
                    인사캠과 자과캠을 네이버 지도 위에서 탐색하세요.
                    캠퍼스 간 빠른 전환도 가능해요.
                  </p>
                </div>
              </div>
            </AnimatedReveal>

            <AnimatedReveal delay={0.2}>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  🔍
                </div>
                <div>
                  <h3 className="text-t5 font-bold text-grey-900">
                    건물 & 공간 검색
                  </h3>
                  <p className="mt-1 text-t6 text-grey-500">
                    건물명이나 강의실 번호로 바로 검색하세요.
                    한국어, 영어 모두 지원해요.
                  </p>
                </div>
              </div>
            </AnimatedReveal>

            <AnimatedReveal delay={0.3}>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  📌
                </div>
                <div>
                  <h3 className="text-t5 font-bold text-grey-900">
                    마커 & 레이어 필터
                  </h3>
                  <p className="mt-1 text-t6 text-grey-500">
                    식당, 편의점, 카페 등 카테고리별 필터로
                    원하는 시설만 지도에 표시할 수 있어요.
                  </p>
                </div>
              </div>
            </AnimatedReveal>

            <AnimatedReveal delay={0.4}>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  🏛️
                </div>
                <div>
                  <h3 className="text-t5 font-bold text-grey-900">
                    인사캠 인터랙티브 플로어 맵
                  </h3>
                  <p className="mt-1 text-t6 text-grey-500">
                    인사캠 12개 건물의 층별 지도를 SVG 기반으로 제공해요.
                    터치해서 시설 정보를 바로 확인하세요.
                  </p>
                </div>
              </div>
            </AnimatedReveal>
          </div>

          <AnimatedReveal delay={0.2} className="order-1 md:order-2">
            <PhoneMockup>
              <div className="w-full h-full bg-brand-light p-0 pt-8">
                {/* Map UI mockup */}
                <div className="px-4 mb-3">
                  <div className="bg-white rounded-xl px-3 py-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.08)] flex items-center gap-2">
                    <span className="text-[12px] text-grey-400">🔍</span>
                    <span className="text-[11px] text-grey-400">
                      건물 또는 강의실 검색
                    </span>
                  </div>
                </div>

                {/* Campus toggle */}
                <div className="px-4 mb-3 flex gap-2">
                  <span className="text-[10px] font-bold text-white bg-brand px-3 py-1 rounded-full">
                    인사캠
                  </span>
                  <span className="text-[10px] font-bold text-grey-500 bg-white px-3 py-1 rounded-full">
                    자과캠
                  </span>
                </div>

                {/* Simplified map area */}
                <div className="relative flex-1 bg-[color-mix(in_srgb,var(--color-brand)_8%,white)] mx-2 rounded-t-xl p-3 min-h-[260px]">
                  {/* Map markers */}
                  <div className="absolute top-[20%] left-[30%] flex flex-col items-center">
                    <div className="bg-brand text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md">
                      법학관
                    </div>
                    <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-brand" />
                  </div>
                  <div className="absolute top-[35%] left-[55%] flex flex-col items-center">
                    <div className="bg-brand text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md">
                      호암관
                    </div>
                    <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-brand" />
                  </div>
                  <div className="absolute top-[55%] left-[25%] flex flex-col items-center">
                    <div className="bg-grey-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md">
                      600주년
                    </div>
                    <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-grey-600" />
                  </div>
                  <div className="absolute top-[50%] left-[65%] flex flex-col items-center">
                    <div className="bg-grey-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md">
                      경영관
                    </div>
                    <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-grey-600" />
                  </div>

                  {/* Filter chips */}
                  <div className="absolute bottom-3 left-2 right-2 flex gap-1.5 overflow-hidden">
                    <span className="text-[8px] bg-white/90 text-grey-600 px-2 py-1 rounded-full whitespace-nowrap">
                      🍽 식당
                    </span>
                    <span className="text-[8px] bg-white/90 text-grey-600 px-2 py-1 rounded-full whitespace-nowrap">
                      ☕ 카페
                    </span>
                    <span className="text-[8px] bg-white/90 text-grey-600 px-2 py-1 rounded-full whitespace-nowrap">
                      🏪 편의점
                    </span>
                  </div>
                </div>
              </div>
            </PhoneMockup>
          </AnimatedReveal>
        </div>
      </div>
    </section>
  );
}
