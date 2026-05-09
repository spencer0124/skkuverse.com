"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { PLAY_STORE_URL, getMobileStoreUrl } from "@/lib/links";

const navLinks = [
  { href: "/bus", label: "셔틀버스" },
  { href: "/notice", label: "AI 공지" },
  { href: "/feed", label: "피드" },
  { href: "/team", label: "팀 소개" },
  { href: "/faq", label: "자주 묻는 질문" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || menuOpen;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        solid
          ? "bg-white/90 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-[1140px] px-4 md:px-6 flex items-center justify-between h-16">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src="/logo.png"
            alt="스꾸버스 로고"
            width={28}
            height={28}
            className="w-7 h-7 rounded-lg"
            unoptimized
            priority
          />
          <span className="text-t4 font-bold text-grey-900">스꾸버스</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-t6 font-medium text-grey-600 hover:text-grey-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile actions */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href={PLAY_STORE_URL}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = getMobileStoreUrl();
            }}
            className="inline-flex items-center justify-center h-8 text-[11px] font-bold text-white bg-brand px-3 rounded-full hover:bg-brand/90 transition-colors"
          >
            앱 다운로드
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={menuOpen}
            className="flex items-center justify-center w-10 h-10 text-grey-500"
          >
            {menuOpen ? (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-grey-100 bg-white">
          <nav className="mx-auto max-w-[1140px] px-4 py-2 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-t5 font-medium text-grey-700 py-3 hover:text-grey-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
