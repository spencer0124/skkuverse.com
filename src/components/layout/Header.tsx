"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import LogoMark from "@/components/ui/LogoMark";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-[1140px] px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <LogoMark className="w-7 h-7 text-brand" />
          <span className="text-t4 font-bold text-grey-900">스꾸버스</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/#features"
            className="text-t6 font-medium text-grey-600 hover:text-grey-900 transition-colors"
          >
            기능 소개
          </Link>
          <Link
            href="/#community"
            className="text-t6 font-medium text-grey-600 hover:text-grey-900 transition-colors"
          >
            커뮤니티
          </Link>
          <Link
            href="/#download"
            className="text-t6 font-medium text-white bg-brand px-5 py-2.5 rounded-full hover:bg-brand/90 transition-colors"
          >
            앱 다운로드
          </Link>
        </nav>
      </div>
    </header>
  );
}
