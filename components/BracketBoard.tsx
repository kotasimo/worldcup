import Image from "next/image";
import { getCountryNameJa } from "@/lib/country-names";
import { getFlagCode } from "@/lib/flags";
import { labels, type Locale } from "@/lib/i18n";
import type { BracketMatch, BracketProjection, BracketSlot, GroupTable, Match, Team, TeamStanding } from "@/lib/types";

type Props = {
  liveTeamIds: string[];
  matches: Match[];
  projection: BracketProjection;
  tables: GroupTable[];
  locale?: Locale;
};

const r32Rows = [1, 3, 5, 7, 9, 11, 13, 15];
const bracketRowHeight = 58;
const bracketHeight = bracketRowHeight * 16;

export function BracketBoard({ liveTeamIds, matches, projection, tables, locale = "ja" }: Props) {
  const t = labels[locale];
  const liveTeams = new Set(liveTeamIds);
  const teamsById = new Map(tables.flatMap((table) => table.standings.map((standing) => [standing.team.id, standing.team])));
  const liveMatches = matches.filter((match) => match.status === "LIVE");

  return (
    <div className="layout">
      <aside className="panel">
        <h2>{t.groupStandings}</h2>
        <div className="groups">
          {tables.map((table) => (
            <section className="groupTable" key={table.group}>
              <div className="groupTitle">
                <span>Group {table.group}</span>
                <span className="groupColumns">
                  <span>{t.groupColumns.won}</span>
                  <span>{t.groupColumns.drawn}</span>
                  <span>{t.groupColumns.lost}</span>
                  <span>{t.groupColumns.points}</span>
                  <span>{t.groupColumns.goalDifference}</span>
                </span>
              </div>
              {table.standings.map((standing) => (
                <div className={`teamRow ${liveTeams.has(standing.team.id) ? "liveTeam" : ""}`} key={standing.team.id}>
                  <span className="rank">{standing.rank}</span>
                  <span className="teamName">
                    <TeamName locale={locale} team={standing.team} />
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
            <MatchNode column={1} key={match.id} liveTeams={liveTeams} locale={locale} match={match} row={r32Rows[index]} />
          ))}

          {projection.matches.slice(8, 16).map((match, index) => (
            <MatchNode column={15} key={match.id} liveTeams={liveTeams} locale={locale} match={match} row={r32Rows[index]} />
          ))}
        </div>

        <LiveMatches locale={locale} matches={liveMatches} teamsById={teamsById} />
      </section>

      <aside className="panel">
        <h2>{t.thirdPlaceRanking}</h2>
        <div className="thirdList">
          {projection.thirdPlaceRankings.map((standing, index) => (
            <ThirdStanding locale={locale} standing={standing} index={index} key={standing.team.id} />
          ))}
        </div>
        <p className="note">{t.thirdPlaceNote}</p>
      </aside>
    </div>
  );
}

function LiveMatches({ locale, matches, teamsById }: { locale: Locale; matches: Match[]; teamsById: Map<string, Team> }) {
  const t = labels[locale];

  return (
    <section className="liveMatches">
      <h2>{t.liveMatches}</h2>
      {matches.length > 0 ? (
        <div className="liveMatchList">
          {matches.map((match) => {
            const home = teamsById.get(match.homeTeamId);
            const away = teamsById.get(match.awayTeamId);

            return (
              <article className="liveMatchCard" key={match.id}>
                <span className="livePulse">LIVE</span>
                <div className="liveTeamSide">
                  {home ? <TeamName locale={locale} team={home} /> : t.tbd}
                </div>
                <div className="liveScore">
                  <strong>{formatScore(match.homeScore)}</strong>
                  <span>-</span>
                  <strong>{formatScore(match.awayScore)}</strong>
                </div>
                <div className="liveTeamSide away">
                  {away ? <TeamName locale={locale} team={away} /> : t.tbd}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="liveEmpty">{t.noLiveMatches}</p>
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
  locale,
  match,
  row,
}: {
  column: number;
  liveTeams: Set<string>;
  locale: Locale;
  match: BracketMatch;
  row: number;
}) {
  return (
    <article className="treeMatch" style={{ gridColumn: column, gridRow: `${row} / span 2` }}>
      <div className="matchMeta">
        <span>M{match.matchNo}</span>
        <span>{match.dateLabel}</span>
      </div>
      <TeamSlot isLive={Boolean(match.home.team && liveTeams.has(match.home.team.team.id))} locale={locale} slot={match.home} />
      <TeamSlot isLive={Boolean(match.away.team && liveTeams.has(match.away.team.team.id))} locale={locale} slot={match.away} />
    </article>
  );
}

function TeamSlot({ isLive, locale, slot }: { isLive: boolean; locale: Locale; slot: BracketSlot }) {
  const t = labels[locale];

  return (
    <div className={`slot ${slot.provisional ? "provisional" : ""} ${slot.locked ? "locked" : ""} ${isLive ? "liveSlot" : ""}`}>
      <span className="slotLabel">{slot.label}</span>
      <span className={`slotTeam ${slot.team ? "" : "empty"}`}>
        {slot.team ? (
          <TeamName locale={locale} team={slot.team.team} />
        ) : (
          t.tbd
        )}
      </span>
    </div>
  );
}

function ThirdStanding({ locale, standing, index }: { locale: Locale; standing: TeamStanding; index: number }) {
  const qualifies = index < 8;

  return (
    <div className={`thirdRow ${qualifies ? "in" : ""}`}>
      <span className="thirdRank">{index + 1}</span>
      <span>
        <span className="thirdGroup">Group {standing.group}</span>{" "}
        <TeamName locale={locale} team={standing.team} />
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

function TeamName({ locale, team }: { locale: Locale; team: Team }) {
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
      <span className="countryFullName">{locale === "ja" ? getCountryNameJa(team) : getCountryNameEn(team)}</span>
      <span className="countryCodeName">{getTeamCode(team)}</span>
    </span>
  );
}

function getCountryNameEn(team: Team) {
  return team.shortName || team.name;
}

function getTeamCode(team: Team) {
  return (team.tla || team.shortName || team.name).slice(0, 3).toUpperCase();
}
