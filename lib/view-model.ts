import type { BracketProjection, GroupTable } from "./types";
import { fetchWorldCupState, type WorldCupState } from "./api";
import { buildBracketProjection, calculateGroupTables } from "./bracket";

export type WorldCupViewModel = {
  state: WorldCupState;
  tables: GroupTable[];
  projection: BracketProjection;
};

export async function getWorldCupViewModel(): Promise<WorldCupViewModel> {
  const state = await fetchWorldCupState();
  const tables = calculateGroupTables(state.teams, state.matches);
  const projection = buildBracketProjection(tables);

  return {
    state,
    tables,
    projection,
  };
}
