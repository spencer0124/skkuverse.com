import type { Metadata } from "next";
import "./globals.css";
import InAppEscape from "@/components/ui/InAppEscape";
import AppBanner from "@/components/ui/AppBanner";

export const metadata: Metadata = {
  title: "스꾸버스 - 성대생이 만드는 캠퍼스",
  description: "오늘의 공지·셔틀·장소, 성대생이 함께",
  openGraph: {
    title: "스꾸버스 - 성대생이 만드는 캠퍼스",
    description: "오늘의 공지·셔틀·장소, 성대생이 함께",
    type: "website",
  },
  other: {
    "apple-itunes-app":
      "app-id=6446813434, app-argument=https://skkuverse.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <InAppEscape />
        <AppBanner />
        {children}
      </body>
    </html>
  );
}
