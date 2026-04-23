import { BUS_FAQ } from "@/lib/bus-data";

// Uses the native <details>/<summary> accordion — no JS, no client boundary.
// Each question is rendered as an h3 inside the summary for AI/search
// crawlers that prefer heading hierarchy over ARIA landmarks.
export default function BusFaq() {
  return (
    <ul className="flex flex-col gap-3">
      {BUS_FAQ.map((item, i) => (
        <li key={i}>
          <details
            className="group rounded-2xl bg-white border border-grey-100 open:shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-shadow"
            name="bus-faq"
          >
            <summary className="list-none cursor-pointer px-6 py-5 flex items-start justify-between gap-4">
              <h3 className="text-t5 md:text-t4 font-bold text-grey-900 leading-snug tracking-tight">
                {item.q}
              </h3>
              <span
                aria-hidden
                className="mt-1 inline-block text-grey-400 group-open:rotate-180 transition-transform shrink-0"
              >
                ▾
              </span>
            </summary>
            <div className="px-6 pb-6 text-t6 md:text-t5 text-grey-700 leading-relaxed whitespace-pre-line">
              {item.a}
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}
