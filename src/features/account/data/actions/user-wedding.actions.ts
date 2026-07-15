"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/shared/supabase/server";

export interface ActionResult {
  ok: boolean;
  message?: string;
}

export interface ToggleSavedArtistResult extends ActionResult {
  isSaved?: boolean;
}

export interface SaveSnapPlanInput {
  artistId: string;
  packageId: string;
  stylingShopId: string;
  stylingProductId: string;
  stylingOptionIds: string[];
  shootingDate: string | null;
  stayStartDate: string | null;
  stayEndDate: string | null;
}

export interface ToggleTravelPlanItemInput {
  spotId: string;
  title: string;
  location: string;
  imageUrl: string;
}

export interface ToggleTravelPlanItemResult extends ActionResult {
  isSaved?: boolean;
}

export async function updateProfileNameAction(
  profileName: string,
): Promise<ActionResult> {
  const normalizedName = profileName.trim();

  if (!normalizedName) {
    return { ok: false, message: "이름을 입력해주세요." };
  }

  if (normalizedName.length > 30) {
    return { ok: false, message: "이름은 30자 이내로 입력해주세요." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "로그인이 필요해요." };
  }

  const { error } = await supabase.auth.updateUser({
    data: { full_name: normalizedName },
  });

  if (error) {
    return { ok: false, message: "프로필을 수정하지 못했어요." };
  }

  revalidatePath("/profile");
  return { ok: true, message: "프로필 이름을 저장했어요." };
}

export async function toggleSavedArtistAction(
  artistId: string,
): Promise<ToggleSavedArtistResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "로그인이 필요해요." };
  }

  const { data: savedArtist, error: findError } = await supabase
    .from("saved_artists")
    .select("artist_id")
    .eq("user_id", user.id)
    .eq("artist_id", artistId)
    .maybeSingle();

  if (findError) {
    return { ok: false, message: "찜 목록을 불러오지 못했어요." };
  }

  if (savedArtist) {
    const { error } = await supabase
      .from("saved_artists")
      .delete()
      .eq("user_id", user.id)
      .eq("artist_id", artistId);

    if (error) {
      return { ok: false, message: "찜을 해제하지 못했어요." };
    }

    revalidatePath("/artists");
    revalidatePath(`/artists/${artistId}`);
    revalidatePath("/profile");
    return { ok: true, isSaved: false };
  }

  const { error } = await supabase.from("saved_artists").insert({
    user_id: user.id,
    artist_id: artistId,
  });

  if (error) {
    return { ok: false, message: "작가를 찜하지 못했어요." };
  }

  revalidatePath("/artists");
  revalidatePath(`/artists/${artistId}`);
  revalidatePath("/profile");
  return { ok: true, isSaved: true };
}

export async function saveSnapPlanAction(
  input: SaveSnapPlanInput,
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "로그인이 필요해요." };
  }

  if (
    input.stayStartDate &&
    input.stayEndDate &&
    input.stayStartDate > input.stayEndDate
  ) {
    return { ok: false, message: "출발일은 귀가일보다 늦을 수 없어요." };
  }

  const { error } = await supabase.from("snap_plans").upsert(
    {
      user_id: user.id,
      artist_id: input.artistId,
      package_id: input.packageId,
      styling_shop_id: input.stylingShopId,
      styling_product_id: input.stylingProductId,
      styling_option_ids: input.stylingOptionIds,
      dress_id: null,
      makeup_id: null,
      shooting_date: input.shootingDate,
      stay_start_date: input.stayStartDate,
      stay_end_date: input.stayEndDate,
    },
    { onConflict: "user_id" },
  );

  if (error) {
    return { ok: false, message: "제주 일정을 저장하지 못했어요." };
  }

  revalidatePath("/planner");
  revalidatePath("/profile");
  return { ok: true };
}

export async function toggleTravelPlanItemAction(
  input: ToggleTravelPlanItemInput,
): Promise<ToggleTravelPlanItemResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "로그인이 필요해요." };
  }

  const { data: plan, error: planError } = await supabase
    .from("snap_plans")
    .upsert({ user_id: user.id }, { onConflict: "user_id" })
    .select("id")
    .single();

  if (planError || !plan) {
    return { ok: false, message: "여행 일정을 준비하지 못했어요." };
  }

  const { data: savedItem, error: findError } = await supabase
    .from("travel_plan_items")
    .select("id")
    .eq("plan_id", plan.id)
    .eq("spot_id", input.spotId)
    .maybeSingle();

  if (findError) {
    return { ok: false, message: "여행 일정을 불러오지 못했어요." };
  }

  if (savedItem) {
    const { error } = await supabase
      .from("travel_plan_items")
      .delete()
      .eq("id", savedItem.id);

    if (error) {
      return { ok: false, message: "여행 목록에서 빼지 못했어요." };
    }

    revalidateTravelPaths(input.spotId);
    return { ok: true, isSaved: false };
  }

  const { error } = await supabase.from("travel_plan_items").insert({
    plan_id: plan.id,
    spot_id: input.spotId,
    spot_title: input.title,
    spot_location: input.location,
    spot_image_url: input.imageUrl,
  });

  if (error) {
    return { ok: false, message: "여행 목록에 담지 못했어요." };
  }

  revalidateTravelPaths(input.spotId);
  return { ok: true, isSaved: true };
}

function revalidateTravelPaths(spotId: string) {
  revalidatePath("/spots");
  revalidatePath(`/spots/${spotId}`);
  revalidatePath("/planner");
  revalidatePath("/profile");
}
