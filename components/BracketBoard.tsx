import Image from "next/image";
import { getCountryNameJa } from "@/lib/country-names";
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
          <BracketLines />

          {projection.matches.slice(0, 8).map((match, index) => (
            <MatchNode column={1} key={match.id} match={match} row={r32Rows[index]} />
          ))}

          {projection.matches.slice(8, 16).map((match, index) => (
            <MatchNode column={15} key={match.id} match={match} row={r32Rows[index]} />
          ))}

          <FutureNode column={3} matchNo={89} row={r16Rows[0]} />
          <FutureNode column={3} matchNo={90} row={r16Rows[1]} />
          <FutureNode column={3} matchNo={93} row={r16Rows[2]} />
          <FutureNode column={3} matchNo={94} row={r16Rows[3]} />

          <FutureNode column={13} matchNo={91} row={r16Rows[0]} />
          <FutureNode column={13} matchNo={92} row={r16Rows[1]} />
          <FutureNode column={13} matchNo={95} row={r16Rows[2]} />
          <FutureNode column={13} matchNo={96} row={r16Rows[3]} />

          <FutureNode column={5} matchNo={97} row={qfRows[0]} />
          <FutureNode column={5} matchNo={98} row={qfRows[1]} />
          <FutureNode column={11} matchNo={99} row={qfRows[0]} />
          <FutureNode column={11} matchNo={100} row={qfRows[1]} />

          <FutureNode column={7} matchNo={101} row={8} />
          <FutureNode column={9} matchNo={102} row={8} />
          <FinalNode />
          <ThirdPlaceNode />
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
          3位枠はAnnex C相当の割り当て表を参照します。表を取得できない場合のみ候補グループ内で暫定配置します。
        </p>
      </aside>
    </div>
  );
}

function FutureNode({ column, matchNo, row }: { column: number; matchNo: number; row: number }) {
  return (
    <article className="treeMatch futureMatch" style={{ gridColumn: column, gridRow: `${row} / span 2` }}>
      <div className="matchMeta">
        <span>M{matchNo}</span>
        <span />
      </div>
      <div className="slot futureSlot" />
      <div className="slot futureSlot" />
    </article>
  );
}

function FinalNode() {
  return (
    <article className="finalMatch" style={{ gridColumn: 8, gridRow: "7 / span 4" }}>
      <div className="finalTitle">決勝</div>
      <div className="slot futureSlot" />
      <div className="slot futureSlot" />
    </article>
  );
}

function ThirdPlaceNode() {
  return (
    <article className="thirdPlaceMatch" style={{ gridColumn: 8, gridRow: "13 / span 3" }}>
      <div className="thirdPlaceTitle">3位決定戦</div>
      <div className="slot futureSlot" />
      <div className="slot futureSlot" />
    </article>
  );
}

function MatchNode({
  column,
  match,
  row,
}: {
  column: number;
  match: BracketMatch;
  row: number;
}) {
  return (
    <article className="treeMatch" style={{ gridColumn: column, gridRow: `${row} / span 2` }}>
      <div className="matchMeta">
        <span>M{match.matchNo}</span>
        <span>{match.dateLabel}</span>
      </div>
      <TeamSlot slot={match.home} />
      <TeamSlot slot={match.away} />
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
  columnSpan = 1,
  direction,
  row,
  slim = false,
  span,
}: {
  column: number;
  columnSpan?: number;
  direction: "left" | "right";
  row: number;
  slim?: boolean;
  span: number;
}) {
  return (
    <div
      className={`connector ${direction} ${slim ? "slim" : ""}`}
      style={{ gridColumn: `${column} / span ${columnSpan}`, gridRow: `${row} / span ${span}` }}
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

function BracketLines() {
  return (
    <svg className="bracketLines" viewBox="0 0 1504 768" preserveAspectRatio="none">
      <path d="M170 48 H184 V96 H198 M170 144 H184" />
      <path d="M170 240 H184 V288 H198 M170 336 H184" />
      <path d="M170 432 H184 V480 H198 M170 528 H184" />
      <path d="M170 624 H184 V672 H198 M170 720 H184" />

      <path d="M354 96 H368 V192 H382 M354 288 H368" />
      <path d="M354 480 H368 V576 H382 M354 672 H368" />
      <path d="M528 192 H542 V384 H556 M528 576 H542" />
      <path d="M692 384 H752" />

      <path d="M1334 48 H1320 V96 H1306 M1334 144 H1320" />
      <path d="M1334 240 H1320 V288 H1306 M1334 336 H1320" />
      <path d="M1334 432 H1320 V480 H1306 M1334 528 H1320" />
      <path d="M1334 624 H1320 V672 H1306 M1334 720 H1320" />

      <path d="M1150 96 H1136 V192 H1122 M1150 288 H1136" />
      <path d="M1150 480 H1136 V576 H1122 M1150 672 H1136" />
      <path d="M976 192 H962 V384 H948 M976 576 H962" />
      <path d="M812 384 H752" />
    </svg>
  );
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
      <span>{getCountryNameJa(team)}</span>
    </span>
  );
}
