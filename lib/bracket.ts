import type {
  BracketMatch,
  BracketProjection,
  BracketSlot,
  GroupCode,
  GroupTable,
  Match,
  Team,
  TeamStanding,
} from "./types";
import { getOfficialThirdPlaceAssignments } from "./third-place";

const groupCodes = "ABCDEFGHIJKL".split("") as GroupCode[];

type SlotSource =
  | { type: "group"; group: GroupCode; rank: 1 | 2 }
  | { type: "third"; candidates: GroupCode[] };

type MatchTemplate = {
  id: string;
  matchNo: number;
  round: BracketMatch["round"];
  label: string;
  dateLabel: string;
  home: SlotSource;
  away: SlotSource;
};

const r32Templates: MatchTemplate[] = [
  {
    id: "m74",
    matchNo: 74,
    round: "R32",
    label: "ラウンド32",
    dateLabel: "6/29",
    home: { type: "group", group: "E", rank: 1 },
    away: { type: "third", candidates: ["A", "B", "C", "D", "F"] },
  },
  {
    id: "m77",
    matchNo: 77,
    round: "R32",
    label: "ラウンド32",
    dateLabel: "6/30",
    home: { type: "group", group: "I", rank: 1 },
    away: { type: "third", candidates: ["C", "D", "F", "G", "H"] },
  },
  {
    id: "m73",
    matchNo: 73,
    round: "R32",
    label: "ラウンド32",
    dateLabel: "6/28",
    home: { type: "group", group: "A", rank: 2 },
    away: { type: "group", group: "B", rank: 2 },
  },
  {
    id: "m75",
    matchNo: 75,
    round: "R32",
    label: "ラウンド32",
    dateLabel: "6/29",
    home: { type: "group", group: "F", rank: 1 },
    away: { type: "group", group: "C", rank: 2 },
  },
  {
    id: "m83",
    matchNo: 83,
    round: "R32",
    label: "ラウンド32",
    dateLabel: "7/2",
    home: { type: "group", group: "K", rank: 2 },
    away: { type: "group", group: "L", rank: 2 },
  },
  {
    id: "m84",
    matchNo: 84,
    round: "R32",
    label: "ラウンド32",
    dateLabel: "7/2",
    home: { type: "group", group: "H", rank: 1 },
    away: { type: "group", group: "J", rank: 2 },
  },
  {
    id: "m81",
    matchNo: 81,
    round: "R32",
    label: "ラウンド32",
    dateLabel: "7/1",
    home: { type: "group", group: "D", rank: 1 },
    away: { type: "third", candidates: ["B", "E", "F", "I", "J"] },
  },
  {
    id: "m82",
    matchNo: 82,
    round: "R32",
    label: "ラウンド32",
    dateLabel: "7/1",
    home: { type: "group", group: "G", rank: 1 },
    away: { type: "third", candidates: ["A", "E", "H", "I", "J"] },
  },
  {
    id: "m76",
    matchNo: 76,
    round: "R32",
    label: "ラウンド32",
    dateLabel: "6/29",
    home: { type: "group", group: "C", rank: 1 },
    away: { type: "group", group: "F", rank: 2 },
  },
  {
    id: "m78",
    matchNo: 78,
    round: "R32",
    label: "ラウンド32",
    dateLabel: "6/30",
    home: { type: "group", group: "E", rank: 2 },
    away: { type: "group", group: "I", rank: 2 },
  },
  {
    id: "m79",
    matchNo: 79,
    round: "R32",
    label: "ラウンド32",
    dateLabel: "6/30",
    home: { type: "group", group: "A", rank: 1 },
    away: { type: "third", candidates: ["C", "E", "F", "H", "I"] },
  },
  {
    id: "m80",
    matchNo: 80,
    round: "R32",
    label: "ラウンド32",
    dateLabel: "7/1",
    home: { type: "group", group: "L", rank: 1 },
    away: { type: "third", candidates: ["E", "H", "I", "J", "K"] },
  },
  {
    id: "m86",
    matchNo: 86,
    round: "R32",
    label: "ラウンド32",
    dateLabel: "7/3",
    home: { type: "group", group: "J", rank: 1 },
    away: { type: "group", group: "H", rank: 2 },
  },
  {
    id: "m88",
    matchNo: 88,
    round: "R32",
    label: "ラウンド32",
    dateLabel: "7/3",
    home: { type: "group", group: "D", rank: 2 },
    away: { type: "group", group: "G", rank: 2 },
  },
  {
    id: "m85",
    matchNo: 85,
    round: "R32",
    label: "ラウンド32",
    dateLabel: "7/2",
    home: { type: "group", group: "B", rank: 1 },
    away: { type: "third", candidates: ["E", "F", "G", "I", "J"] },
  },
  {
    id: "m87",
    matchNo: 87,
    round: "R32",
    label: "ラウンド32",
    dateLabel: "7/3",
    home: { type: "group", group: "K", rank: 1 },
    away: { type: "third", candidates: ["D", "E", "I", "J", "L"] },
  },
];

export function calculateGroupTables(teams: Team[], matches: Match[]): GroupTable[] {
  const standings = new Map<string, TeamStanding>();

  teams.forEach((team) => {
    standings.set(team.id, {
      team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      group: team.group,
      rank: 0,
    });
  });

  matches.forEach((match) => {
    if (match.homeScore === null || match.awayScore === null) {
      return;
    }

    const home = standings.get(match.homeTeamId);
    const away = standings.get(match.awayTeamId);

    if (!home || !away) {
      return;
    }

    home.played += 1;
    away.played += 1;
    home.goalsFor += match.homeScore;
    home.goalsAgainst += match.awayScore;
    away.goalsFor += match.awayScore;
    away.goalsAgainst += match.homeScore;

    if (match.homeScore > match.awayScore) {
      home.won += 1;
      away.lost += 1;
      home.points += 3;
    } else if (match.homeScore < match.awayScore) {
      away.won += 1;
      home.lost += 1;
      away.points += 3;
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += 1;
      away.points += 1;
    }
  });

  standings.forEach((standing) => {
    standing.goalDifference = standing.goalsFor - standing.goalsAgainst;
  });

  return groupCodes.map((group) => {
    const groupStandings = [...standings.values()]
      .filter((standing) => standing.group === group)
      .sort(compareStandings)
      .map((standing, index) => ({ ...standing, rank: index + 1 }));

    return { group, standings: groupStandings };
  });
}

export async function buildBracketProjection(tables: GroupTable[], matches: Match[]): Promise<BracketProjection> {
  const lockedRanks = getLockedGroupRanks(tables, matches);
  const thirdPlaceRankings = tables
    .map((table) => table.standings[2])
    .filter(Boolean)
    .sort(compareStandings);

  const qualifiedThirds = thirdPlaceRankings.slice(0, 8);
  const thirdAssignments =
    (await getOfficialThirdPlaceAssignments(qualifiedThirds)) ?? assignThirdPlaceSlots(qualifiedThirds);

  return {
    thirdPlaceRankings,
    matches: r32Templates.map((template) => {
      const homeKey = `${template.id}:home`;
      const awayKey = `${template.id}:away`;

      return {
        ...template,
        home: resolveSlot(template.home, tables, thirdAssignments, homeKey, lockedRanks),
        away: resolveSlot(template.away, tables, thirdAssignments, awayKey, lockedRanks),
      };
    }),
  };
}

function getLockedGroupRanks(tables: GroupTable[], matches: Match[]) {
  const locked = new Set<string>();

  tables.forEach((table) => {
    const groupMatches = matches.filter((match) => match.group === table.group);
    const remainingByTeam = new Map<string, number>();

    table.standings.forEach((standing) => {
      remainingByTeam.set(standing.team.id, 0);
    });

    groupMatches.forEach((match) => {
      if (match.homeScore !== null && match.awayScore !== null) {
        return;
      }

      remainingByTeam.set(match.homeTeamId, (remainingByTeam.get(match.homeTeamId) ?? 0) + 1);
      remainingByTeam.set(match.awayTeamId, (remainingByTeam.get(match.awayTeamId) ?? 0) + 1);
    });

    const hasRemaining = [...remainingByTeam.values()].some((remaining) => remaining > 0);

    if (!hasRemaining) {
      table.standings.forEach((standing) => {
        locked.add(`${table.group}:${standing.rank}`);
      });
      return;
    }

    table.standings.forEach((standing, index) => {
      const maxPoints = standing.points + (remainingByTeam.get(standing.team.id) ?? 0) * 3;
      const aboveCannotBeCaught = table.standings
        .slice(0, index)
        .every((above) => above.points > maxPoints);
      const belowCannotCatch = table.standings
        .slice(index + 1)
        .every((below) => standing.points > below.points + (remainingByTeam.get(below.team.id) ?? 0) * 3);

      if (aboveCannotBeCaught && belowCannotCatch) {
        locked.add(`${table.group}:${standing.rank}`);
      }
    });
  });

  return locked;
}

function compareStandings(a: TeamStanding, b: TeamStanding) {
  return (
    b.points - a.points ||
    b.goalDifference - a.goalDifference ||
    b.goalsFor - a.goalsFor ||
    a.goalsAgainst - b.goalsAgainst ||
    a.team.name.localeCompare(b.team.name)
  );
}

function assignThirdPlaceSlots(qualifiedThirds: TeamStanding[]) {
  const available = new Map<GroupCode, TeamStanding>(
    qualifiedThirds.map((standing) => [standing.group, standing]),
  );
  const assignment = new Map<string, TeamStanding>();

  r32Templates
    .filter((template) => template.away.type === "third" || template.home.type === "third")
    .forEach((template) => {
      [template.home, template.away].forEach((slot) => {
        if (slot.type !== "third") {
          return;
        }

        const picked = qualifiedThirds.find(
          (standing) => slot.candidates.includes(standing.group) && available.has(standing.group),
        );

        if (picked) {
          const side = template.home === slot ? "home" : "away";
          assignment.set(`${template.id}:${side}`, picked);
          available.delete(picked.group);
        }
      });
    });

  return assignment;
}

function resolveSlot(
  source: SlotSource,
  tables: GroupTable[],
  thirdAssignments: Map<string, TeamStanding>,
  slotKey: string,
  lockedRanks: Set<string>,
): BracketSlot {
  if (source.type === "group") {
    const team = tables.find((table) => table.group === source.group)?.standings[source.rank - 1];
    return {
      label: `グループ${source.group} ${source.rank}位`,
      team,
      provisional: Boolean(team && team.played < 3),
      locked: lockedRanks.has(`${source.group}:${source.rank}`),
    };
  }

  const label = `グループ${source.candidates.join("/")} 3位`;

  return {
    label,
    team: thirdAssignments.get(slotKey),
    provisional: true,
  };
}
