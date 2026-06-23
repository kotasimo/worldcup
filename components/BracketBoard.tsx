import Image from "next/image";
import { getFlagCode } from "@/lib/flags";
import type { BracketMatch, BracketProjection, BracketSlot, GroupTable, Team, TeamStanding } from "@/lib/types";

type Props = {
  projection: BracketProjection;
  tables: GroupTable[];
};

const r32Rows = [1, 3, 5, 7, 9, 11, 13, 15];
const r16Rows = [2, 6, 10, 14];
const qfRows = [4, 12];

export function BracketBoard({ projection, tables }: Props) {
  return (
    <div className="layout">
      <aside className="panel">
        <h2>グループ順位</h2>
        <div className="groups">
          {tables.map((table) => (
            <section className="groupTable" key={table.group}>
              <div className="groupTitle">
                <span>Group {table.group}</span>
                <span>Pts</span>
              </div>
              {table.standings.map((standing) => (
                <div className="teamRow" key={standing.team.id}>
                  <span className="rank">{standing.rank}</span>
                  <span className="teamName">
                    <TeamName team={standing.team} />
                  </span>
                  <span className="pts">{standing.points}</span>
                  <span className="gd">{formatGoalDifference(standing.goalDifference)}</span>
                </div>
              ))}
            </section>
          ))}
        </div>
      </aside>

      <section className="panel bracketPanel">
        <div className="bracketHead">
          <span>ラウンド32</span>
          <span>ラウンド16</span>
          <span>準々決勝</span>
          <span>準決勝</span>
          <span>決勝</span>
          <span>準決勝</span>
          <span>準々決勝</span>
          <span>ラウンド16</span>
          <span>ラウンド32</span>
        </div>

        <div className="bracketTree">
          {projection.matches.slice(0, 8).map((match, index) => (
            <MatchNode column={1} key={match.id} match={match} matchNo={index + 1} row={r32Rows[index]} />
          ))}

          {projection.matches.slice(8, 16).map((match, index) => (
            <MatchNode column={15} key={match.id} match={match} matchNo={index + 9} row={r32Rows[index]} />
          ))}

          {[0, 1, 2, 3].map((index) => (
            <FutureNode
              column={3}
              key={`l-r16-${index}`}
              matchNo={17 + index}
              row={r16Rows[index]}
              slots={[`M${index * 2 + 1} 勝者`, `M${index * 2 + 2} 勝者`]}
              title="ラウンド16"
            />
          ))}
          {[0, 1, 2, 3].map((index) => (
            <FutureNode
              column={13}
              key={`r-r16-${index}`}
              matchNo={21 + index}
              row={r16Rows[index]}
              slots={[`M${index * 2 + 9} 勝者`, `M${index * 2 + 10} 勝者`]}
              title="ラウンド16"
            />
          ))}

          {[0, 1].map((index) => (
            <FutureNode
              column={5}
              key={`l-qf-${index}`}
              matchNo={25 + index}
              row={qfRows[index]}
              slots={[`M${17 + index * 2} 勝者`, `M${18 + index * 2} 勝者`]}
              title="準々決勝"
            />
          ))}
          {[0, 1].map((index) => (
            <FutureNode
              column={11}
              key={`r-qf-${index}`}
              matchNo={27 + index}
              row={qfRows[index]}
              slots={[`M${21 + index * 2} 勝者`, `M${22 + index * 2} 勝者`]}
              title="準々決勝"
            />
          ))}

          <FutureNode column={7} matchNo={29} row={8} slots={["M25 勝者", "M26 勝者"]} title="準決勝" />
          <FutureNode column={9} matchNo={30} row={8} slots={["M27 勝者", "M28 勝者"]} title="準決勝" />
          <FinalNode />

          {[1, 5, 9, 13].map((row, index) => (
            <Connector column={2} direction="left" key={`lc1-${row}`} row={row} span={4} />
          ))}
          {[2, 10].map((row) => (
            <Connector column={4} direction="left" key={`lc2-${row}`} row={row} span={8} />
          ))}
          <Connector column={6} direction="left" row={4} span={10} />
          <Connector column={8} direction="left" row={8} span={2} slim />

          {[1, 5, 9, 13].map((row) => (
            <Connector column={14} direction="right" key={`rc1-${row}`} row={row} span={4} />
          ))}
          {[2, 10].map((row) => (
            <Connector column={12} direction="right" key={`rc2-${row}`} row={row} span={8} />
          ))}
          <Connector column={10} direction="right" row={4} span={10} />
          <Connector column={8} direction="right" row={10} span={2} slim />
        </div>
      </section>

      <aside className="panel">
        <h2>3位ランキング</h2>
        <div className="thirdList">
          {projection.thirdPlaceRankings.map((standing, index) => (
            <ThirdStanding standing={standing} index={index} key={standing.team.id} />
          ))}
        </div>
        <p className="note">
          3位枠は候補グループに合う上位チームを重複なしで暫定配置しています。APIキー未設定時はサンプルデータで表示します。
        </p>
      </aside>
    </div>
  );
}

function MatchNode({
  column,
  match,
  matchNo,
  row,
}: {
  column: number;
  match: BracketMatch;
  matchNo: number;
  row: number;
}) {
  return (
    <article className="treeMatch" style={{ gridColumn: column, gridRow: `${row} / span 2` }}>
      <div className="matchMeta">
        <span>M{matchNo}</span>
        <span>{match.dateLabel}</span>
      </div>
      <TeamSlot slot={match.home} />
      <TeamSlot slot={match.away} />
    </article>
  );
}

function FutureNode({
  column,
  matchNo,
  row,
  slots,
  title,
}: {
  column: number;
  matchNo: number;
  row: number;
  slots: [string, string];
  title: string;
}) {
  return (
    <article className="treeMatch futureMatch" style={{ gridColumn: column, gridRow: `${row} / span 2` }}>
      <div className="matchMeta">
        <span>M{matchNo}</span>
        <span>{title}</span>
      </div>
      <div className="slot futureSlot">
        <span className="slotTeam empty">{slots[0]}</span>
      </div>
      <div className="slot futureSlot">
        <span className="slotTeam empty">{slots[1]}</span>
      </div>
    </article>
  );
}

function FinalNode() {
  return (
    <article className="finalMatch" style={{ gridColumn: 8, gridRow: "7 / span 5" }}>
      <div className="finalTitle">決勝</div>
      <div className="slot futureSlot">
        <span className="slotTeam empty">M29 勝者</span>
      </div>
      <div className="slot futureSlot">
        <span className="slotTeam empty">M30 勝者</span>
      </div>
      <div className="championSlot">優勝</div>
    </article>
  );
}

function TeamSlot({ slot }: { slot: BracketSlot }) {
  return (
    <div className={`slot ${slot.provisional ? "provisional" : ""}`}>
      <span className="slotLabel">{slot.label}</span>
      <span className={`slotTeam ${slot.team ? "" : "empty"}`}>
        {slot.team ? (
          <TeamName team={slot.team.team} />
        ) : (
          "未定"
        )}
      </span>
    </div>
  );
}

function Connector({
  column,
  direction,
  row,
  slim = false,
  span,
}: {
  column: number;
  direction: "left" | "right";
  row: number;
  slim?: boolean;
  span: number;
}) {
  return (
    <div
      className={`connector ${direction} ${slim ? "slim" : ""}`}
      style={{ gridColumn: column, gridRow: `${row} / span ${span}` }}
    >
      <span />
    </div>
  );
}

function ThirdStanding({ standing, index }: { standing: TeamStanding; index: number }) {
  const qualifies = index < 8;

  return (
    <div className={`thirdRow ${qualifies ? "in" : ""}`}>
      <span className="thirdRank">{index + 1}</span>
      <span>
        <span className="thirdGroup">Group {standing.group}</span>{" "}
        <TeamName team={standing.team} />
      </span>
      <span className="thirdStatus">{qualifies ? "IN" : "OUT"}</span>
    </div>
  );
}

function formatGoalDifference(value: number) {
  return value > 0 ? `+${value}` : String(value);
}

function TeamName({ team }: { team: Team }) {
  const code = getFlagCode(team.name, team.tla);

  return (
    <span className="countryName">
      {code ? (
        <Image
          alt=""
          className="flagImage"
          height={14}
          loading="lazy"
          src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
          width={20}
        />
      ) : (
        <span className="flagFallback" />
      )}
      <span>{team.shortName}</span>
    </span>
  );
}
