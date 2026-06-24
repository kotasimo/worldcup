import type { GroupCode, TeamStanding } from "./types";

const templateUrl =
  "https://en.wikipedia.org/w/index.php?title=Template:2026_FIFA_World_Cup_third-place_table&action=raw";

const assignmentSlots = ["1A", "1B", "1D", "1E", "1G", "1I", "1K", "1L"] as const;

const slotToMatchKey: Record<(typeof assignmentSlots)[number], string> = {
  "1A": "m79:away",
  "1B": "m85:away",
  "1D": "m81:away",
  "1E": "m74:away",
  "1G": "m82:away",
  "1I": "m77:away",
  "1K": "m87:away",
  "1L": "m80:away",
};

type ThirdPlaceRow = {
  groupsKey: string;
  assignments: Record<(typeof assignmentSlots)[number], GroupCode>;
};

const staticRows: ThirdPlaceRow[] = [
  toThirdPlaceRow("ACDFGHJL", "CGJDAFLH"),
];

let cachedRows: ThirdPlaceRow[] | null = null;

export async function getOfficialThirdPlaceAssignments(qualifiedThirds: TeamStanding[]) {
  const standingsByGroup = new Map<GroupCode, TeamStanding>(
    qualifiedThirds.map((standing) => [standing.group, standing]),
  );
  const groupsKey = [...standingsByGroup.keys()].sort().join("");
  const rows = await getThirdPlaceRows();
  const row =
    rows.find((item) => item.groupsKey === groupsKey) ??
    staticRows.find((item) => item.groupsKey === groupsKey);

  if (!row) {
    return null;
  }

  const assignment = new Map<string, TeamStanding>();

  assignmentSlots.forEach((slot) => {
    const group = row.assignments[slot];
    const standing = standingsByGroup.get(group);

    if (standing) {
      assignment.set(slotToMatchKey[slot], standing);
    }
  });

  return assignment;
}

async function getThirdPlaceRows() {
  if (cachedRows) {
    return cachedRows;
  }

  try {
    const response = await fetch(templateUrl, { next: { revalidate: 86400 } });

    if (!response.ok) {
      return [];
    }

    const raw = await response.text();
    cachedRows = parseThirdPlaceRows(raw);

    return cachedRows;
  } catch {
    return [];
  }
}

function parseThirdPlaceRows(raw: string): ThirdPlaceRow[] {
  const rows: ThirdPlaceRow[] = [];
  const rowPattern = /!\s*scope="row"\s*\|\s*\d+\s*\n\|([^\n]+)/g;
  let match: RegExpExecArray | null;

  while ((match = rowPattern.exec(raw)) !== null) {
    const cells = match[1].split("||").map(cleanCell);
    const groups = cells.slice(0, 12).filter(isGroupCode);
    const assignmentGroups = cells
      .slice(12)
      .map((cell) => cell.match(/^3([A-L])$/)?.[1])
      .filter(isGroupCode);

    if (groups.length !== 8 || assignmentGroups.length !== 8) {
      continue;
    }

    rows.push({
      groupsKey: groups.sort().join(""),
      assignments: Object.fromEntries(
        assignmentSlots.map((slot, index) => [slot, assignmentGroups[index]]),
      ) as Record<(typeof assignmentSlots)[number], GroupCode>,
    });
  }

  return rows;
}

function cleanCell(value: string) {
  return value.replaceAll("'", "").replaceAll("|", "").trim();
}

function isGroupCode(value: string | undefined): value is GroupCode {
  return Boolean(value && "ABCDEFGHIJKL".includes(value));
}

function toThirdPlaceRow(groupsKey: string, assignmentKey: string): ThirdPlaceRow {
  return {
    groupsKey,
    assignments: Object.fromEntries(
      assignmentSlots.map((slot, index) => [slot, assignmentKey[index]]),
    ) as Record<(typeof assignmentSlots)[number], GroupCode>,
  };
}
