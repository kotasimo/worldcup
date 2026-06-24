import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ | World Cup Live Bracket",
  description: "World Cup Live Bracketへのお問い合わせページです。",
};

export default function ContactPage() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  return (
    <main className="staticPage">
      <p className="eyebrow">Contact</p>
      <h1>お問い合わせ</h1>

      <section className="staticPanel">
        <h2>お問い合わせ先</h2>
        {contactEmail ? (
          <p>
            ご連絡は <a href={`mailto:${contactEmail}`}>{contactEmail}</a> までお願いします。
          </p>
        ) : (
          <p>
            お問い合わせ先は現在準備中です。公開前に環境変数 <code>NEXT_PUBLIC_CONTACT_EMAIL</code> を設定してください。
          </p>
        )}
      </section>

      <section className="staticPanel">
        <h2>お問い合わせ時のお願い</h2>
        <p>
          表示内容の不具合、データ更新、広告掲載、その他ご連絡の際は、該当ページURL、発生日時、確認した内容を添えていただけると助かります。
        </p>
      </section>
    </main>
  );
}
