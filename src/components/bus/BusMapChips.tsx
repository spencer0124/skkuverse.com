import type { MapChipUrls } from "@/lib/bus-data";

// Three side-by-side provider chips (N 네이버 / 카카오 / 🍎 Apple) that
// deep-link into the search of each map app for the boarding location.
// Matches the chips in IMG_3790.
export default function BusMapChips({
  label,
  urls,
}: {
  label: string;
  urls: MapChipUrls;
}) {
  const ariaBase = `${label} 지도에서 보기`;
  return (
    <ul className="grid grid-cols-3 gap-2">
      <li>
        <a
          href={urls.naver}
          target="_blank"
          rel="noopener external"
          aria-label={`네이버 지도로 ${ariaBase}`}
          className="flex items-center justify-center gap-1.5 h-11 rounded-xl bg-white border border-grey-200 text-t6 font-bold text-grey-800 hover:bg-grey-50 transition-colors"
        >
          <span
            aria-hidden
            className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-[#03C75A] text-white text-[11px] font-bold"
          >
            N
          </span>
          <span>네이버</span>
        </a>
      </li>
      <li>
        <a
          href={urls.kakao}
          target="_blank"
          rel="noopener external"
          aria-label={`카카오맵으로 ${ariaBase}`}
          className="flex items-center justify-center gap-1.5 h-11 rounded-xl bg-white border border-grey-200 text-t6 font-bold text-grey-800 hover:bg-grey-50 transition-colors"
        >
          <span
            aria-hidden
            className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-[#FAE100] text-grey-900 text-[11px] font-bold"
          >
            💬
          </span>
          <span>카카오</span>
        </a>
      </li>
      <li>
        <a
          href={urls.apple}
          target="_blank"
          rel="noopener external"
          aria-label={`Apple Maps로 ${ariaBase}`}
          className="flex items-center justify-center gap-1.5 h-11 rounded-xl bg-white border border-grey-200 text-t6 font-bold text-grey-800 hover:bg-grey-50 transition-colors"
        >
          <span
            aria-hidden
            className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-grey-900 text-white text-[11px] font-bold"
          >

          </span>
          <span>Apple</span>
        </a>
      </li>
    </ul>
  );
}
