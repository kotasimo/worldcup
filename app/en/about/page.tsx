import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | World Cup Live Bracket",
  description: "About this unofficial live 2026 FIFA World Cup knockout bracket site.",
};

export default function EnglishAboutPage() {
  return (
    <main className="staticPage">
      <p className="eyebrow">About</p>
      <h1>About This Site</h1>

      <section className="staticPanel">
        <h2>What This Site Does</h2>
        <p>
          This unofficial site shows the current projected knockout bracket based on the 2026 FIFA World Cup group-stage standings.
        </p>
        <p>
          It is designed to make projected qualifiers, live teams, and group standings easy to follow as results and standings change.
        </p>
      </section>

      <section className="staticPanel">
        <h2>Operator</h2>
        <p>Operator: World Cup Live Bracket</p>
        <p>
          Please use the <Link href="/en/contact">contact page</Link> for inquiries.
        </p>
      </section>

      <section className="staticPanel">
        <h2>Unofficial Site</h2>
        <p>
          This site is not affiliated with FIFA, any football association, broadcaster, or data provider. All information is provided for reference only.
        </p>
      </section>
    </main>
  );
}
