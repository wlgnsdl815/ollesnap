import type { PhotoSpot } from "../../domain/entity/photo-spot.entity";
import type { PhotoAwardApiItem } from "../dto/photo-award.dto";

const MAX_KEYWORDS_PER_SPOT = 2;
const GENERIC_KEYWORD_PATTERNS = ["관광공모전", "특별한 순간"];

export function isDisplayablePhotoAwardItem(item: PhotoAwardApiItem): boolean {
  return Boolean(item.koTitle && item.thumbImage);
}

export function toPhotoSpot(item: PhotoAwardApiItem): PhotoSpot {
  const allKeywords = filterKeywords(
    item.koKeyWord,
    item.koTitle,
    item.koFilmst,
  );

  return {
    id: item.contentId,
    title: item.koTitle,
    location: item.koFilmst,
    filmedAt: formatFilmDay(item.filmDay),
    photographer: item.koCmanNm,
    award: item.koWnprzDiz,
    keywords: allKeywords.slice(0, MAX_KEYWORDS_PER_SPOT),
    allKeywords,
    imageUrl: item.thumbImage ?? "",
    fullImageUrl: item.orgImage ?? item.thumbImage ?? "",
  };
}

function formatFilmDay(filmDay: string): string {
  if (!/^\d{6}$/.test(filmDay)) {
    return filmDay;
  }

  return `${filmDay.slice(0, 4)}.${filmDay.slice(4, 6)}`;
}

function filterKeywords(
  koKeyword: string,
  title: string,
  location: string,
): string[] {
  return koKeyword
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(
      (keyword) =>
        keyword.length > 0 &&
        keyword !== title &&
        !location.includes(keyword) &&
        !GENERIC_KEYWORD_PATTERNS.some((pattern) => keyword.includes(pattern)),
    );
}
