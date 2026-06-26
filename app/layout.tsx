import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { HtmlLangSync } from "@/components/HtmlLangSync";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  metadataBase: new URL("https://worldcup-chi-six.vercel.app"),
  title: "2026 FIFAワールドカップ 決勝トーナメント速報",
  description:
    "2026 FIFAワールドカップのグループ順位から決勝トーナメント表をリアルタイム生成。順位変動に応じて対戦カードを自動更新します。",
  verification: {
    google: "inCY9X6EfS7DuziuMJTwm5rjSSjLBhkFeuVmjzmDRfc",
  },
  openGraph: {
    title: "2026 FIFAワールドカップ 決勝トーナメント速報",
    description:
      "グループ順位から決勝トーナメント表をリアルタイム生成。",
    siteName: "World Cup Bracket Live",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "2026 FIFAワールドカップ 決勝トーナメント速報",
    description:
      "グループ順位から決勝トーナメント表をリアルタイム生成。",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/",
    languages: {
      ja: "/",
      en: "/en",
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta name="google-adsense-account" content="ca-pub-9171958597513096" />
      </head>
      <body>
        <HtmlLangSync />

        {children}

        <SiteFooter />

        <Analytics />
      </body>
    </html>
  );
}
