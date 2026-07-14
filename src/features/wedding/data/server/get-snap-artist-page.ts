import { weddingCatalogMock } from "../mock/wedding-catalog.mock";
import type {
  SnapArtistPage,
  SnapScene,
  WeddingTone,
} from "../../domain/entity/wedding-catalog.entity";
import { filterSnapArtists } from "../../domain/usecase/wedding-catalog.usecase";

const SNAP_ARTISTS_PAGE_SIZE = 10;

export interface GetSnapArtistPageInput {
  page: number;
  scene?: SnapScene;
  tone?: WeddingTone;
}

export function getSnapArtistPage({
  page,
  scene,
  tone,
}: GetSnapArtistPageInput): SnapArtistPage {
  const normalizedPage = Math.max(1, Math.floor(page));
  const artists = filterSnapArtists(weddingCatalogMock.artists, { scene, tone });
  const startIndex = (normalizedPage - 1) * SNAP_ARTISTS_PAGE_SIZE;
  const paginatedArtists = artists.slice(
    startIndex,
    startIndex + SNAP_ARTISTS_PAGE_SIZE,
  );
  const hasMore = startIndex + SNAP_ARTISTS_PAGE_SIZE < artists.length;

  return {
    artists: paginatedArtists,
    totalCount: artists.length,
    hasMore,
    nextPage: hasMore ? normalizedPage + 1 : null,
  };
}
