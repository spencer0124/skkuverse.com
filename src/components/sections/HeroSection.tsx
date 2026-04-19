"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      <div className="relative z-10 mx-auto max-w-[1140px] px-6 text-center pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex justify-center mb-6"
        >
          <Image
            src="/logo.svg"
            alt="스꾸버스 로고"
            width={80}
            height={80}
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-[0_6px_20px_rgba(31,61,46,0.25)]"
            unoptimized
            priority
          />
        </motion.div>

        <motion.h1
          className="text-t1 md:text-[56px] lg:text-[72px] font-bold text-grey-900 leading-[1.1] tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.15,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          <span className="text-brand">스꾸버스</span>
          <br />
          성대생이 만드는 캠퍼스
        </motion.h1>

        <motion.p
          className="mt-6 text-t5 md:text-t4 text-grey-500 font-normal max-w-lg mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          오늘의 공지·셔틀·장소, 성대생이 함께
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.45,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          <Button href="#download" size="lg">
            앱 다운로드
          </Button>
          <Button href="#features" variant="secondary" size="lg">
            기능 살펴보기
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-grey-300 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-2.5 rounded-full bg-grey-400" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
