import { useState, useEffect, useCallback, useRef } from "react";

const GREEN = "#2B5A3A";
const GREEN_LIGHT = "#3D7A52";
const GREEN_MUTED = "rgba(43, 90, 58, 0.08)";

// Toss-style spring curves
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const SMOOTH = "cubic-bezier(0.16, 1, 0.3, 1)";
const DECEL = "cubic-bezier(0.0, 0.0, 0.2, 1)";

export default function SKKUverseSplash() {
  const [step, setStep] = useState(0);
  // 0: initial (스꾸버스 centered)
  // 1: split (스꾸 ← → 버스)
  // 2: reveal (유니 appears)
  // 3: settle (fully open, subtitle appears)
  // 4: glow (final polish)
  const [runKey, setRunKey] = useState(0);
  const timers = useRef([]);

  const delay = useCallback((fn, ms) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
    return t;
  }, []);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStep(0);

    delay(() => setStep(1), 800);    // split starts
    delay(() => setStep(2), 1150);   // 유니 starts revealing (350ms stagger)
    delay(() => setStep(3), 1900);   // settled, subtitle fades in
    delay(() => setStep(4), 2600);   // final glow/polish

    return () => timers.current.forEach(clearTimeout);
  }, [runKey, delay]);

  const replay = useCallback(() => {
    setStep(0);
    setRunKey((k) => k + 1);
  }, []);

  const isOpen = step >= 1;
  const isRevealing = step >= 2;
  const isSettled = step >= 3;
  const isFinal = step >= 4;

  const fontSize = "clamp(2.6rem, 10vw, 5.6rem)";
  const baseStyle = {
    fontSize,
    fontWeight: 800,
    color: GREEN,
    letterSpacing: "-0.04em",
    lineHeight: 1,
    willChange: "transform",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          "'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
        WebkitFontSmoothing: "antialiased",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        userSelect: "none",
      }}
      onClick={replay}
    >
      {/* Subtle radial glow behind text */}
      <div
        style={{
          position: "absolute",
          width: "min(600px, 80vw)",
          height: "min(600px, 80vw)",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${GREEN_MUTED} 0%, transparent 70%)`,
          opacity: isSettled ? 1 : 0,
          transform: isSettled ? "scale(1)" : "scale(0.5)",
          transition: `opacity 1.2s ${DECEL}, transform 1.6s ${SMOOTH}`,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative" }}>
        {/* Main wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            position: "relative",
          }}
        >
          {/* 스꾸 */}
          <span
            style={{
              ...baseStyle,
              transform: isOpen ? "translateX(-0.12em)" : "translateX(0)",
              transition: `transform 0.85s ${SPRING}`,
              transitionDelay: "0s",
            }}
          >
            스꾸
          </span>

          {/* 유니 reveal container */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "baseline",
              overflow: "hidden",
              // Use em-based width tied to the font size — stable for Korean
              maxWidth: isRevealing ? "4.8em" : "0em",
              transition: `max-width ${isRevealing ? "0.9s" : "0.5s"} ${SMOOTH}`,
              transitionDelay: isRevealing ? "0s" : "0s",
            }}
          >
            {/* Inner text with independent slide + fade */}
            <span
              style={{
                ...baseStyle,
                whiteSpace: "nowrap",
                display: "inline-flex",
                gap: "0.01em",
              }}
            >
              {["유", "니"].map((char, i) => (
                <span
                  key={char}
                  style={{
                    display: "inline-block",
                    opacity: isRevealing ? 1 : 0,
                    transform: isRevealing
                      ? "translateX(0) translateY(0) scale(1)"
                      : "translateX(-0.6em) translateY(0.05em) scale(0.88)",
                    filter: isRevealing && !isSettled ? "blur(0.8px)" : "blur(0)",
                    transition: [
                      `opacity 0.45s ease`,
                      `transform 0.85s ${SPRING}`,
                      `filter 0.5s ease`,
                    ].join(", "),
                    // Per-character stagger — the Toss signature
                    transitionDelay: isRevealing
                      ? `${i * 80 + 80}ms`
                      : "0ms",
                  }}
                >
                  {char}
                </span>
              ))}
            </span>
          </div>

          {/* 버스 */}
          <span
            style={{
              ...baseStyle,
              transform: isOpen ? "translateX(0.12em)" : "translateX(0)",
              transition: `transform 0.85s ${SPRING}`,
              transitionDelay: "50ms",
            }}
          >
            버스
          </span>
        </div>

        {/* Accent line — grows from center */}
        <div
          style={{
            height: "3px",
            borderRadius: "2px",
            background: `linear-gradient(90deg, transparent, ${GREEN_LIGHT}, transparent)`,
            margin: "0.7em auto 0",
            width: isSettled ? "80%" : "0%",
            opacity: isSettled ? 0.35 : 0,
            transition: `width 0.9s ${SMOOTH}, opacity 0.6s ease`,
            transitionDelay: isSettled ? "100ms" : "0ms",
          }}
        />

        {/* English subtitle */}
        <div
          style={{
            textAlign: "center",
            marginTop: "0.85em",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontSize: "clamp(0.65rem, 2vw, 0.85rem)",
              fontWeight: 600,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: GREEN_LIGHT,
              opacity: isSettled ? 1 : 0,
              transform: isSettled
                ? "translateY(0)"
                : "translateY(0.8em)",
              transition: `opacity 0.7s ease, transform 0.8s ${SMOOTH}`,
              transitionDelay: isSettled ? "250ms" : "0ms",
            }}
          >
            SKKUverse
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            textAlign: "center",
            marginTop: "0.5em",
          }}
        >
          <div
            style={{
              fontSize: "clamp(0.55rem, 1.6vw, 0.72rem)",
              fontWeight: 400,
              letterSpacing: "0.06em",
              color: "rgba(43, 90, 58, 0.45)",
              opacity: isFinal ? 1 : 0,
              transform: isFinal ? "translateY(0)" : "translateY(0.5em)",
              transition: `opacity 0.8s ease, transform 0.7s ${SMOOTH}`,
              transitionDelay: isFinal ? "100ms" : "0ms",
            }}
          >
            Campus, Connected.
          </div>
        </div>
      </div>

      {/* Replay hint */}
      <div
        style={{
          position: "absolute",
          bottom: "clamp(2rem, 6vh, 4rem)",
          display: "flex",
          alignItems: "center",
          gap: "0.5em",
          color: "#c8c8c8",
          fontSize: "0.6rem",
          fontWeight: 500,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          opacity: isFinal ? 1 : 0,
          transition: "opacity 1s ease",
          transitionDelay: "600ms",
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            opacity: 0.6,
          }}
        >
          <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
        </svg>
        tap to replay
      </div>
    </div>
  );
}
