export type GroupCode =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L";

export type Team = {
  id: string;
  name: string;
  shortName: string;
  tla?: string;
  group: GroupCode;
};

export type MatchStatus = "SCHEDULED" | "LIVE" | "FINISHED";

export type Match = {
  id: string;
  group: GroupCode;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  utcDate?: string;
};

export type TeamStanding = {
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  group: GroupCode;
  rank: number;
};

export type GroupTable = {
  group: GroupCode;
  standings: TeamStanding[];
};

export type BracketSlot = {
  label: string;
  team?: TeamStanding;
  provisional: boolean;
};

export type BracketMatch = {
  id: string;
  matchNo: number;
  round: "R32" | "R16" | "QF" | "SF" | "FINAL";
  label: string;
  dateLabel: string;
  home: BracketSlot;
  away: BracketSlot;
};

export type BracketProjection = {
  matches: BracketMatch[];
  thirdPlaceRankings: TeamStanding[];
};
