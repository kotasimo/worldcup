import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "免責事項 | World Cup Live Bracket",
  description: "World Cup Live Bracketの免責事項です。",
};

export default function DisclaimerPage() {
  return (
    <main className="staticPage">
      <p className="eyebrow">Disclaimer</p>
      <h1>免責事項</h1>

      <section className="staticPanel">
        <h2>情報の正確性について</h2>
        <p>
          本サイトでは、可能な限り正確な情報を表示するよう努めていますが、試合結果、順位、トーナメント表の表示内容について正確性・完全性・最新性を保証するものではありません。
        </p>
        <p>
          公式な試合日程、順位、結果については、必ず大会公式サイトや各公式発表をご確認ください。
        </p>
      </section>

      <section className="staticPanel">
        <h2>損害等の責任について</h2>
        <p>
          本サイトの情報を利用したことにより発生した損害やトラブルについて、運営者は責任を負いかねます。利用者ご自身の判断でご利用ください。
        </p>
      </section>

      <section className="staticPanel">
        <h2>外部リンク・外部サービス</h2>
        <p>
          本サイトからリンクまたは参照される外部サイト・外部サービスの内容や利用によって生じた損害について、運営者は責任を負いません。
        </p>
      </section>
    </main>
  );
}
