import type {
  SnapArtist,
  WeddingCatalog,
} from "../entity/wedding-catalog.entity";
import {
  formatPriceFrom,
  getSceneLabel,
  getToneLabel,
} from "./wedding-catalog.usecase";

export interface ArtistComparisonValue {
  lines: string[];
  isBest: boolean;
}

export interface ArtistComparisonRow {
  label: string;
  values: ArtistComparisonValue[];
}

export const COMPARISON_MINIMUM = 2;
export const COMPARISON_MAXIMUM = 3;

/**
 * 찜한 작가들을 같은 기준으로 견주는 행 목록.
 * 의상·보정본은 각 작가의 기본(첫 번째) 상품 기준이다.
 */
export function buildArtistComparisonRows(
  artists: SnapArtist[],
  catalog: WeddingCatalog,
): ArtistComparisonRow[] {
  return [
    rankedRow(
      "시작가",
      artists,
      (artist) => artist.priceFrom,
      (artist) => [formatPriceFrom(artist.priceFrom)],
      "lowest",
    ),
    plainRow("촬영 시간", artists, (artist) => [`${artist.durationHours}시간`]),
    plainRow("의상", artists, (artist) => {
      const basePackage = artist.packages[0];

      return [
        `${basePackage.outfitCountMinimum}~${basePackage.outfitCountMaximum}벌`,
      ];
    }),
    rankedRow(
      "선택 보정본",
      artists,
      (artist) => artist.packages[0].selectedRetouchedCount,
      (artist) => [`${artist.packages[0].selectedRetouchedCount}장`],
      "highest",
    ),
    rankedRow(
      "보정본 전달",
      artists,
      (artist) => artist.deliveryDays,
      (artist) => [`촬영 뒤 ${artist.deliveryDays}일`],
      "lowest",
    ),
    rankedRow(
      "예약 마감",
      artists,
      (artist) => artist.reservationLeadDays,
      (artist) => [`${artist.reservationLeadDays}일 전까지`],
      "lowest",
    ),
    plainRow("촬영 씬", artists, (artist) =>
      artist.scenes.map((scene) => getSceneLabel(catalog, scene)),
    ),
    plainRow("사진 톤", artists, (artist) =>
      artist.tones.map((tone) => getToneLabel(catalog, tone)),
    ),
  ];
}

function plainRow(
  label: string,
  artists: SnapArtist[],
  toLines: (artist: SnapArtist) => string[],
): ArtistComparisonRow {
  return {
    label,
    values: artists.map((artist) => ({ lines: toLines(artist), isBest: false })),
  };
}

function rankedRow(
  label: string,
  artists: SnapArtist[],
  toNumber: (artist: SnapArtist) => number,
  toLines: (artist: SnapArtist) => string[],
  betterWhen: "lowest" | "highest",
): ArtistComparisonRow {
  const numbers = artists.map(toNumber);
  const bestNumber =
    betterWhen === "lowest" ? Math.min(...numbers) : Math.max(...numbers);
  // 모든 작가가 같은 조건이면 굳이 강조하지 않는다.
  const hasDifference = numbers.some((number) => number !== bestNumber);

  return {
    label,
    values: artists.map((artist, index) => ({
      lines: toLines(artist),
      isBest: hasDifference && numbers[index] === bestNumber,
    })),
  };
}
