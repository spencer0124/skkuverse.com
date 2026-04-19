"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import PhoneMockup from "@/components/ui/PhoneMockup";
import AnimatedReveal from "@/components/ui/AnimatedReveal";

const buildings = [
  "법학관",
  "수선관",
  "호암관",
  "퇴계인문관",
  "다산경제관",
  "경영관",
  "교수회관",
  "중앙학술정보관",
  "600주년기념관",
  "국제관",
  "학생회관",
  "수선관 별관",
];

export default function BuildingSection() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="mx-auto max-w-[1140px] px-6">
        <SectionHeading
          label="건물 상세정보"
          title={"12개 건물, 층별로\n꼼꼼하게 안내해요"}
          description="인사캠 주요 건물의 층별 시설, 강의실, 편의시설 정보를 한 곳에서 확인하세요."
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <AnimatedReveal delay={0.2}>
            <PhoneMockup>
              <div className="w-full h-full bg-white p-5 pt-10">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[13px] font-bold text-grey-900">호암관</p>
                  <span className="text-[9px] text-grey-400">인사캠</span>
                </div>
                <p className="text-[10px] text-grey-500 mb-4">
                  1F - 12F | 엘리베이터 ✓ | 화장실 ✓
                </p>

                {/* Floor list */}
                <div className="space-y-2">
                  {[
                    {
                      floor: "12F",
                      rooms: "대강당, 세미나실",
                    },
                    {
                      floor: "5F",
                      rooms: "501호, 502호, 503호",
                    },
                    {
                      floor: "3F",
                      rooms: "301호, 교수 연구실",
                      active: true,
                    },
                    {
                      floor: "1F",
                      rooms: "로비, 안내데스크, 카페",
                    },
                    {
                      floor: "B1",
                      rooms: "헬스장, 탈의실",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 p-2.5 rounded-xl ${
                        item.active
                          ? "bg-brand-light border border-brand/20"
                          : "bg-grey-50"
                      }`}
                    >
                      <span
                        className={`text-[11px] font-bold w-8 text-center ${
                          item.active ? "text-brand" : "text-grey-600"
                        }`}
                      >
                        {item.floor}
                      </span>
                      <span className="text-[10px] text-grey-600">
                        {item.rooms}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Connected buildings */}
                <div className="mt-4 p-3 rounded-xl bg-grey-50 border border-grey-100">
                  <p className="text-[10px] font-bold text-grey-500 mb-1.5">
                    연결된 건물
                  </p>
                  <div className="flex gap-1.5">
                    <span className="text-[9px] bg-white text-grey-600 px-2 py-1 rounded-lg">
                      수선관
                    </span>
                    <span className="text-[9px] bg-white text-grey-600 px-2 py-1 rounded-lg">
                      퇴계인문관
                    </span>
                  </div>
                </div>
              </div>
            </PhoneMockup>
          </AnimatedReveal>

          <div className="space-y-8">
            <AnimatedReveal delay={0.1}>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-2xl">
                  🏛️
                </div>
                <div>
                  <h3 className="text-t5 font-bold text-grey-900">
                    층별 시설 안내
                  </h3>
                  <p className="mt-1 text-t6 text-grey-500">
                    각 건물의 층별 강의실, 편의시설, 연구실 정보를 한눈에
                    확인하세요. 엘리베이터와 화장실 위치도 알려드려요.
                  </p>
                </div>
              </div>
            </AnimatedReveal>

            <AnimatedReveal delay={0.2}>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-2xl">
                  🔗
                </div>
                <div>
                  <h3 className="text-t5 font-bold text-grey-900">
                    건물 간 연결 통로
                  </h3>
                  <p className="mt-1 text-t6 text-grey-500">
                    건물 사이 연결 통로 정보를 제공해요. 비 오는 날에도
                    실내로 이��할 수 있는 경로를 찾아보세요.
                  </p>
                </div>
              </div>
            </AnimatedReveal>

            <AnimatedReveal delay={0.3}>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-2xl">
                  🏫
                </div>
                <div>
                  <h3 className="text-t5 font-bold text-grey-900">
                    인사캠 12개 건물 지원
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {buildings.map((b) => (
                      <span
                        key={b}
                        className="text-t7 bg-grey-50 text-grey-600 px-2.5 py-1 rounded-lg"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
