"use client";

import Image, { type StaticImageData } from "next/image";
import AnimatedReveal from "@/components/ui/AnimatedReveal";

type Row = {
  icon: string;
  label: string;
  title: string;
  body: string;
  image?: StaticImageData;
};

const rows: Row[] = [
  {
    icon: "📍",
    label: "실시간 위치",
    title: "지금\n어디쯤 와요?",
    body: "타려는 버스가 어디까지 왔는지 실시간으로 보여드려요.\n정류장에서 막연히 기다리지 않아도 돼요.",
  },
  {
    icon: "🕐",
    label: "시간표 자동 정렬",
    title: "다음 차가 뭔지\n알려드려요",
    body: "지금 시간 기준으로 가장 빨리 오는 차부터 정렬해드려요.\n시간표를 뒤적일 필요 없어요.",
  },
  {
    icon: "🆚",
    label: "한 화면에서 비교",
    title: "셔틀이 빠를까,\n시내버스가 빠를까",
    body: "인사캠 셔틀과 종로02·07을 한 화면에 띄워드려요.\n더 빨리 오는 걸 골라 타세요.",
  },
];

export default function MoveSection() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="mx-auto max-w-[720px] px-6">
        <div className="text-left">
          <AnimatedReveal>
            <p className="text-[20px] md:text-[28px] font-bold text-brand mb-2">
              이동
            </p>
          </AnimatedReveal>
          <AnimatedReveal delay={0.1}>
            <h2 className="text-[28px] md:text-[42px] font-bold text-grey-900 whitespace-pre-line tracking-tight leading-[1.25]">
              {"다음 셔틀,\n어디쯤 왔는지 한눈에"}
            </h2>
          </AnimatedReveal>
        </div>

        <div className="mt-24 md:mt-32 space-y-24 md:space-y-32 px-4 md:px-8">
          {rows.map((row) => (
            <div key={row.label}>
              <AnimatedReveal>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[18px] md:text-[24px]" aria-hidden>
                    {row.icon}
                  </span>
                  <p className="text-[18px] md:text-[24px] font-bold text-brand">
                    {row.label}
                  </p>
                </div>
                <h3 className="text-[26px] md:text-[38px] font-bold text-grey-900 whitespace-pre-line tracking-tight leading-[1.25]">
                  {row.title}
                </h3>
                <p className="mt-3 text-t5 md:text-t4 text-grey-500 whitespace-pre-line">
                  {row.body}
                </p>
              </AnimatedReveal>

              <AnimatedReveal delay={0.15}>
                {row.image ? (
                  <div className="mt-10 w-full rounded-3xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden py-4 md:py-6">
                    <Image
                      src={row.image}
                      alt={row.label}
                      className="w-full h-auto"
                      placeholder="blur"
                      sizes="(max-width: 720px) 100vw, 720px"
                    />
                  </div>
                ) : (
                  <div className="mt-10 aspect-[4/3] w-full rounded-3xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)] flex items-center justify-center">
                    <span className="text-t6 text-grey-400 font-medium">
                      이미지
                    </span>
                  </div>
                )}
              </AnimatedReveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
