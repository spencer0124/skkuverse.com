import type { Metadata, Viewport } from "next";
import "./globals.css";
import InAppEscape from "@/components/ui/InAppEscape";
import JsonLd from "@/components/seo/JsonLd";
import {
  APP_STORE_ID,
  APP_STORE_URL,
  BRAND_BG,
  BRAND_COLOR,
  DEFAULT_OG_IMAGE,
  PLAY_STORE_URL,
  SITE_DEFAULT_TITLE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_LOCALE,
  SITE_NAME,
  SITE_SHORT_DESCRIPTION,
  SITE_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "education",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/logo.svg",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: SITE_LOCALE,
    url: SITE_URL,
    siteName: SITE_NAME,
    title: {
      default: SITE_DEFAULT_TITLE,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_SHORT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: SITE_DEFAULT_TITLE,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_SHORT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
  itunes: {
    appId: APP_STORE_ID,
    appArgument: SITE_URL,
  },
  appleWebApp: {
    title: SITE_NAME,
    capable: true,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  // Verification tokens.
  //   Google Search Console → https://search.google.com/search-console
  //     (fill `google` once Google issues a token)
  //   Naver Search Advisor  → https://searchadvisor.naver.com
  //     (token issued 2026-04-23 via HTML 메타 태그 방식)
  verification: {
    google: undefined,
    other: {
      "naver-site-verification": "7ba547d44d63d1f9b592b346a630acb5c930d122",
    },
  },
};

export const viewport: Viewport = {
  themeColor: BRAND_COLOR,
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Organization + WebSite JSON-LD. Emitted once on every page via the root
// layout so generative AI crawlers can identify the entity behind the site
// without per-page duplication.
const organizationJsonLd = {
  "@type": "Organization",
  name: SITE_NAME,
  alternateName: ["skkuverse", "스꾸버스"],
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  description: SITE_DESCRIPTION,
  sameAs: [APP_STORE_URL, PLAY_STORE_URL],
  knowsAbout: [
    "성균관대학교",
    "성균관대 셔틀버스",
    "인사캠 셔틀버스",
    "인자셔틀",
    "인사캠",
    "자과캠",
    "인문사회과학캠퍼스",
    "자연과학캠퍼스",
    "성균관대 공지사항",
  ],
};

const websiteJsonLd = {
  "@type": "WebSite",
  name: SITE_NAME,
  alternateName: "skkuverse",
  url: SITE_URL,
  inLanguage: "ko-KR",
  description: SITE_DESCRIPTION,
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
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
        <JsonLd id="ld-organization" data={organizationJsonLd} />
        <JsonLd id="ld-website" data={websiteJsonLd} />
      </head>
      <body
        className="min-h-full flex flex-col font-sans"
        style={{ background: BRAND_BG }}
      >
        <InAppEscape />
        {children}
      </body>
    </html>
  );
}
