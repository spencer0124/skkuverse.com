import type { BusStop } from "@/lib/bus-data";

// Vertical timeline with a single connecting line and filled/outline dots.
// Endpoints ("start" | "end") render as solid filled dots + bold label,
// intermediate stops as outlined dots + muted label. Matches IMG_3786.
export default function BusStopTimeline({ stops }: { stops: BusStop[] }) {
  return (
    <ol className="relative flex flex-col">
      {/* Connecting line behind the dots. Positioned so it starts at the
          first dot's center and ends at the last dot's center. */}
      <span
        aria-hidden
        className="absolute left-[11px] top-3 bottom-3 w-px bg-grey-300"
      />
      {stops.map((stop, i) => {
        const isEndpoint = Boolean(stop.endpoint);
        return (
          <li
            key={`${i}-${stop.name}`}
            className="relative flex items-center gap-4 py-2"
          >
            <span
              aria-hidden
              className={
                isEndpoint
                  ? "relative z-10 inline-block w-[22px] h-[22px] rounded-full bg-grey-900 shrink-0"
                  : "relative z-10 inline-block w-[22px] h-[22px] rounded-full border-2 border-grey-300 bg-white shrink-0"
              }
            />
            <span
              className={
                isEndpoint
                  ? "text-t4 md:text-t3 font-bold text-grey-900"
                  : "text-t5 md:text-t4 text-grey-600"
              }
            >
              {stop.name}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
