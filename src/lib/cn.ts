import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge about our custom font-size tokens (--font-size-t1..t7,
// --font-size-hero, --font-size-display). Without this, utilities like
// `text-t5` are lumped into the same group as `text-white` and one gets
// dropped when both appear in a cn() call.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "hero", "display"] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
