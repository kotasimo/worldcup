import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "サイト概要 | World Cup Live Bracket",
  description: "2026 FIFA World Cupのグループ順位と決勝トーナメント予測を表示するサイトの概要です。",
};

export default function AboutPage() {
  return (
    <main className="staticPage">
      <p className="eyebrow">About</p>
      <h1>サイト概要</h1>

      <section className="staticPanel">
        <h2>このサイトについて</h2>
        <p>
          本サイトは、2026 FIFA World Cupのグループステージ順位をもとに、現時点で想定される決勝トーナメント表を表示する非公式サイトです。
        </p>
        <p>
          試合結果や順位の更新に応じて、トーナメント表上の出場候補チーム、現在試合中のチーム、グループ順位を見やすく確認できることを目的としています。
        </p>
      </section>

      <section className="staticPanel">
        <h2>運営者情報</h2>
        <p>運営者: World Cup Live Bracket 運営</p>
        <p>
          お問い合わせは<Link href="/contact">お問い合わせページ</Link>からご連絡ください。
        </p>
      </section>

      <section className="staticPanel">
        <h2>非公式サイトであること</h2>
        <p>
          本サイトはFIFA、各サッカー協会、放送局、データ提供元とは関係のない非公式サービスです。表示内容は参考情報としてご利用ください。
        </p>
      </section>
    </main>
  );
}
