import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー | World Cup Live Bracket",
  description: "World Cup Live Bracketのプライバシーポリシーです。",
};

export default function PrivacyPage() {
  return (
    <main className="staticPage">
      <p className="eyebrow">Privacy Policy</p>
      <h1>プライバシーポリシー</h1>

      <section className="staticPanel">
        <h2>取得する情報</h2>
        <p>
          本サイトは、現時点ではユーザー登録やコメント機能を提供しておらず、利用者が直接入力する個人情報を保存しません。
        </p>
        <p>
          お問い合わせをいただく場合、返信に必要な範囲でメールアドレスやお問い合わせ内容を確認することがあります。
        </p>
      </section>

      <section className="staticPanel">
        <h2>アクセス解析・広告について</h2>
        <p>
          本サイトでは、今後広告配信サービスやアクセス解析サービスを利用する場合があります。これらのサービスでは、Cookieなどを使用して利用状況を収集することがあります。
        </p>
        <p>
          Google AdSenseなどの第三者配信事業者は、ユーザーの興味に応じた広告を表示するためにCookieを使用する場合があります。Cookieはブラウザ設定から無効にできます。
        </p>
      </section>

      <section className="staticPanel">
        <h2>外部サービス</h2>
        <p>
          本サイトでは、試合データの取得、国旗画像の表示、広告配信などのために外部サービスを利用する場合があります。外部サービスに送信される情報は、各サービスのプライバシーポリシーに従って扱われます。
        </p>
      </section>

      <section className="staticPanel">
        <h2>ポリシーの変更</h2>
        <p>
          本ポリシーは、必要に応じて内容を変更することがあります。変更後の内容は、本ページに掲載した時点で有効になります。
        </p>
      </section>
    </main>
  );
}
