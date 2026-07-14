import "server-only";

import type {
  SavedSnapPlan,
  SavedTravelPlanItem,
  UserWeddingState,
} from "../../domain/entity/user-wedding.entity";
import { createClient } from "@/shared/supabase/server";

interface SnapPlanRow {
  id: string;
  artist_id: string | null;
  package_id: string | null;
  dress_id: string | null;
  makeup_id: string | null;
  shooting_date: string | null;
  stay_start_date: string | null;
  stay_end_date: string | null;
}

interface TravelPlanItemRow {
  id: string;
  spot_id: string;
  spot_title: string;
  spot_location: string | null;
  spot_image_url: string | null;
  planned_date: string | null;
}

export async function getUserWeddingState(): Promise<UserWeddingState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return createEmptyUserWeddingState();
  }

  const [{ data: savedArtists }, { data: snapPlan }] = await Promise.all([
    supabase
      .from("saved_artists")
      .select("artist_id")
      .eq("user_id", user.id),
    supabase
      .from("snap_plans")
      .select(
        "id, artist_id, package_id, dress_id, makeup_id, shooting_date, stay_start_date, stay_end_date",
      )
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);
  const savedArtistIds = (savedArtists ?? []).map((item) => item.artist_id);
  const mappedSnapPlan = snapPlan
    ? mapSnapPlan(snapPlan as SnapPlanRow)
    : null;

  if (!mappedSnapPlan) {
    return {
      isAuthenticated: true,
      savedArtistIds,
      snapPlan: null,
      travelPlanItems: [],
    };
  }

  const { data: travelPlanItems } = await supabase
    .from("travel_plan_items")
    .select("id, spot_id, spot_title, spot_location, spot_image_url, planned_date")
    .eq("plan_id", mappedSnapPlan.id)
    .order("created_at", { ascending: false });

  return {
    isAuthenticated: true,
    savedArtistIds,
    snapPlan: mappedSnapPlan,
    travelPlanItems: (travelPlanItems ?? []).map((item) =>
      mapTravelPlanItem(item as TravelPlanItemRow),
    ),
  };
}

function createEmptyUserWeddingState(): UserWeddingState {
  return {
    isAuthenticated: false,
    savedArtistIds: [],
    snapPlan: null,
    travelPlanItems: [],
  };
}

function mapSnapPlan(row: SnapPlanRow): SavedSnapPlan {
  return {
    id: row.id,
    artistId: row.artist_id,
    packageId: row.package_id,
    dressId: row.dress_id,
    makeupId: row.makeup_id,
    shootingDate: row.shooting_date,
    stayStartDate: row.stay_start_date,
    stayEndDate: row.stay_end_date,
  };
}

function mapTravelPlanItem(row: TravelPlanItemRow): SavedTravelPlanItem {
  return {
    id: row.id,
    spotId: row.spot_id,
    title: row.spot_title,
    location: row.spot_location,
    imageUrl: row.spot_image_url,
    plannedDate: row.planned_date,
  };
}
