"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getLocalizedPath, labels, type Locale } from "@/lib/i18n";

export function SiteFooter() {
  const pathname = usePathname();
  const locale: Locale = pathname.startsWith("/en") ? "en" : "ja";
  const t = labels[locale].footer;
  const languageHref = locale === "en" ? "/" : "/en";

  return (
    <footer className="siteFooter">
      <Link href={getLocalizedPath(locale, "home")}>{t.home}</Link>
      <Link href={getLocalizedPath(locale, "about")}>{t.about}</Link>
      <Link href={getLocalizedPath(locale, "privacy")}>{t.privacy}</Link>
      <Link href={getLocalizedPath(locale, "disclaimer")}>{t.disclaimer}</Link>
      <Link href={getLocalizedPath(locale, "contact")}>{t.contact}</Link>
      <Link href={languageHref}>{t.language}</Link>
    </footer>
  );
}
