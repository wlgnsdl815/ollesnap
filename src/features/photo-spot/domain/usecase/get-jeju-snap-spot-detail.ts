import type { PhotoSpot } from "../entity/photo-spot.entity";
import { extractPlaceName } from "../extract-place-name";
import type { AttractionRepository } from "../repository/attraction.repository";
import type { PhotoSpotRepository } from "../repository/photo-spot.repository";

export async function getJejuSnapSpotDetail(
  photoSpotRepository: PhotoSpotRepository,
  attractionRepository: AttractionRepository,
  id: string,
): Promise<PhotoSpot | null> {
  const spot = await photoSpotRepository.getById(id);

  if (!spot) {
    return null;
  }

  const placeName = extractPlaceName(spot.location);

  if (!placeName) {
    return spot;
  }

  const attraction = await attractionRepository.findByPlaceName(placeName);

  return attraction ? { ...spot, attraction } : spot;
}
