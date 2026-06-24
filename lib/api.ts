import { sampleMatches, sampleTeams } from "./sample-data";
import type { GroupCode, Match, MatchStatus, Team } from "./types";

export type WorldCupState = {
  teams: Team[];
  matches: Match[];
  source: string;
  updatedAtLabel: string;
  isFallback: boolean;
  message: string;
};

type FootballDataMatch = {
  id: number;
  utcDate: string;
  status: string;
  group?: string | null;
  stage?: string | null;
  homeTeam: { id: number | null; name: string; shortName?: string; tla?: string };
  awayTeam: { id: number | null; name: string; shortName?: string; tla?: string };
  score: {
    fullTime: { home: number | null; away: number | null };
  };
};

type FootballDataResponse = {
  matches?: FootballDataMatch[];
};

export async function fetchWorldCupState(): Promise<WorldCupState> {
  const token = process.env.FOOTBALL_DATA_API_KEY;

  if (!token) {
    return sampleState("Sample data", "FOOTBALL_DATA_API_KEY is not set.");
  }

  try {
    const response = await fetch("https://api.football-data.org/v4/competitions/WC/matches?season=2026", {
      headers: { "X-Auth-Token": token },
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      return sampleState(`API fallback (${response.status})`, `football-data.org returned ${response.status}.`);
    }

    const data = (await response.json()) as FootballDataResponse;
    const parsed = parseFootballData(data.matches ?? []);

    if (parsed.matches.length === 0 || parsed.teams.length === 0) {
      return sampleState("API fallback (no group data)", "No group-stage match data was returned.");
    }

    return {
      ...parsed,
      source: "football-data.org",
      updatedAtLabel: new Intl.DateTimeFormat("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Tokyo",
      }).format(new Date()),
      isFallback: false,
      message: `${parsed.matches.length} matches loaded from football-data.org.`,
    };
  } catch {
    return sampleState("API fallback", "Failed to fetch football-data.org.");
  }
}

function sampleState(source: string, message: string): WorldCupState {
  return {
    teams: sampleTeams,
    matches: sampleMatches,
    source,
    updatedAtLabel: "サンプル",
    isFallback: true,
    message,
  };
}

function parseFootballData(matches: FootballDataMatch[]) {
  const groupMatches = matches.filter((match) => getGroupCode(match));
  const teamsById = new Map<string, Team>();

  const parsedMatches: Match[] = groupMatches.flatMap((match) => {
    const group = getGroupCode(match);

    if (!group || !match.homeTeam.id || !match.awayTeam.id) {
      return [];
    }

    const homeTeam = toTeam(match.homeTeam, group);
    const awayTeam = toTeam(match.awayTeam, group);
    teamsById.set(homeTeam.id, homeTeam);
    teamsById.set(awayTeam.id, awayTeam);

    return {
      id: String(match.id),
      group,
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id,
      homeScore: match.score.fullTime.home,
      awayScore: match.score.fullTime.away,
      status: normalizeStatus(match.status),
      utcDate: match.utcDate,
    };
  });

  return {
    teams: [...teamsById.values()],
    matches: parsedMatches,
  };
}

function toTeam(
  team: FootballDataMatch["homeTeam"],
  group: GroupCode,
): Team {
  return {
    id: String(team.id),
    name: team.name,
    shortName: team.shortName || team.tla || team.name,
    tla: team.tla,
    group,
  };
}

function getGroupCode(match: FootballDataMatch): GroupCode | null {
  const raw = match.group || match.stage || "";
  const letter = raw.match(/[A-L]$/)?.[0] ?? raw.match(/GROUP_([A-L])/)?.[1];

  return isGroupCode(letter) ? letter : null;
}

function isGroupCode(value: string | undefined): value is GroupCode {
  return Boolean(value && "ABCDEFGHIJKL".includes(value));
}

function normalizeStatus(status: string): MatchStatus {
  if (["FINISHED", "AWARDED"].includes(status)) {
    return "FINISHED";
  }

  if (["LIVE", "IN_PLAY", "PAUSED"].includes(status)) {
    return "LIVE";
  }

  return "SCHEDULED";
}
