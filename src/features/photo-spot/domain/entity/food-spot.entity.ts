export interface FoodSpot {
  id: string;
  title: string;
  address: string;
  imageUrl: string;
  tel?: string;
  overview?: string;
  mapx?: string;
  mapy?: string;
}

export interface FoodSpotPage {
  spots: FoodSpot[];
  totalCount: number;
  hasMore: boolean;
}
