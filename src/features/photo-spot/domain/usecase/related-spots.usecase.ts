import type {
  RelatedSpot,
  RelatedSpotCategory,
} from "../entity/related-spot.entity";

export interface RelatedSpotGroups {
  attractions: RelatedSpot[];
  foods: RelatedSpot[];
  stays: RelatedSpot[];
}

interface GroupLimits {
  attractionLimit?: number;
  foodLimit?: number;
  stayLimit?: number;
}

export function groupRelatedSpots(
  spots: RelatedSpot[],
  { attractionLimit = 4, foodLimit = 3, stayLimit = 2 }: GroupLimits = {},
): RelatedSpotGroups {
  return {
    attractions: pickByCategory(spots, "attraction", attractionLimit),
    foods: pickByCategory(spots, "food", foodLimit),
    stays: pickByCategory(spots, "stay", stayLimit),
  };
}

export function hasAnyRelatedSpot(groups: RelatedSpotGroups): boolean {
  return (
    groups.attractions.length > 0 ||
    groups.foods.length > 0 ||
    groups.stays.length > 0
  );
}

export interface CourseSuggestionGroup {
  baseTitle: string;
  spots: RelatedSpot[];
}

interface CourseSuggestionBase {
  title: string;
  spots: RelatedSpot[];
}

// 일정에 담은 장소마다 "함께 많이 찾는 곳"을 뽑아 코스 후보를 만든다.
// 이미 일정에 있는 장소와 앞선 그룹에서 추천한 장소는 제외해 중복을 막는다.
export function buildCourseSuggestions(
  bases: CourseSuggestionBase[],
  excludeTitles: string[],
  limitPerBase = 4,
): CourseSuggestionGroup[] {
  const usedNames = new Set(excludeTitles.map(normalizeName));
  const groups: CourseSuggestionGroup[] = [];

  for (const base of bases) {
    usedNames.add(normalizeName(base.title));
  }

  for (const base of bases) {
    const spots: RelatedSpot[] = [];

    for (const spot of base.spots) {
      if (spot.category === "stay") {
        continue;
      }

      const name = normalizeName(spot.name);

      if (usedNames.has(name)) {
        continue;
      }

      usedNames.add(name);
      spots.push(spot);

      if (spots.length >= limitPerBase) {
        break;
      }
    }

    if (spots.length > 0) {
      groups.push({ baseTitle: base.title, spots });
    }
  }

  return groups;
}

function pickByCategory(
  spots: RelatedSpot[],
  category: RelatedSpotCategory,
  limit: number,
): RelatedSpot[] {
  return spots.filter((spot) => spot.category === category).slice(0, limit);
}

function normalizeName(name: string): string {
  return name.replaceAll(/\s/g, "").toLowerCase();
}
