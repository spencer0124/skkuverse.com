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
// Wordmark reveal = two side-by-side masked slots. Each slot is overflow:hidden
// with height 1em and an inner 2-row stack. When the reveal progresses, the stack
// slides up by 1em — old word (스꾸/버스) exits the top of the slot and new word
// (성균관/유니버스) slides into place from below. The "white box" masking effect
// is the slot's own overflow:hidden boundary.
//
// 0.00 → 0.18 : Button fade-out (subhead + chevron stay persistent)
// 0.22 → 0.44 : SPLIT (left slot ← -1em, right slot → +1em)
// 0.30 → 0.42 : LEFT stack slide — 스꾸 → 성균관
// 0.46 → 0.58 : RIGHT stack slide — 버스 → 유니버스 (staggered after left)
// 0.62 → 0.74 : Accent line
// 0.72 → 0.82 : SKKUverse subtitle + radial glow
// 0.82 → 0.92 : Campus, Connected.
// 0.92 → 1.00 : hold before unpin

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Split — translate calibrated so the final 성균관·유니버스 gap ≈ 0.25em
  // (same as the initial 스꾸 버스 space). Assuming Korean bold chars render
  // at ~0.85em each, ±0.6em split places text edges one space apart.
  const leftX = useTransform(scrollYProgress, [0.22, 0.44], ["0em", "-0.6em"]);
  const rightX = useTransform(scrollYProgress, [0.22, 0.44], ["0em", "0.6em"]);

  // Refs for direct DOM manipulation (bypass stuck-opacity bug).
  const buttonRef = useRef<HTMLDivElement>(null);
  // Each slot has two absolute rows that slide together (old text exits top,
  // new text enters from below). Slot width is locked to the OLD text's
  // intrinsic width via a visibility:hidden spacer, so the initial "스꾸버스"
  // sits at a tight space-bar gap instead of the wider-text's centered padding.
  const row1LeftRef = useRef<HTMLSpanElement>(null);
  const row2LeftRef = useRef<HTMLSpanElement>(null);
  const row1RightRef = useRef<HTMLSpanElement>(null);
  const row2RightRef = useRef<HTMLSpanElement>(null);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // 1) Button fade over [0, 0.18]
    const heroP = Math.max(0, Math.min(1, latest / 0.18));
    if (buttonRef.current) {
      buttonRef.current.style.opacity = String(1 - heroP);
      buttonRef.current.style.transform = `translateY(${-heroP * 24}px)`;
    }

    // 2) LEFT slot slide [0.30, 0.42] — 스꾸 exits top, 성균관 enters from below
    const leftP = Math.max(0, Math.min(1, (latest - 0.3) / (0.42 - 0.3)));
    if (row1LeftRef.current) {
      row1LeftRef.current.style.transform = `translateX(-50%) translateY(${-leftP}em)`;
    }
    if (row2LeftRef.current) {
      row2LeftRef.current.style.transform = `translateX(-50%) translateY(${1 - leftP}em)`;
    }

    // 3) RIGHT slot slide [0.46, 0.58] — 버스 exits top, 유니버스 enters (staggered)
    const rightP = Math.max(0, Math.min(1, (latest - 0.46) / (0.58 - 0.46)));
    if (row1RightRef.current) {
      row1RightRef.current.style.transform = `translateX(-50%) translateY(${-rightP}em)`;
    }
    if (row2RightRef.current) {
      row2RightRef.current.style.transform = `translateX(-50%) translateY(${1 - rightP}em)`;
    }
  });

  // Splash-phase values (shifted back to leave room for staggered stack slides).
  const lineWidth = useTransform(scrollYProgress, [0.62, 0.74], ["0%", "60%"]);
  const lineOpacity = useTransform(scrollYProgress, [0.62, 0.74], [0, 0.35]);
  const subOpacity = useTransform(scrollYProgress, [0.72, 0.82], [0, 1]);
  const subY = useTransform(scrollYProgress, [0.72, 0.82], ["20px", "0px"]);
  const glowScale = useTransform(scrollYProgress, [0.72, 0.92], [0.5, 1]);
  const tagOpacity = useTransform(scrollYProgress, [0.82, 0.92], [0, 1]);
  const tagY = useTransform(scrollYProgress, [0.82, 0.92], ["16px", "0px"]);

  return (
    <section ref={sectionRef} className="relative h-[130vh] bg-white">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative z-10 mx-auto max-w-[1140px] px-6 text-center pt-32 md:pt-40 pb-20 h-full flex flex-col items-center">
          {/* Radial glow */}
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

          {/* CTA — fades out */}
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
