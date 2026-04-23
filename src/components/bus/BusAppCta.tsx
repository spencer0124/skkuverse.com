import Link from "next/link";

// Single CTA: "스꾸버스에서 보기" routed to /p/transit.
//
// /p/transit is a universal-link endpoint: on iOS/Android with the 스꾸버스
// app installed, the OS intercepts the navigation and opens the app's transit
// screen directly. If the app isn't installed (or on desktop), the request
// falls through to the static /p/transit page — an app-download landing.
// Keeping the link internal (not target=_blank) so the OS handler can fire.
export default function BusAppCta() {
  return (
    <div className="rounded-3xl bg-brand text-white p-8 md:p-12">
      <p className="text-t7 md:text-t6 font-bold text-white/70 tracking-tight mb-2">
        스꾸버스 앱
      </p>
      <h3 className="text-[26px] md:text-[32px] font-bold leading-tight tracking-tight whitespace-pre-line">
        {"시간표도, 도착정보도,\n앱에서 한눈에"}
      </h3>
      <p className="mt-4 max-w-[520px] text-t6 md:text-t5 text-white/80 leading-relaxed">
        학기 시간표, 정류장별 실시간 도착정보, 내 근처 셔틀까지 한 번에 볼 수
        있어요.
      </p>
      <div className="mt-8">
        <Link
          href="/p/transit"
          className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-white text-brand text-t5 font-bold hover:bg-grey-50 transition-colors"
        >
          스꾸버스에서 보기 →
        </Link>
      </div>
    </div>
  );
}
