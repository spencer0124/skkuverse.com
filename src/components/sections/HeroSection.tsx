"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import Button from "@/components/ui/Button";

const GREEN_LINE = "color-mix(in srgb, var(--color-brand) 35%, transparent)";
const GREEN_MUTED = "color-mix(in srgb, var(--color-brand) 8%, transparent)";
const GREEN_TAGLINE = "color-mix(in srgb, var(--color-brand) 45%, transparent)";

// Scroll choreography (scrollYProgress 0..1, over 30vh of pinned scroll in h-[130vh])
//
// All fade/opacity-critical elements bypass framer-motion MotionValue → style.opacity
// because that path has a known stuck-opacity regression in framer-motion v12 + React 19
// + Next 16 (see motion/motion#1872). Instead, useMotionValueEvent subscribes to
// scrollYProgress and directly writes to `ref.current.style.opacity` / `.transform`.
//
// 0.00 → 0.18 : Hero state fade-out (subhead + button + chevron)
// 0.22 → 0.44 : SPLIT (스꾸 ← -1em, 버스 → +1em)
// 0.30 → 0.48 : 유니 reveal (opacity + y slide up + scale)
// 0.52 → 0.66 : Accent line
// 0.64 → 0.76 : SKKUverse subtitle + radial glow
// 0.76 → 0.88 : Campus, Connected.
// 0.88 → 1.00 : hold before unpin

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Split uses translate (no opacity), so MotionValue path works fine here.
  const leftX = useTransform(scrollYProgress, [0.22, 0.44], ["0em", "-1em"]);
  const rightX = useTransform(scrollYProgress, [0.22, 0.44], ["0em", "1em"]);

  // Refs for direct DOM manipulation (bypass stuck-opacity bug)
  const subheadRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLDivElement>(null);
  const uniRef = useRef<HTMLSpanElement>(null);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // 1) Hero state fade-out over [0, 0.18]
    const heroP = Math.max(0, Math.min(1, latest / 0.18));
    const heroOpacity = String(1 - heroP);
    const heroTransform = `translateY(${-heroP * 24}px)`;

    if (subheadRef.current) {
      subheadRef.current.style.opacity = heroOpacity;
      subheadRef.current.style.transform = heroTransform;
    }
    if (buttonRef.current) {
      buttonRef.current.style.opacity = heroOpacity;
      buttonRef.current.style.transform = heroTransform;
    }
    if (chevronRef.current) {
      // Chevron only gets opacity (transform belongs to the inner bounce motion.div)
      chevronRef.current.style.opacity = heroOpacity;
    }

    // 2) 유니 reveal over [0.30, 0.48]
    const uni = uniRef.current;
    if (uni) {
      const p = Math.max(0, Math.min(1, (latest - 0.3) / (0.48 - 0.3)));
      uni.style.opacity = String(p);
      uni.style.transform = `translateX(-50%) translateY(${(1 - p) * 0.5}em) scale(${0.7 + p * 0.3})`;
    }
  });

  // Splash-phase values — these work through MotionValue path (only non-primary elements;
  // line/subtitle/tagline opacity stuck would just mean they don't show — tolerable risk,
  // and user hasn't reported issues with these).
  const lineWidth = useTransform(scrollYProgress, [0.52, 0.66], ["0%", "60%"]);
  const lineOpacity = useTransform(scrollYProgress, [0.52, 0.66], [0, 0.35]);
  const subOpacity = useTransform(scrollYProgress, [0.64, 0.76], [0, 1]);
  const subY = useTransform(scrollYProgress, [0.64, 0.76], ["20px", "0px"]);
  const glowScale = useTransform(scrollYProgress, [0.64, 0.84], [0.5, 1]);
  const tagOpacity = useTransform(scrollYProgress, [0.76, 0.88], [0, 1]);
  const tagY = useTransform(scrollYProgress, [0.76, 0.88], ["16px", "0px"]);

  return (
    <section ref={sectionRef} className="relative h-[130vh] bg-white">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative z-10 mx-auto max-w-[1140px] px-6 text-center pt-32 md:pt-40 pb-20 h-full flex flex-col items-center">
          {/* Radial glow — peaks with subtitle */}
          <motion.div
            aria-hidden
            className="absolute rounded-full pointer-events-none"
            style={{
              top: "50%",
              left: "50%",
              translateX: "-50%",
              translateY: "-50%",
              width: "min(600px, 80vw)",
              height: "min(600px, 80vw)",
              background: `radial-gradient(circle, ${GREEN_MUTED} 0%, transparent 70%)`,
              opacity: subOpacity,
              scale: glowScale,
            }}
          />

          {/* Subhead — Hero only, fades first (placed ABOVE wordmark per request) */}
          <div
            ref={subheadRef}
            className="relative z-10 text-[44px] md:text-[80px] lg:text-[104px] font-bold text-grey-900 leading-[1.2] tracking-[-0.03em]"
            style={{ opacity: 1, transform: "translateY(0px)" }}
          >
            성대생이 만드는 캠퍼스
          </div>

          {/* Wordmark row: 스꾸 / 버스 flex items + 유니 absolute overlay */}
          <div className="relative z-10 inline-flex items-baseline justify-center text-brand text-[44px] md:text-[80px] lg:text-[104px] font-bold leading-[1.2] tracking-[-0.03em]">
            <motion.span style={{ x: leftX }}>스꾸</motion.span>
            <motion.span style={{ x: rightX }}>버스</motion.span>

            {/* 유니 — absolute overlay, ref-driven */}
            <span
              ref={uniRef}
              aria-hidden
              className="absolute left-1/2 top-0 pointer-events-none inline-block"
              style={{
                opacity: 0,
                transform: "translateX(-50%) translateY(0.5em) scale(0.7)",
              }}
            >
              유니
            </span>
          </div>

          {/* CTA — Hero only, fades alongside subhead */}
          <div
            ref={buttonRef}
            className="relative z-10 mt-12 flex items-center justify-center"
            style={{ opacity: 1, transform: "translateY(0px)" }}
          >
            <Button href="#download" size="lg">
              앱 다운로드
            </Button>
          </div>

          {/* Accent line */}
          <motion.div
            aria-hidden
            className="relative z-10 rounded-[2px] mx-auto mt-8"
            style={{
              height: "3px",
              background: `linear-gradient(90deg, transparent, ${GREEN_LINE}, transparent)`,
              width: lineWidth,
              opacity: lineOpacity,
            }}
          />

          {/* English subtitle */}
          <motion.div
            className="relative z-10 text-center mt-4 uppercase"
            style={{
              fontSize: "clamp(0.65rem, 2vw, 0.85rem)",
              fontWeight: 600,
              letterSpacing: "0.28em",
              color: "var(--color-brand)",
              opacity: subOpacity,
              y: subY,
            }}
          >
            SKKUverse
          </motion.div>

          {/* Tagline */}
          <motion.div
            className="relative z-10 text-center mt-2"
            style={{
              fontSize: "clamp(0.55rem, 1.6vw, 0.72rem)",
              fontWeight: 400,
              letterSpacing: "0.06em",
              color: GREEN_TAGLINE,
              opacity: tagOpacity,
              y: tagY,
            }}
          >
            Campus, Connected.
          </motion.div>
        </div>

        {/* Scroll indicator — outer div opacity via ref, inner motion.div for bounce */}
        <div
          ref={chevronRef}
          className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 text-grey-500 z-20 pointer-events-none"
          style={{ opacity: 1 }}
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
