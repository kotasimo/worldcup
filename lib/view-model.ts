import type { BracketProjection, GroupTable } from "./types";
import { fetchWorldCupState, type WorldCupState } from "./api";
import { buildBracketProjection, calculateGroupTables } from "./bracket";

export type WorldCupViewModel = {
  state: WorldCupState;
  tables: GroupTable[];
  projection: BracketProjection;
  liveTeamIds: string[];
};

export async function getWorldCupViewModel(): Promise<WorldCupViewModel> {
  const state = await fetchWorldCupState();
  const tables = calculateGroupTables(state.teams, state.matches);
  const projection = await buildBracketProjection(tables, state.matches);

  return {
    state,
    tables,
    projection,
    liveTeamIds: getLiveTeamIds(state),
  };
}

function getLiveTeamIds(state: WorldCupState) {
  return [
    ...new Set(
      state.matches
        .filter((match) => match.status === "LIVE")
        .flatMap((match) => [match.homeTeamId, match.awayTeamId]),
    ),
  ];
}
