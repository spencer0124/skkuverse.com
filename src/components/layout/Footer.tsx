import Image from "next/image";
import Link from "next/link";

const productLinks = [
  { href: "/bus", label: "셔틀버스" },
  { href: "/notice", label: "AI 공지" },
  { href: "/#download", label: "앱 다운로드" },
];

const companyLinks = [
  { href: "/team", label: "팀 소개" },
  { href: "/feed", label: "피드" },
  { href: "/faq", label: "자주 묻는 질문" },
  { href: "/support", label: "문의" },
];

const policyLinks = [
  { href: "/terms", label: "이용약관" },
  { href: "/privacy", label: "개인정보처리방침" },
];

export default function Footer() {
  return (
    <footer className="bg-grey-100 py-16">
      <div className="mx-auto max-w-[1140px] px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Image
                src="/logo.svg"
                alt="스꾸버스 로고"
                width={28}
                height={28}
                className="w-7 h-7 rounded-lg"
                unoptimized
              />
              <h3 className="text-t4 font-bold text-grey-900">스꾸버스</h3>
            </div>
            <p className="text-t6 text-grey-500 leading-relaxed">
              오늘의 공지·셔틀·장소, 성대생이 함께
            </p>
          </div>
          <div>
            <h4 className="text-t6 font-bold text-grey-800 mb-4">제품</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-t6 text-grey-500 hover:text-grey-700 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-t6 font-bold text-grey-800 mb-4">회사</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-t6 text-grey-500 hover:text-grey-700 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-t6 font-bold text-grey-800 mb-4">정책</h4>
            <ul className="space-y-3">
              {policyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-t6 text-grey-500 hover:text-grey-700 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-grey-200">
          <p className="text-t7 text-grey-400">
            &copy; 2026 스꾸버스. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
