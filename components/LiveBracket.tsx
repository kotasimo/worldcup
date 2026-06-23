"use client";

import { useEffect, useState } from "react";
import { BracketBoard } from "@/components/BracketBoard";
import type { WorldCupViewModel } from "@/lib/view-model";

type Props = {
  initialData: WorldCupViewModel;
};

export function LiveBracket({ initialData }: Props) {
  const [data, setData] = useState(initialData);
  const [clientStatus, setClientStatus] = useState("自動更新中");

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
          setClientStatus("自動更新中");
        }
      } catch (error) {
        if (!cancelled) {
          setClientStatus(error instanceof Error ? `更新失敗: ${error.message}` : "更新失敗");
        }
      }
    }

    const interval = window.setInterval(refresh, 60000);
    refresh();

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <>
      <section className="topbar">
        <div>
          <p className="eyebrow">2026 FIFA World Cup</p>
          <h1>決勝トーナメント予測</h1>
        </div>
        <div className={`sourceBadge ${data.state.isFallback ? "fallback" : "live"}`}>
          <span>{data.state.source}</span>
          <strong>{data.state.updatedAtLabel}</strong>
          <small>{data.state.isFallback ? data.state.message : clientStatus}</small>
        </div>
      </section>

      <BracketBoard liveTeamIds={data.liveTeamIds} projection={data.projection} tables={data.tables} />
    </>
  );
}
