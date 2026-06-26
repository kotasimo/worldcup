export type Locale = "ja" | "en";

export const labels = {
  ja: {
    ad: "広告",
    alternateHref: "/en",
    alternateLabel: "English",
    autoUpdating: "自動更新中",
    fallbackUpdateFailed: "更新失敗",
    footer: {
      home: "トップ",
      about: "サイト概要",
      privacy: "プライバシーポリシー",
      disclaimer: "免責事項",
      contact: "お問い合わせ",
      language: "English",
    },
    groupColumns: {
      won: "勝",
      drawn: "分",
      lost: "負",
      points: "勝点",
      goalDifference: "得失点",
    },
    groupStandings: "グループ順位",
    heroTitle: "決勝トーナメント速報",
    liveMatches: "現在の試合",
    noLiveMatches: "現在進行中の試合はありません",
    siteInfo: "サイト概要",
    siteInfoHref: "/about",
    thirdPlaceNote:
      "3位枠はAnnex C相当の割り当て表を参照します。表を取得できない場合のみ候補グループ内で暫定配置します。",
    thirdPlaceRanking: "3位ランキング",
    tbd: "未定",
    updated: "更新",
    leadPrefix: "グループ順位をもとに、",
    leadStrong: "リアルタイムで",
    leadSuffix: "現時点の決勝トーナメント組み合わせを自動で反映します。",
  },
  en: {
    ad: "Ad",
    alternateHref: "/",
    alternateLabel: "日本語",
    autoUpdating: "Auto-updating",
    fallbackUpdateFailed: "Update failed",
    footer: {
      home: "Home",
      about: "About",
      privacy: "Privacy",
      disclaimer: "Disclaimer",
      contact: "Contact",
      language: "日本語",
    },
    groupColumns: {
      won: "W",
      drawn: "D",
      lost: "L",
      points: "Pts",
      goalDifference: "GD",
    },
    groupStandings: "Group Standings",
    heroTitle: "Knockout Bracket Live",
    liveMatches: "Live Matches",
    noLiveMatches: "No matches are live right now",
    siteInfo: "About this site",
    siteInfoHref: "/en/about",
    thirdPlaceNote:
      "Third-place slots use an Annex C-style allocation table. If that table cannot be loaded, teams are placed provisionally within the eligible group set.",
    thirdPlaceRanking: "Third-Place Ranking",
    tbd: "TBD",
    updated: "Updated",
    leadPrefix: "Based on the group standings, this page ",
    leadStrong: "updates in real time",
    leadSuffix: " to show the current knockout bracket.",
  },
} as const;

export function getLocalizedPath(locale: Locale, path: "home" | "about" | "privacy" | "disclaimer" | "contact") {
  const base = locale === "en" ? "/en" : "";

  if (path === "home") {
    return locale === "en" ? "/en" : "/";
  }

  return `${base}/${path}`;
}
