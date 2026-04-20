import type { Metadata } from "next";
import "./globals.css";
import InAppEscape from "@/components/ui/InAppEscape";

export const metadata: Metadata = {
  title: "스꾸버스-성균관 유니버스",
  description: "오늘의 공지·셔틀·장소, 성대생이 함께",
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "스꾸버스-성균관 유니버스",
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
      <head>
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/toss/tossface/dist/tossface.css"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <InAppEscape />
        {children}
      </body>
    </html>
  );
}
