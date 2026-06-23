import Image from "next/image";
import { getCountryNameJa } from "@/lib/country-names";
import { getFlagCode } from "@/lib/flags";
import type { BracketMatch, BracketProjection, BracketSlot, GroupTable, Team, TeamStanding } from "@/lib/types";

type Props = {
  liveTeamIds: string[];
  projection: BracketProjection;
  tables: GroupTable[];
};

const r32Rows = [1, 3, 5, 7, 9, 11, 13, 15];
const bracketRowHeight = 58;
const bracketHeight = bracketRowHeight * 16;

export function BracketBoard({ liveTeamIds, projection, tables }: Props) {
  const liveTeams = new Set(liveTeamIds);

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
                <div className={`teamRow ${liveTeams.has(standing.team.id) ? "liveTeam" : ""}`} key={standing.team.id}>
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
        <div className="bracketTree">
          <BracketLines />

          {projection.matches.slice(0, 8).map((match, index) => (
            <MatchNode column={1} key={match.id} liveTeams={liveTeams} match={match} row={r32Rows[index]} />
          ))}

          {projection.matches.slice(8, 16).map((match, index) => (
            <MatchNode column={15} key={match.id} liveTeams={liveTeams} match={match} row={r32Rows[index]} />
          ))}
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

function MatchNode({
  column,
  liveTeams,
  match,
  row,
}: {
  column: number;
  liveTeams: Set<string>;
  match: BracketMatch;
  row: number;
}) {
  return (
    <article className="treeMatch" style={{ gridColumn: column, gridRow: `${row} / span 2` }}>
      <div className="matchMeta">
        <span>M{match.matchNo}</span>
        <span>{match.dateLabel}</span>
      </div>
      <TeamSlot isLive={Boolean(match.home.team && liveTeams.has(match.home.team.team.id))} slot={match.home} />
      <TeamSlot isLive={Boolean(match.away.team && liveTeams.has(match.away.team.team.id))} slot={match.away} />
    </article>
  );
}

function TeamSlot({ isLive, slot }: { isLive: boolean; slot: BracketSlot }) {
  return (
    <div className={`slot ${slot.provisional ? "provisional" : ""} ${slot.locked ? "locked" : ""} ${isLive ? "liveSlot" : ""}`}>
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
  const y = r32Rows.map((row) => (row - 1) * bracketRowHeight + bracketRowHeight);
  const left = buildSidePaths(y, [170, 300, 470, 640, 752]);
  const right = buildSidePaths(y, [1334, 1204, 1034, 864, 752]);

  return (
    <svg className="bracketLines" viewBox={`0 0 1504 ${bracketHeight}`} preserveAspectRatio="none">
      {left.map((path, index) => (
        <path d={path} key={`left-${index}`} />
      ))}
      {right.map((path, index) => (
        <path d={path} key={`right-${index}`} />
      ))}
    </svg>
  );
}

function buildSidePaths(leafCenters: number[], xLevels: number[]) {
  let currentYs = leafCenters;
  const paths: string[] = [];

  for (let level = 0; level < xLevels.length - 1; level += 1) {
    const xStart = xLevels[level];
    const xEnd = xLevels[level + 1];
    const xJoin = xStart + (xEnd - xStart) * 0.72;
    const nextYs: number[] = [];

    for (let index = 0; index < currentYs.length; index += 2) {
      const y1 = currentYs[index];
      const y2 = currentYs[index + 1];
      const yMid = (y1 + y2) / 2;
      nextYs.push(yMid);

      paths.push(`M${xStart} ${y1} H${xJoin} V${y2} H${xStart} M${xJoin} ${yMid} H${xEnd}`);
    }

    currentYs = nextYs;
  }

  return paths;
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
