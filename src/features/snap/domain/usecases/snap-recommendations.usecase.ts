import type {
  CrowdTone,
  PlannerSlot,
  SnapSpot,
} from "@/features/snap/domain/entities/snap.entity";
import type { TourismCrowdAttractionSummary } from "@/features/tourism-crowd/domain/entities/tourism-crowd.entity";

export function getCrowdTone(crowdLevel: number): CrowdTone {
  if (crowdLevel <= 35) {
    return "low";
  }

  if (crowdLevel <= 65) {
    return "medium";
  }

  return "high";
}

export function getCrowdLabel(crowdLevel: number): string {
  const tone = getCrowdTone(crowdLevel);

  if (tone === "low") {
    return "한산";
  }

  if (tone === "medium") {
    return "보통";
  }

  return "혼잡";
}

export function getBestPlannerSlot(slots: PlannerSlot[]): PlannerSlot {
  return slots.reduce((bestSlot, slot) => {
    const bestScore = bestSlot.crowdLevel;
    const currentScore = slot.crowdLevel;

    return currentScore < bestScore ? slot : bestSlot;
  }, slots[0]);
}

export function applyTourismCrowdToSnapSpots(
  spots: SnapSpot[],
  summaries: TourismCrowdAttractionSummary[],
): SnapSpot[] {
  const summaryByAttractionName = new Map(
    summaries.map((summary) => [
      normalizeAttractionName(summary.attractionName),
      summary,
    ]),
  );

  return spots.map((spot) => {
    const summary = summaryByAttractionName.get(
      normalizeAttractionName(spot.name),
    );

    if (!summary) {
      return spot;
    }

    return {
      ...spot,
      crowdLevel: summary.averageRate,
    };
  });
}

function normalizeAttractionName(name: string): string {
  return name.replace(/\s/g, "").toLowerCase();
}
