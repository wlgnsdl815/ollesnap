import type {
  PhotoSpotPage,
  PhotoSpotRepository,
} from "../repository/photo-spot.repository";

export const SNAP_SPOTS_DEFAULT_PAGE_SIZE = 10;

export async function getJejuSnapSpotsPage(
  photoSpotRepository: PhotoSpotRepository,
  pageNo: number,
  pageSize: number = SNAP_SPOTS_DEFAULT_PAGE_SIZE,
): Promise<PhotoSpotPage> {
  return photoSpotRepository.getPage(pageNo, pageSize);
}
