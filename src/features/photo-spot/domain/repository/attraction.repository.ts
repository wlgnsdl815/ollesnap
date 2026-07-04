import type { PhotoSpotAttraction } from "../entity/photo-spot.entity";

export interface AttractionRepository {
  findByPlaceName(placeName: string): Promise<PhotoSpotAttraction | null>;
}
