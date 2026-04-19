"use client";

import { useRef, type CSSProperties } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// All greens resolve from --color-brand (globals.css) — single source of truth.
// Alpha variants derived via color-mix so swapping the token cascades everywhere.
const GREEN = "var(--color-brand)";
const GREEN_LIGHT = "var(--color-brand)";
const GREEN_MUTED = "color-mix(in srgb, var(--color-brand) 8%, transparent)";
const GREEN_LINE = "color-mix(in srgb, var(--color-brand) 35%, transparent)";
const GREEN_TAGLINE = "color-mix(in srgb, var(--color-brand) 45%, transparent)";

// Phase ranges expressed as scrollYProgress (0..1).
// The 7-phase TSX timeline (total 2700 ms) is compressed into 0..0.85 to
// preserve original rhythm; 0.85..1 holds the settled wordmark before unpin.
//   SPLIT end    ≈ 0.25   (was 800/2700)
//   REVEAL open  ≈ 0.25→0.45  (was 1150→ ~2050/2700)
//   CHAR_1       ≈ 0.30→0.42 (was 1230/2700)
//   CHAR_2       ≈ 0.33→0.45 (was 1310/2700, +80 ms stagger)
//   LINE         ≈ 0.55→0.70 (was 1900/2700)
//   SUBTITLE     ≈ 0.68→0.78 (was 2150/2700)
//   TAGLINE      ≈ 0.78→0.90 (was 2700/2700)

export default function SplashSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // 스꾸 / 버스 split
  const leftX = useTransform(scrollYProgress, [0, 0.25], ["0em", "-0.06em"]);
  const rightX = useTransform(scrollYProgress, [0, 0.25], ["0em", "0.06em"]);

  // 유니 reveal container width
  const revealWidth = useTransform(
    scrollYProgress,
    [0.25, 0.45],
    ["0em", "2.1em"]
  );

  // 유
  const c1Opacity = useTransform(scrollYProgress, [0.30, 0.42], [0, 1]);
  const c1X = useTransform(scrollYProgress, [0.30, 0.42], ["-0.3em", "0em"]);
  const c1Scale = useTransform(scrollYProgress, [0.30, 0.42], [0.88, 1]);

  // 니 (80 ms stagger ≈ 0.03 progress)
  const c2Opacity = useTransform(scrollYProgress, [0.33, 0.45], [0, 1]);
  const c2X = useTransform(scrollYProgress, [0.33, 0.45], ["-0.3em", "0em"]);
  const c2Scale = useTransform(scrollYProgress, [0.33, 0.45], [0.88, 1]);

  // Accent line
  const lineWidth = useTransform(scrollYProgress, [0.55, 0.70], ["0%", "80%"]);
  const lineOpacity = useTransform(scrollYProgress, [0.55, 0.70], [0, 0.35]);

  // Subtitle + glow share timing
  const subOpacity = useTransform(scrollYProgress, [0.68, 0.78], [0, 1]);
  const subY = useTransform(scrollYProgress, [0.68, 0.78], ["0.8em", "0em"]);
  const glowScale = useTransform(scrollYProgress, [0.68, 0.85], [0.5, 1]);

  // Tagline
  const tagOpacity = useTransform(scrollYProgress, [0.78, 0.90], [0, 1]);
  const tagY = useTransform(scrollYProgress, [0.78, 0.90], ["0.5em", "0em"]);

  const textBase: CSSProperties = {
    fontWeight: 800,
    color: GREEN,
    letterSpacing: "-0.04em",
    lineHeight: 1,
    fontSize: "clamp(2.6rem, 10vw, 3.5rem)",
  };

  return (
    <section ref={sectionRef} className="relative h-[200vh] bg-white">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        <motion.div
          aria-hidden
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "min(600px, 80vw)",
            height: "min(600px, 80vw)",
            background: `radial-gradient(circle, ${GREEN_MUTED} 0%, transparent 70%)`,
            opacity: subOpacity,
            scale: glowScale,
          }}
        />

        <div className="relative">
          <div className="flex items-baseline">
            <motion.span style={{ ...textBase, x: leftX }}>스꾸</motion.span>

            <motion.span
              className="inline-flex items-baseline overflow-hidden"
              style={{ width: revealWidth }}
            >
              <span className="inline-flex items-baseline whitespace-nowrap">
                <motion.span
                  style={{
                    ...textBase,
                    display: "inline-block",
                    opacity: c1Opacity,
                    x: c1X,
                    scale: c1Scale,
                  }}
                >
                  유
                </motion.span>
                <motion.span
                  style={{
                    ...textBase,
                    display: "inline-block",
                    opacity: c2Opacity,
                    x: c2X,
                    scale: c2Scale,
                  }}
                >
                  니
                </motion.span>
              </span>
            </motion.span>

            <motion.span style={{ ...textBase, x: rightX }}>버스</motion.span>
          </div>

          <motion.div
            aria-hidden
            className="rounded-[2px] mx-auto"
            style={{
              height: "3px",
              marginTop: "0.7em",
              background: `linear-gradient(90deg, transparent, ${GREEN_LINE}, transparent)`,
              width: lineWidth,
              opacity: lineOpacity,
            }}
          />

          <div
            className="text-center overflow-hidden"
            style={{ marginTop: "0.85em" }}
          >
            <motion.div
              style={{
                fontSize: "clamp(0.65rem, 2vw, 0.85rem)",
                fontWeight: 600,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: GREEN_LIGHT,
                opacity: subOpacity,
                y: subY,
              }}
            >
              SKKUverse
            </motion.div>
          </div>

          <div className="text-center" style={{ marginTop: "0.5em" }}>
            <motion.div
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
        </div>
      </div>
    </section>
  );
}
