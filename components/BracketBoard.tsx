import Image from "next/image";
import { getCountryNameJa } from "@/lib/country-names";
import { getFlagCode } from "@/lib/flags";
import type { BracketMatch, BracketProjection, BracketSlot, GroupTable, Match, Team, TeamStanding } from "@/lib/types";

type Props = {
  liveTeamIds: string[];
  matches: Match[];
  projection: BracketProjection;
  tables: GroupTable[];
};

const r32Rows = [1, 3, 5, 7, 9, 11, 13, 15];
const bracketRowHeight = 58;
const bracketHeight = bracketRowHeight * 16;

export function BracketBoard({ liveTeamIds, matches, projection, tables }: Props) {
  const liveTeams = new Set(liveTeamIds);
  const teamsById = new Map(tables.flatMap((table) => table.standings.map((standing) => [standing.team.id, standing.team])));
  const liveMatches = matches.filter((match) => match.status === "LIVE");

  return (
    <div className="layout">
      <aside className="panel">
        <h2>グループ順位</h2>
        <div className="groups">
          {tables.map((table) => (
            <section className="groupTable" key={table.group}>
              <div className="groupTitle">
                <span>Group {table.group}</span>
                <span className="groupColumns">
                  <span>勝</span>
                  <span>分</span>
                  <span>負</span>
                  <span>勝点</span>
                  <span>得失点</span>
                </span>
              </div>
              {table.standings.map((standing) => (
                <div className={`teamRow ${liveTeams.has(standing.team.id) ? "liveTeam" : ""}`} key={standing.team.id}>
                  <span className="rank">{standing.rank}</span>
                  <span className="teamName">
                    <TeamName team={standing.team} />
                  </span>
                  <span className="record">{standing.won}</span>
                  <span className="record">{standing.drawn}</span>
                  <span className="record">{standing.lost}</span>
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

        <LiveMatches matches={liveMatches} teamsById={teamsById} />
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

function LiveMatches({ matches, teamsById }: { matches: Match[]; teamsById: Map<string, Team> }) {
  return (
    <section className="liveMatches">
      <h2>現在の試合</h2>
      {matches.length > 0 ? (
        <div className="liveMatchList">
          {matches.map((match) => {
            const home = teamsById.get(match.homeTeamId);
            const away = teamsById.get(match.awayTeamId);

            return (
              <article className="liveMatchCard" key={match.id}>
                <span className="livePulse">LIVE</span>
                <div className="liveTeamSide">
                  {home ? <TeamName team={home} /> : "未定"}
                </div>
                <div className="liveScore">
                  <strong>{formatScore(match.homeScore)}</strong>
                  <span>-</span>
                  <strong>{formatScore(match.awayScore)}</strong>
                </div>
                <div className="liveTeamSide away">
                  {away ? <TeamName team={away} /> : "未定"}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="liveEmpty">現在進行中の試合はありません</p>
      )}
    </section>
  );
}

function formatScore(score: number | null) {
  return score === null ? "-" : String(score);
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
      <span className="countryFullName">{getCountryNameJa(team)}</span>
      <span className="countryCodeName">{getTeamCode(team)}</span>
    </span>
  );
}

function getTeamCode(team: Team) {
  return (team.tla || team.shortName || team.name).slice(0, 3).toUpperCase();
}
