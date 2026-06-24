import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "2026 FIFAワールドカップ 決勝トーナメント予測",
  description:
    "2026 FIFAワールドカップのグループ順位から決勝トーナメント表をリアルタイム生成。順位変動に応じて対戦カードを自動更新します。",
  openGraph: {
    title: "2026 FIFAワールドカップ 決勝トーナメント予測",
    description:
      "グループ順位から決勝トーナメント表をリアルタイム生成。",
    siteName: "World Cup Bracket Live",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "2026 FIFAワールドカップ 決勝トーナメント予測",
    description:
      "グループ順位から決勝トーナメント表をリアルタイム生成。",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        {children}
        <footer className="siteFooter">
          <Link href="/">トップ</Link>
          <Link href="/about">サイト概要</Link>
          <Link href="/privacy">プライバシーポリシー</Link>
          <Link href="/disclaimer">免責事項</Link>
          <Link href="/contact">お問い合わせ</Link>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
