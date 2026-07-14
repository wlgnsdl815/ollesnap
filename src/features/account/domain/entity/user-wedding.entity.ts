export interface SavedSnapPlan {
  id: string;
  artistId: string | null;
  packageId: string | null;
  dressId: string | null;
  makeupId: string | null;
  shootingDate: string | null;
  stayStartDate: string | null;
  stayEndDate: string | null;
}

export interface SavedTravelPlanItem {
  id: string;
  spotId: string;
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
