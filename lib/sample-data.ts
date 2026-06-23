import type { Match, Team } from "./types";

const groups = [
  ["Mexico", "South Africa", "South Korea", "Croatia"],
  ["Canada", "Switzerland", "Qatar", "Ghana"],
  ["Brazil", "Japan", "Norway", "Tunisia"],
  ["United States", "Colombia", "Egypt", "Scotland"],
  ["Spain", "Senegal", "Saudi Arabia", "Chile"],
  ["France", "Morocco", "New Zealand", "Panama"],
  ["Germany", "Uruguay", "Costa Rica", "Australia"],
  ["Portugal", "Serbia", "Honduras", "Iraq"],
  ["Argentina", "Denmark", "Jamaica", "Mali"],
  ["England", "Ecuador", "Algeria", "Haiti"],
  ["Netherlands", "Iran", "Peru", "Uzbekistan"],
  ["Belgium", "Poland", "Cameroon", "Bolivia"],
] as const;

const nameToTla: Record<string, string> = {
  Algeria: "ALG",
  Argentina: "ARG",
  Australia: "AUS",
  Belgium: "BEL",
  Bolivia: "BOL",
  Brazil: "BRA",
  Cameroon: "CAM",
  Canada: "CAN",
  Chile: "CHI",
  Colombia: "COL",
  "Costa Rica": "CRC",
  Croatia: "CRO",
  Denmark: "DEN",
  Ecuador: "ECU",
  Egypt: "EGY",
  England: "ENG",
  France: "FRA",
  Germany: "GER",
  Ghana: "GHA",
  Haiti: "HAI",
  Honduras: "HON",
  Iran: "IRN",
  Iraq: "IRQ",
  Jamaica: "JAM",
  Japan: "JPN",
  Mali: "MLI",
  Mexico: "MEX",
  Morocco: "MAR",
  Netherlands: "NED",
  "New Zealand": "NZL",
  Norway: "NOR",
  Panama: "PAN",
  Peru: "PER",
  Poland: "POL",
  Portugal: "POR",
  Qatar: "QAT",
  "Saudi Arabia": "KSA",
  Scotland: "SCO",
  Senegal: "SEN",
  Serbia: "SRB",
  "South Africa": "RSA",
  "South Korea": "KOR",
  Spain: "ESP",
  Switzerland: "SUI",
  Tunisia: "TUN",
  "United States": "USA",
  Uruguay: "URU",
  Uzbekistan: "UZB",
};

export const sampleTeams: Team[] = groups.flatMap((names, index) => {
  const group = String.fromCharCode(65 + index) as Team["group"];
  return names.map((name, teamIndex) => ({
    id: `${group}${teamIndex + 1}`,
    name,
    shortName: name,
    tla: nameToTla[name],
    group,
  }));
});

const scorePairs = [
  [2, 0],
  [1, 1],
  [3, 1],
  [0, 2],
  [1, 0],
  [2, 2],
] as const;

export const sampleMatches: Match[] = groups.flatMap((_, groupIndex) => {
  const group = String.fromCharCode(65 + groupIndex) as Team["group"];
  const ids = [1, 2, 3, 4].map((teamIndex) => `${group}${teamIndex}`);
  const pairings = [
    [ids[0], ids[1]],
    [ids[2], ids[3]],
    [ids[0], ids[2]],
    [ids[1], ids[3]],
    [ids[0], ids[3]],
    [ids[1], ids[2]],
  ];

  return pairings.map(([homeTeamId, awayTeamId], matchIndex) => {
    const played = matchIndex < 4 || (groupIndex % 4 === 0 && matchIndex === 4);
    const score = scorePairs[(groupIndex + matchIndex) % scorePairs.length];

    return {
      id: `${group}-${matchIndex + 1}`,
      group,
      homeTeamId,
      awayTeamId,
      homeScore: played ? score[0] : null,
      awayScore: played ? score[1] : null,
      status: played ? "FINISHED" : "SCHEDULED",
    };
  });
});
