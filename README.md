# World Cup Live Bracket

2026年W杯のグループ順位をラウンド32のトーナメント表へ流し込む1ページアプリです。

## 起動

```bash
npm install
npm run dev
```

http://localhost:3000 を開きます。

## API

無料で試しやすい構成として、`football-data.org` のAPIキーを使う形にしています。

```bash
cp .env.example .env.local
```

`.env.local` に入れます。

```bash
FOOTBALL_DATA_API_KEY=your_key_here
```

キーが未設定、APIが未対応、または取得に失敗した場合はサンプルデータで表示されます。実データ取得時は `/api/worldcup` が60秒ごとに再取得され、画面に反映されます。

## 現在の仕様

- グループAからLの順位を試合結果から計算
- 各組1位、2位をトーナメント表の固定枠へ反映
- 3位チームは全体ランキング上位8チームを抽出
- 3位枠は候補グループに合う上位チームを重複なしで暫定配置

3位枠の完全な公式割り当て表は次の段階で追加する想定です。
