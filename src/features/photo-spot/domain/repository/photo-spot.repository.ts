import type { PhotoSpot } from "../entity/photo-spot.entity";

export interface PhotoSpotPage {
  spots: PhotoSpot[];
  totalCount: number;
  hasMore: boolean;
}

export interface PhotoSpotRepository {
  getPage(pageNo: number, pageSize: number): Promise<PhotoSpotPage>;
  getById(id: string): Promise<PhotoSpot | null>;
}
