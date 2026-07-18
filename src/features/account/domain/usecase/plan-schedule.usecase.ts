import type { SavedTravelPlanItem } from "../entity/user-wedding.entity";

export type PlanScheduleEntry =
  | { kind: "shooting"; date: string | null }
  | { kind: "item"; date: string | null; item: SavedTravelPlanItem };

interface BuildPlanScheduleEntriesOptions {
  /** 촬영일이 미정이어도 목록에 노출할지 (플래너는 노출, 프로필 요약은 숨김) */
  includeUndatedShooting?: boolean;
}

// 촬영일과 여행 장소를 하나의 일정 축으로 합친다.
// 날짜가 있는 항목이 날짜순으로 앞에 오고(같은 날은 촬영일 먼저),
// 미정 항목은 촬영일 → 담은 순서로 뒤에 온다.
export function buildPlanScheduleEntries(
  shootingDate: string | null,
  travelPlanItems: SavedTravelPlanItem[],
  { includeUndatedShooting = true }: BuildPlanScheduleEntriesOptions = {},
): PlanScheduleEntry[] {
  const entries: PlanScheduleEntry[] = travelPlanItems.map((item) => ({
    kind: "item",
    date: item.plannedDate,
    item,
  }));

  if (shootingDate || includeUndatedShooting) {
    entries.push({ kind: "shooting", date: shootingDate });
  }

  return entries.sort(compareEntries);
}

function compareEntries(a: PlanScheduleEntry, b: PlanScheduleEntry): number {
  if (a.date && b.date) {
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date);
    }

    return entryRank(a) - entryRank(b);
  }

  if (a.date || b.date) {
    return a.date ? -1 : 1;
  }

  return entryRank(a) - entryRank(b);
}

function entryRank(entry: PlanScheduleEntry): number {
  return entry.kind === "shooting" ? 0 : 1;
}
