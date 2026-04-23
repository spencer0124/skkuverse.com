import type { ReactNode } from "react";

// The recurring rhythm used on both shuttle detail pages:
//   1. Small grey label (e.g. "운행시간")
//   2. Large black heading (e.g. "월요일 ~ 금요일")
//   3. Body
// Mirrored 1:1 from the app's IMG_3784 / IMG_3788 layout. Sections are
// visually separated by the grey band in BusSectionDivider.
export default function BusSection({
  label,
  heading,
  children,
}: {
  label: string;
  heading?: string;
  children?: ReactNode;
}) {
  return (
    <section className="px-6 py-8">
      <p className="text-t7 md:text-t6 text-grey-500 mb-1.5">{label}</p>
      {heading ? (
        <h2 className="text-[26px] md:text-[32px] font-bold text-grey-900 tracking-tight leading-tight">
          {heading}
        </h2>
      ) : null}
      {children ? <div className="mt-5">{children}</div> : null}
    </section>
  );
}

export function BusSectionDivider() {
  return <div className="h-2 bg-grey-100" aria-hidden />;
}
