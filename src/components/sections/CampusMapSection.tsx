"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import AnimatedReveal from "@/components/ui/AnimatedReveal";
import PhoneMockup from "@/components/ui/PhoneMockup";

export default function CampusMapSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 17%", "end end"],
  });

  // Slide starts immediately at progress 0 (so the horizontal motion begins
  // while the "캠퍼스맵" label is still visible above), then dwells at phone 2
  // centered for the last 25% of the pin. No opening dwell — it would burn
  // scroll budget while the label disappears off the top.
  // ±28% of the row's own width ≈ (phone width + gap) / 2 at both breakpoints.
  const groupX = useTransform(
    scrollYProgress,
    [0, 0.75, 1],
    ["28%", "-28%", "-28%"],
  );

  return (
    <section className="bg-grey-50">
      <div className="pt-24 md:pt-32">
        <div className="mx-auto max-w-[720px] px-6">
          <div className="text-left">
            <AnimatedReveal>
              <p className="text-[20px] md:text-[28px] font-bold text-brand mb-2">
                캠퍼스맵
              </p>
            </AnimatedReveal>
            <AnimatedReveal delay={0.1}>
              <h2 className="text-[28px] md:text-[42px] font-bold text-grey-900 whitespace-pre-line tracking-tight leading-[1.25]">
                {"강의실 찾기,\n더 이상 헤매지 않아요"}
              </h2>
            </AnimatedReveal>
          </div>
        </div>
      </div>

      <div ref={sectionRef} className="relative h-[150vh]">
        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
          <motion.div
            style={{ x: groupX }}
            className="flex items-center gap-16 md:gap-24 will-change-transform"
          >
            <div className="shrink-0 scale-[0.85]">
              <PhoneMockup />
            </div>
            <div className="shrink-0 scale-[0.85]">
              <PhoneMockup />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
