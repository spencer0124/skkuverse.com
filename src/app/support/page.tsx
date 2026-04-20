import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnimatedReveal from "@/components/ui/AnimatedReveal";

export const metadata: Metadata = {
  title: "문의하기",
  description:
    "스꾸버스 서비스에 대한 문의를 카카오톡 또는 이메일로 보내주세요.",
};

export default function SupportPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-[640px] px-6">
          <AnimatedReveal>
            <div className="text-center mb-12">
              <h1 className="text-display font-bold text-grey-900 mb-4">
                문의하기
              </h1>
              <p className="text-t5 text-grey-500">
                스꾸버스 서비스에 대해 궁금한 점이 있으시면
                <br />
                아래 채널을 통해 편하게 문의해주세요.
              </p>
            </div>
          </AnimatedReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatedReveal delay={0.1}>
              <a
                href="http://pf.kakao.com/_cjxexdG/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-grey-50 rounded-2xl p-8 hover:bg-grey-100 transition-colors group"
              >
                <div className="text-3xl mb-4">💬</div>
                <h2 className="text-t4 font-bold text-grey-900 mb-2">
                  카카오톡 문의
                </h2>
                <p className="text-t6 text-grey-500">
                  카카오톡 채널에서 실시간으로 문의하실 수 있어요.
                </p>
                <div className="mt-4 text-t6 font-medium text-brand group-hover:underline">
                  채팅 시작하기 →
                </div>
              </a>
            </AnimatedReveal>

            <AnimatedReveal delay={0.2}>
              <a
                href="mailto:zoyoong124@gmail.com"
                className="block bg-grey-50 rounded-2xl p-8 hover:bg-grey-100 transition-colors group"
              >
                <div className="text-3xl mb-4">✉️</div>
                <h2 className="text-t4 font-bold text-grey-900 mb-2">
                  이메일 문의
                </h2>
                <p className="text-t6 text-grey-500">
                  이메일로 문의를 보내주시면 빠르게 답변드릴게요.
                </p>
                <div className="mt-4 text-t6 font-medium text-brand group-hover:underline">
                  zoyoong124@gmail.com →
                </div>
              </a>
            </AnimatedReveal>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
