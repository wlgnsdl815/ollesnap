import type { PhotoSpot } from "../entity/photo-spot.entity";
import type { PhotoSpotRepository } from "../repository/photo-spot.repository";

export async function getJejuSnapSpots(
  photoSpotRepository: PhotoSpotRepository,
  limit = 6,
): Promise<PhotoSpot[]> {
  const { spots } = await photoSpotRepository.getPage(1, limit);

  return spots;
}
