"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import Button from "@/components/ui/Button";
import HeroScene from "@/components/sections/HeroScene";

// Scroll choreography (scrollYProgress 0..1, over 30vh of pinned scroll in h-[130vh])
//
// Wordmark reveal = two side-by-side masked slots. Each slot is overflow:hidden
// with height 1em and an inner 2-row stack. When the reveal progresses, the stack
// slides up by 1em — old word (스꾸/버스) exits the top of the slot and new word
// (성균관/유니버스) slides into place from below.
//
// 0.22 → 0.44 : SPLIT (left slot ← -0.6em, right slot → +0.6em)
// 0.30 → 0.42 : LEFT stack slide — 스꾸 → 성균관
// 0.46 → 0.58 : RIGHT stack slide — 버스 → 유니버스 (staggered after left)
// CTA + floating emoji scene stay visible the whole time.

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const leftX = useTransform(scrollYProgress, [0.22, 0.44], ["0em", "-0.6em"]);
  const rightX = useTransform(scrollYProgress, [0.22, 0.44], ["0em", "0.6em"]);

  const row1LeftRef = useRef<HTMLSpanElement>(null);
  const row2LeftRef = useRef<HTMLSpanElement>(null);
  const row1RightRef = useRef<HTMLSpanElement>(null);
  const row2RightRef = useRef<HTMLSpanElement>(null);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // LEFT slot slide [0.30, 0.42] — 스꾸 exits top, 성균관 enters from below
    const leftP = Math.max(0, Math.min(1, (latest - 0.3) / (0.42 - 0.3)));
    if (row1LeftRef.current) {
      row1LeftRef.current.style.transform = `translateX(-50%) translateY(${-leftP}em)`;
    }
    if (row2LeftRef.current) {
      row2LeftRef.current.style.transform = `translateX(-50%) translateY(${1 - leftP}em)`;
    }

    // RIGHT slot slide [0.46, 0.58] — 버스 exits top, 유니버스 enters (staggered)
    const rightP = Math.max(0, Math.min(1, (latest - 0.46) / (0.58 - 0.46)));
    if (row1RightRef.current) {
      row1RightRef.current.style.transform = `translateX(-50%) translateY(${-rightP}em)`;
    }
    if (row2RightRef.current) {
      row2RightRef.current.style.transform = `translateX(-50%) translateY(${1 - rightP}em)`;
    }
  });

  return (
    <section ref={sectionRef} className="relative h-[130vh]">
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{
          // Subtle brand-green ambient background — top bleeds into white at
          // the bottom so the section dissolves into the next block.
          background: `linear-gradient(180deg,
            color-mix(in srgb, var(--color-brand) 10%, white) 0%,
            color-mix(in srgb, var(--color-brand) 4%, white) 55%,
            #ffffff 100%)`,
        }}
      >
        {/* Floating-emoji scene — stays at 100% opacity throughout. */}
        <HeroScene />
        <div className="relative z-10 mx-auto max-w-[1140px] px-6 text-center pt-32 md:pt-40 pb-20 h-full flex flex-col items-center">
          {/* Subhead — persistent; placed above the wordmark */}
          <div className="relative z-10 text-[44px] md:text-[80px] lg:text-[104px] font-bold text-grey-900 leading-[1.2] tracking-[-0.03em]">
            내 손 안에 성균관대
          </div>

          {/* Wordmark row: each slot is inline-block sized to the INITIAL text's
              intrinsic width via a visibility:hidden spacer. The bigger texts
              (성균관/유니버스) are absolute children that overflow horizontally
              (clip-path opens left/right but masks top/bottom). */}
          <div className="relative z-10 flex items-baseline justify-center gap-[0.25em] text-brand text-[44px] md:text-[80px] lg:text-[104px] font-bold tracking-[-0.03em]">
            {/* Left slot */}
            <motion.div
              className="relative inline-block text-center"
              style={{
                x: leftX,
                height: "1em",
                lineHeight: 1,
                clipPath: "inset(0 -9999em)",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ visibility: "hidden" }}>스꾸</span>
              <span
                ref={row1LeftRef}
                className="absolute top-0"
                style={{
                  left: "50%",
                  transform: "translateX(-50%) translateY(0em)",
                  willChange: "transform",
                }}
              >
                스꾸
              </span>
              <span
                ref={row2LeftRef}
                className="absolute top-0"
                style={{
                  left: "50%",
                  transform: "translateX(-50%) translateY(1em)",
                  willChange: "transform",
                }}
              >
                성균관
              </span>
            </motion.div>

            {/* Right slot */}
            <motion.div
              className="relative inline-block text-center"
              style={{
                x: rightX,
                height: "1em",
                lineHeight: 1,
                clipPath: "inset(0 -9999em)",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ visibility: "hidden" }}>버스</span>
              <span
                ref={row1RightRef}
                className="absolute top-0"
                style={{
                  left: "50%",
                  transform: "translateX(-50%) translateY(0em)",
                  willChange: "transform",
                }}
              >
                버스
              </span>
              <span
                ref={row2RightRef}
                className="absolute top-0"
                style={{
                  left: "50%",
                  transform: "translateX(-50%) translateY(1em)",
                  willChange: "transform",
                }}
              >
                유니버스
              </span>
            </motion.div>
          </div>

          {/* CTA — persistent (never fades) */}
          <div className="relative z-10 mt-12 flex items-center justify-center">
            <Button href="#download" size="lg">
              앱 다운로드
            </Button>
          </div>
        </div>

        {/* Scroll indicator — persistent */}
        <div
          className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 text-grey-500 z-20 pointer-events-none"
          aria-hidden
        >
          <motion.div
            animate={{ y: [0, 14, 0] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: [0.45, 0, 0.55, 1],
            }}
          >
            <svg
              width="52"
              height="22"
              viewBox="0 0 52 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 5l21 12 21-12" />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
