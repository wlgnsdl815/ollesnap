export interface SavedSnapPlan {
  id: string;
  artistId: string | null;
  packageId: string | null;
  stylingShopId: string | null;
  stylingProductId: string | null;
  stylingOptionIds: string[];
  shootingDate: string | null;
  stayStartDate: string | null;
  stayEndDate: string | null;
}

export type SavedTravelPlanItemKind = "sight" | "food";

export interface SavedTravelPlanItem {
  id: string;
  spotId: string;
  kind: SavedTravelPlanItemKind;
  title: string;
  location: string | null;
  imageUrl: string | null;
  plannedDate: string | null;
}

export interface UserWeddingState {
  isAuthenticated: boolean;
  savedArtistIds: string[];
  snapPlan: SavedSnapPlan | null;
  travelPlanItems: SavedTravelPlanItem[];
}
