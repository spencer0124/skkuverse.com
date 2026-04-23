// Two shuttles, two separate information models — mirroring the skkuverse
// app's dedicated detail screens (see /Users/zoyoong/Downloads/bus info page/
// IMG_3784–3790 reference designs). Kept as two distinct exports rather than
// a shared type because the shape genuinely differs:
//   - INSA has payment O/X lists and 7-stop round-trip timelines.
//   - INJA has a warning banner, lost-item contacts with sub-labels, and
//     boarding-location map chips.

export type BusStop = {
  name: string;
  // Start/end stops render as filled dots in the timeline (matches app).
  endpoint?: "start" | "end";
};

export type MapChipUrls = {
  naver: string;
  kakao: string;
  apple: string;
};

function encodeMap(query: string): MapChipUrls {
  const q = encodeURIComponent(query);
  return {
    naver: `https://map.naver.com/p/search/${q}`,
    kakao: `https://map.kakao.com/?q=${q}`,
    apple: `https://maps.apple.com/?q=${q}`,
  };
}

// ──────────────────────────────────────────────────────────────────────────
// 인사캠 셔틀버스 (혜화역 ↔ 인사캠, 편도 400원)
// ──────────────────────────────────────────────────────────────────────────

export const INSA_ROUTE = {
  id: "insa" as const,
  slug: "insa",
  name: "인사캠 셔틀버스",
  tagline: "혜화역에서 인사캠까지, 지하철처럼 편하게",
  summaryFare: "편도 400원",
  summaryFromTo: "혜화역 ↔ 인사캠",

  operatingHeading: "월요일 ~ 금요일",
  operatingBullets: ["공휴일에는 쉬어요"],
  timeCards: [
    { label: "학기중", time: "07:00 ~ 23:00" },
    { label: "방학중", time: "07:00 ~ 19:00" },
  ],

  fareHeading: "400원",
  acceptedPayments: [
    {
      name: "체크 / 신용카드",
      note: "후불교통결제가 되는 카드만 쓸 수 있어요",
    },
    { name: "T머니" },
    { name: "캐시비카드" },
  ],
  rejectedPayments: ["현금", "회수권"],

  contactHeading: "연락처",
  contacts: [
    { team: "학생지원팀", phone: "02-760-1073" },
    { team: "인사캠 관리팀", phone: "02-760-0110" },
  ],

  directions: [
    {
      label: "인사캠 → 혜화역",
      stops: [
        { name: "농구장", endpoint: "start" as const },
        { name: "학생회관" },
        { name: "정문" },
        { name: "올림픽기념국민생활관" },
        { name: "혜화동 우체국" },
        { name: "혜화동로터리" },
        { name: "혜화역 1번출구", endpoint: "end" as const },
      ],
    },
    {
      label: "혜화역 → 인사캠",
      stops: [
        { name: "혜화역 1번출구", endpoint: "start" as const },
        { name: "혜화동로터리" },
        { name: "성균관대입구사거리" },
        { name: "정문" },
        { name: "600주년기념관", endpoint: "end" as const },
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────────────────────────
// 인자셔틀 (인사캠 ↔ 자과캠, 무료)
// ──────────────────────────────────────────────────────────────────────────

export const INJA_ROUTE = {
  id: "inja" as const,
  slug: "inja",
  name: "인자셔틀",
  tagline: "인사캠과 자과캠, 무료로 오가요",
  summaryFare: "무료",
  summaryFromTo: "인사캠 ↔ 자과캠",

  operatingHeading: "매주 금요일",
  operatingBullets: ["금요일 7시 버스는 8시에 출발해요"],
  operatingWarning: "주말과 휴일에는 쉬어요",

  fareHeading: "무료",

  notesHeading: "안내",
  notes: [
    "금요일엔 학부대학 셔틀이 추가로 다녀요",
    "모든 셔틀 통합 시간표예요",
  ],

  contactHeading: "분실물 연락처",
  contacts: [
    {
      team: "인자셔틀 업무용",
      phone: "010-8982-2852",
      subLabel: "일반 인자셔틀 분실물",
    },
    {
      team: "학부대학 행정실 (인사캠)",
      phone: "02-760-0991",
      subLabel: "금요일 증차노선 관련",
    },
    {
      team: "학부대학 행정실 (자과캠)",
      phone: "031-299-4224",
      subLabel: "금요일 증차노선 관련",
    },
  ],

  directions: [
    {
      label: "인사캠 → 자과캠",
      stops: [
        { name: "인사캠", endpoint: "start" as const },
        { name: "자과캠", endpoint: "end" as const },
      ],
      boardingLocation: {
        name: "600주년 기념관 건너편",
        mapUrls: encodeMap("성균관대 600주년기념관"),
      },
    },
    {
      label: "자과캠 → 인사캠",
      stops: [
        { name: "자과캠", endpoint: "start" as const },
        { name: "인사캠", endpoint: "end" as const },
      ],
      boardingLocation: {
        name: "N센터 앞",
        mapUrls: encodeMap("성균관대 자연과학캠퍼스 N센터"),
      },
    },
  ],
};

// ──────────────────────────────────────────────────────────────────────────
// Hub-level content (used on /bus landing, not sub-pages)
// ──────────────────────────────────────────────────────────────────────────

export const BUS_FAQ: Array<{ q: string; a: string }> = [
  {
    q: "성균관대 셔틀버스 요금은 얼마인가요?",
    a: "혜화역–인사캠은 편도 400원, 인사캠–자과캠을 오가는 인자셔틀은 무료예요.",
  },
  {
    q: "혜화역에서 성균관대 셔틀버스는 어디에서 타나요?",
    a: "4호선 혜화역 1번 출구 앞에서 타요. 혜화동로터리 → 성균관대입구사거리 → 정문 → 600주년기념관 순으로 운행해요.",
  },
  {
    q: "성균관대 인사캠 셔틀버스는 주말에도 운행하나요?",
    a: "인사캠 셔틀은 월~금만 운행해요. 주말과 공휴일은 쉬어요.",
  },
  {
    q: "인자셔틀은 언제 운행하나요?",
    a: "인자셔틀은 매주 금요일만 운행해요. 주말과 휴일에는 쉬고요, 7시 버스는 8시에 출발해요.",
  },
  {
    q: "인사캠에서 자과캠으로 가는 셔틀은 무료인가요?",
    a: "네, 인자셔틀은 학생·교직원 모두 무료예요.",
  },
  {
    q: "인사캠 셔틀버스는 현금으로 탈 수 있나요?",
    a: "현금과 회수권으로는 탈 수 없어요. 체크·신용카드(후불교통결제 가능 카드), T머니, 캐시비카드로 결제하실 수 있어요.",
  },
  {
    q: "셔틀버스 실시간 도착정보는 어디에서 확인하나요?",
    a: "스꾸버스 앱에서 정류장별 실시간 도착정보를 볼 수 있어요. 내 근처 정류장의 다음 차량 도착 시간까지 한 화면에 있어요.",
  },
  {
    q: "이번 학기 셔틀버스 시간표는 어디에서 볼 수 있나요?",
    a: "스꾸버스 앱에서 매 학기 시간표를 전부 볼 수 있어요. 노선별 출발 시각과 정류장별 도착 시간이 함께 정리돼 있어요.",
  },
];

export const BUS_SOURCES: Array<{ title: string; url: string }> = [
  {
    title: "성균관대학교 — 셔틀버스 공식 안내 (대학생활 > 편의/복지)",
    url: "https://www.skku.edu/skku/campus/support/welfare_12.do",
  },
  {
    title: "성균관대학교 학생성공 게이트웨이 — 셔틀버스",
    url: "https://ssghakbu.skku.edu/m/menupage.do?menuId=243",
  },
];
