"use client";

import Image, { type StaticImageData } from "next/image";
import AnimatedReveal from "@/components/ui/AnimatedReveal";
import noticeListSummary from "@/assets/images/mockups/notice-list-summary.jpeg";
import noticeBodySummary from "@/assets/images/mockups/notice-body-summary.jpeg";

type Row = {
  icon: string;
  label: string;
  title: string;
  body: string;
  image?: StaticImageData;
};

const rows: Row[] = [
  {
    icon: "📌",
    label: "한 줄 요약과 마감일",
    title: "목록만 훑어도\n챙겨야 할 공지가 보여요",
    body: "AI가 모든 공지에 한 줄 요약과 마감일을 달아드려요.\n이제 스크롤할 필요 없어요.",
    image: noticeListSummary,
  },
  {
    icon: "✨",
    label: "AI 본문 요약",
    title: "길게 읽을 필요 없이,\n핵심만 확인하세요",
    body: "공지를 열면 AI가 본문을 요약해드려요.\n대상, 해야 할 일, 참고사항까지 태그로 정리돼요.",
    image: noticeBodySummary,
  },
  {
    icon: "🔔",
    label: "맞춤 알림",
    title: "보고 싶은 공지만\n골라서 받아보세요",
    body: "관심 있는 학과와 카테고리만 선택하면,\n새 공지가 올라올 때마다 알려드려요.",
  },
];

export default function NoticeSection() {
  return (
    <section className="py-24 md:py-32 bg-grey-50">
      <div className="mx-auto max-w-[720px] px-6">
        <div className="text-left">
          <AnimatedReveal>
            <p className="text-[20px] md:text-[28px] font-bold text-brand mb-2">
              AI 공지
            </p>
          </AnimatedReveal>
          <AnimatedReveal delay={0.1}>
            <h2 className="text-[28px] md:text-[42px] font-bold text-grey-900 whitespace-pre-line tracking-tight leading-[1.25]">
              {"놓칠 일 없이,\n공지는 이미 요약되어 있어요"}
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
                  <div className="mt-10 w-full rounded-3xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden">
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
