import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
  runOnJS,
  interpolate,
} from "react-native-reanimated";

// ─── Brand tokens ────────────────────────────────────────────
const GREEN = "#2B5A3A";
const GREEN_LIGHT = "#3D7A52";

// ─── Animation configs ──────────────────────────────────────
const SPRING = { damping: 14, stiffness: 120, mass: 1 };
const SMOOTH = Easing.bezier(0.16, 1, 0.3, 1);

// ─── Timeline (ms from mount) ───────────────────────────────
const T = {
  SPLIT: 800, //  스꾸 ← → 버스
  REVEAL: 1150, // 유니 container opens
  CHAR_1: 1230, // 유
  CHAR_2: 1310, // 니
  LINE: 1900, // accent line
  SUBTITLE: 2150, // "SKKUverse"
  TAGLINE: 2700, // "Campus, Connected."
} as const;

// ─── Props ──────────────────────────────────────────────────
interface Props {
  /** true when OTA check (or any async init) is done */
  isReady?: boolean;
  /** fires after the dismiss fade-out completes */
  onDismiss?: () => void;
  /** set false to hide the "tap to replay" dev helper */
  showReplayHint?: boolean;
}

export default function SKKUverseSplash({
  isReady = false,
  onDismiss,
  showReplayHint = __DEV__,
}: Props) {
  const { width: screenW } = useWindowDimensions();

  // Responsive font size (matches clamp(2.6rem, 10vw, 5.6rem) roughly)
  const fontSize = Math.min(Math.max(screenW * 0.1, 42), 56);
  // 유니 two chars ≈ fontSize × 2.1 (measured safe max for Korean)
  const revealTargetW = fontSize * 2.1;
  // Accent line target width
  const lineTargetW = fontSize * 5;

  // ── Shared values ──────────────────────────────────────────
  const split = useSharedValue(0);
  const reveal = useSharedValue(0);
  const c1 = useSharedValue(0); // 유
  const c2 = useSharedValue(0); // 니
  const line = useSharedValue(0);
  const sub = useSharedValue(0);
  const tag = useSharedValue(0);
  const hint = useSharedValue(0);
  const dismiss = useSharedValue(0);

  const [settled, setSettled] = useState(false);
  const markSettled = useCallback(() => setSettled(true), []);

  // ── Orchestrator ───────────────────────────────────────────
  const play = useCallback(() => {
    // reset
    split.value = 0;
    reveal.value = 0;
    c1.value = 0;
    c2.value = 0;
    line.value = 0;
    sub.value = 0;
    tag.value = 0;
    hint.value = 0;
    dismiss.value = 0;
    setSettled(false);

    // 1 — split
    split.value = withDelay(T.SPLIT, withSpring(1, SPRING));

    // 2 — reveal container
    reveal.value = withDelay(
      T.REVEAL,
      withTiming(1, { duration: 900, easing: SMOOTH })
    );

    // 2a — per-char stagger
    c1.value = withDelay(T.CHAR_1, withSpring(1, SPRING));
    c2.value = withDelay(T.CHAR_2, withSpring(1, SPRING));

    // 3 — settle
    line.value = withDelay(
      T.LINE,
      withTiming(1, { duration: 900, easing: SMOOTH })
    );
    sub.value = withDelay(
      T.SUBTITLE,
      withTiming(1, { duration: 700, easing: SMOOTH })
    );

    // 4 — tagline (marks settled on finish)
    tag.value = withDelay(
      T.TAGLINE,
      withTiming(1, { duration: 800, easing: SMOOTH }, (fin) => {
        if (fin) runOnJS(markSettled)();
      })
    );

    // dev hint
    if (showReplayHint) {
      hint.value = withDelay(3300, withTiming(1, { duration: 800 }));
    }
  }, [showReplayHint]);

  // Auto-start
  useEffect(() => {
    play();
  }, [play]);

  // ── Dismiss on ready + settled ─────────────────────────────
  useEffect(() => {
    if (!isReady || !settled) return;

    hint.value = withTiming(0, { duration: 200 });
    dismiss.value = withDelay(
      300,
      withTiming(1, { duration: 400, easing: Easing.in(Easing.ease) }, (fin) => {
        if (fin && onDismiss) runOnJS(onDismiss)();
      })
    );
  }, [isReady, settled]);

  // ── Animated styles ────────────────────────────────────────

  const containerAnim = useAnimatedStyle(() => ({
    opacity: interpolate(dismiss.value, [0, 1], [1, 0]),
    transform: [{ scale: interpolate(dismiss.value, [0, 1], [1, 1.04]) }],
  }));

  const glowAnim = useAnimatedStyle(() => ({
    opacity: interpolate(sub.value, [0, 1], [0, 1]),
    transform: [{ scale: interpolate(sub.value, [0, 1], [0.5, 1]) }],
  }));

  const leftAnim = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          split.value,
          [0, 1],
          [0, -(fontSize * 0.06)]
        ),
      },
    ],
  }));

  const rightAnim = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          split.value,
          [0, 1],
          [0, fontSize * 0.06]
        ),
      },
    ],
  }));

  const revealAnim = useAnimatedStyle(() => ({
    width: interpolate(reveal.value, [0, 1], [0, revealTargetW]),
  }));

  const c1Anim = useAnimatedStyle(() => ({
    opacity: c1.value,
    transform: [
      { translateX: interpolate(c1.value, [0, 1], [-16, 0]) },
      { scale: interpolate(c1.value, [0, 1], [0.88, 1]) },
    ],
  }));

  const c2Anim = useAnimatedStyle(() => ({
    opacity: c2.value,
    transform: [
      { translateX: interpolate(c2.value, [0, 1], [-16, 0]) },
      { scale: interpolate(c2.value, [0, 1], [0.88, 1]) },
    ],
  }));

  const lineAnim = useAnimatedStyle(() => ({
    width: interpolate(line.value, [0, 1], [0, lineTargetW]),
    opacity: interpolate(line.value, [0, 1], [0, 0.35]),
  }));

  const subAnim = useAnimatedStyle(() => ({
    opacity: sub.value,
    transform: [{ translateY: interpolate(sub.value, [0, 1], [10, 0]) }],
  }));

  const tagAnim = useAnimatedStyle(() => ({
    opacity: tag.value,
    transform: [{ translateY: interpolate(tag.value, [0, 1], [8, 0]) }],
  }));

  const hintAnim = useAnimatedStyle(() => ({
    opacity: hint.value,
  }));

  // ── Render ─────────────────────────────────────────────────

  const textBase = [s.mainText, { fontSize }] as const;

  return (
    <Animated.View style={[s.root, containerAnim]}>
      {/* Soft radial glow */}
      <Animated.View style={[s.glow, glowAnim]} />

      <Pressable onPress={play}>
        {/* Wordmark row */}
        <View style={s.row}>
          <Animated.Text style={[...textBase, leftAnim]}>스꾸</Animated.Text>

          <Animated.View style={[s.reveal, revealAnim]}>
            <View style={s.charRow}>
              <Animated.Text style={[...textBase, c1Anim]}>유</Animated.Text>
              <Animated.Text style={[...textBase, c2Anim]}>니</Animated.Text>
            </View>
          </Animated.View>

          <Animated.Text style={[...textBase, rightAnim]}>버스</Animated.Text>
        </View>

        {/* Accent line */}
        <Animated.View style={[s.line, lineAnim]} />

        {/* English mark */}
        <Animated.Text style={[s.subtitle, subAnim]}>SKKUverse</Animated.Text>

        {/* Tagline */}
        <Animated.Text style={[s.tagline, tagAnim]}>
          Campus, Connected.
        </Animated.Text>
      </Pressable>

      {/* Dev replay hint */}
      {showReplayHint && (
        <Animated.View style={[s.hintWrap, hintAnim]}>
          <Text style={s.hintText}>TAP TO REPLAY</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

// ─── Styles ──────────────────────────────────────────────────
const s = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: "rgba(43, 90, 58, 0.06)",
  },
  row: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  mainText: {
    fontWeight: "800",
    color: GREEN,
    letterSpacing: -1.5,
    // ↓ swap to your loaded Pretendard if available
    // fontFamily: 'Pretendard-ExtraBold',
  },
  reveal: {
    overflow: "hidden",
    flexDirection: "row",
  },
  charRow: {
    flexDirection: "row",
  },
  line: {
    height: 2.5,
    borderRadius: 1.5,
    backgroundColor: GREEN_LIGHT,
    alignSelf: "center",
    marginTop: 14,
  },
  subtitle: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 3.5,
    color: GREEN_LIGHT,
  },
  tagline: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 11,
    fontWeight: "400",
    letterSpacing: 0.8,
    color: "rgba(43, 90, 58, 0.45)",
  },
  hintWrap: {
    position: "absolute",
    bottom: 60,
  },
  hintText: {
    fontSize: 9,
    fontWeight: "500",
    letterSpacing: 1.5,
    color: "#c8c8c8",
    textTransform: "uppercase",
  },
});
