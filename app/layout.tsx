import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "World Cup Live Bracket",
  description: "Current group standings projected into the 2026 knockout bracket.",
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
      </body>
    </html>
  );
}
