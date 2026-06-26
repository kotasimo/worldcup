"use client";

import { useEffect, useState } from "react";
import { BracketBoard } from "@/components/BracketBoard";
import { labels, type Locale } from "@/lib/i18n";
import type { WorldCupViewModel } from "@/lib/view-model";

type Props = {
  initialData: WorldCupViewModel;
  locale?: Locale;
};

export function LiveBracket({ initialData, locale = "ja" }: Props) {
  const t = labels[locale];
  const [data, setData] = useState(initialData);
  const [clientStatus, setClientStatus] = useState<string>(t.autoUpdating);

  useEffect(() => {
    setClientStatus(t.autoUpdating);
  }, [t.autoUpdating]);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      try {
        const response = await fetch("/api/worldcup", { cache: "no-store" });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const nextData = (await response.json()) as WorldCupViewModel;

        if (!cancelled) {
          setData(nextData);
          setClientStatus(t.autoUpdating);
        }
      } catch (error) {
        if (!cancelled) {
          setClientStatus(error instanceof Error ? `${t.fallbackUpdateFailed}: ${error.message}` : t.fallbackUpdateFailed);
        }
      }
    }

    const interval = window.setInterval(refresh, 60000);
    refresh();

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [t.autoUpdating, t.fallbackUpdateFailed]);

  return (
    <>
      <aside aria-label={locale === "en" ? "Left ad space" : "左広告枠"} className="adRail adRailLeft">
        <span>{t.ad}</span>
      </aside>
      <aside aria-label={locale === "en" ? "Right ad space" : "右広告枠"} className="adRail adRailRight">
        <span>{t.ad}</span>
      </aside>

      <section className="topbar">
        <div>
          <p className="eyebrow">2026 FIFA World Cup</p>
          <h1>{t.heroTitle}</h1>
        </div>
        <div className={`sourceBadge ${data.state.isFallback ? "fallback" : "live"}`}>
          <strong>{t.updated} {data.state.updatedAtLabel}</strong>
          <small>{data.state.isFallback ? data.state.message : clientStatus}</small>
        </div>
        <p className="siteLead">
          {t.leadPrefix}<strong>{t.leadStrong}</strong>{t.leadSuffix}
          <a href={t.siteInfoHref}>{t.siteInfo}</a>
          <a href={t.alternateHref}>{t.alternateLabel}</a>
        </p>
      </section>

      <BracketBoard
        liveTeamIds={data.liveTeamIds}
        matches={data.state.matches}
        projection={data.projection}
        tables={data.tables}
        locale={locale}
      />
    </>
  );
}
