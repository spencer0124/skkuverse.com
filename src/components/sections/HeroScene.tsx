"use client";

type IconSpec = {
  emoji: string;
  label: string;
  /** Positioning — mirrors the mockup absolute percentages. */
  style: React.CSSProperties;
  /** Rendered font-size at desktop scale (mobile gets clamp'd via CSS). */
  size: number;
  rotate: number;
  /** Seconds — staggers the float loop so icons feel uncoordinated. */
  delay: number;
  /** Megaphone uses a different keyframe (rotation bundled in). */
  mega?: boolean;
};

const ICONS: IconSpec[] = [
  {
    emoji: "📢",
    label: "megaphone",
    style: { top: "35%", left: "50%" },
    size: 96,
    rotate: -8,
    delay: 0,
    mega: true,
  },
  {
    emoji: "🚌",
    label: "bus",
    style: { top: "15%", right: "8%" },
    size: 64,
    rotate: 6,
    delay: 0.8,
  },
  {
    emoji: "🗺️",
    label: "map",
    style: { bottom: "15%", left: "8%" },
    size: 68,
    rotate: -12,
    delay: 1.4,
  },
  {
    emoji: "📚",
    label: "book",
    style: { top: "18%", left: "12%" },
    size: 52,
    rotate: -15,
    delay: 2,
  },
  {
    emoji: "⏰",
    label: "clock",
    style: { bottom: "20%", right: "14%" },
    size: 54,
    rotate: 10,
    delay: 2.6,
  },
  {
    emoji: "🔔",
    label: "bell",
    style: { top: "52%", right: "28%" },
    size: 44,
    rotate: -5,
    delay: 3.2,
  },
];

// All greens resolve from --color-brand (memory rule: no hardcoded hex).
// Shadow weakened per design feedback — ground shadow is a soft hint, not a halo.
const SCENE_SHADOW = "color-mix(in srgb, var(--color-brand) 10%, transparent)";
const SCENE_SHADOW_GROUND = "color-mix(in srgb, var(--color-brand) 12%, transparent)";

export default function HeroScene() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 z-[5]"
      style={{
        top: "clamp(380px, 58%, 620px)",
        bottom: "clamp(80px, 12%, 160px)",
      }}
    >
      <div className="relative mx-auto h-full" style={{ width: "min(600px, 92vw)" }}>
        {ICONS.map((icon) => {
          const animation = icon.mega
            ? "hero-scene-float-mega 5s ease-in-out infinite"
            : "hero-scene-float 4s ease-in-out infinite";

          // Non-mega icons: rotation is passed to the keyframe via --hero-rot
          // so the same animation can transform translateY AND preserve the
          // per-icon tilt. Mega bakes rotation into its dedicated keyframe.
          const extraStyle: React.CSSProperties = icon.mega
            ? { transform: `translate(-50%, -50%) rotate(${icon.rotate}deg)` }
            : { ["--hero-rot" as string]: `${icon.rotate}deg` };

          return (
            <span
              key={icon.label}
              className="hero-scene-icon absolute grid place-items-center"
              style={{
                ...icon.style,
                fontFamily: '"Tossface", "Apple Color Emoji", "Segoe UI Emoji", sans-serif',
                fontSize: `clamp(${Math.round(icon.size * 0.6)}px, ${icon.size / 4.3}vw, ${icon.size}px)`,
                // Softer drop-shadow — less lift, tighter spread.
                filter: `drop-shadow(0 3px 4px ${SCENE_SHADOW})`,
                animation,
                animationDelay: `${icon.delay}s`,
                willChange: "transform",
                lineHeight: 1,
                // Consumed by the ::after ground shadow (globals.css).
                ["--hero-scene-shadow" as string]: SCENE_SHADOW_GROUND,
                ...extraStyle,
              }}
            >
              {icon.emoji}
            </span>
          );
        })}
      </div>
    </div>
  );
}
