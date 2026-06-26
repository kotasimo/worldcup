import type { Metadata } from "next";
import { LiveBracket } from "@/components/LiveBracket";
import { getWorldCupViewModel } from "@/lib/view-model";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "2026 FIFA World Cup Knockout Bracket Live",
  description:
    "A live 2026 FIFA World Cup knockout bracket generated from the current group standings.",
  alternates: {
    canonical: "/en",
    languages: {
      ja: "/",
      en: "/en",
    },
  },
  openGraph: {
    title: "2026 FIFA World Cup Knockout Bracket Live",
    description: "Live knockout bracket from the current group standings.",
    siteName: "World Cup Bracket Live",
    images: [
      {
        url: "/og-image-en.png?v=en-20260627",
        width: 1200,
        height: 630,
        alt: "2026 FIFA World Cup Knockout Bracket Live",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "2026 FIFA World Cup Knockout Bracket Live",
    description: "Live knockout bracket from the current group standings.",
    images: ["/og-image-en.png?v=en-20260627"],
  },
};

export default async function EnglishHome() {
  const data = await getWorldCupViewModel();

  return (
    <main className="page">
      <LiveBracket initialData={data} locale="en" />
    </main>
  );
}
