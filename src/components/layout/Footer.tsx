import Link from "next/link";

const productLinks = [
  { href: "/bus", label: "셔틀버스" },
  { href: "/notice", label: "AI 공지" },
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
        <div className="grid grid-cols-3 gap-6 md:gap-10">
          <div>
            <h4 className="text-t6 font-bold text-grey-800 mb-4">서비스</h4>
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
