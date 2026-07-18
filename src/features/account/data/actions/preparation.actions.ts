"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/shared/supabase/server";

import type { ActionResult } from "./user-wedding.actions";

export interface AddCustomPreparationItemResult extends ActionResult {
  itemId?: string;
}

export async function setPreparationItemAction(input: {
  itemId: string;
  label: string;
  isChecked: boolean;
  isCustom: boolean;
}): Promise<ActionResult> {
  const { supabase, planId, errorResult } = await resolvePlan();

  if (errorResult) {
    return errorResult;
  }

  const { error } = await supabase.from("preparation_items").upsert(
    {
      plan_id: planId,
      item_id: input.itemId,
      label: input.label,
      is_checked: input.isChecked,
      is_custom: input.isCustom,
    },
    { onConflict: "plan_id,item_id" },
  );

  if (error) {
    return { ok: false, message: "준비물을 저장하지 못했어요." };
  }

  revalidatePreparationPaths();
  return { ok: true };
}

export async function addCustomPreparationItemAction(
  label: string,
): Promise<AddCustomPreparationItemResult> {
  const normalizedLabel = label.trim();

  if (!normalizedLabel) {
    return { ok: false, message: "준비물 이름을 입력해주세요." };
  }

  if (normalizedLabel.length > 40) {
    return { ok: false, message: "준비물 이름은 40자 이내로 입력해주세요." };
  }

  const { supabase, planId, errorResult } = await resolvePlan();

  if (errorResult) {
    return errorResult;
  }

  const itemId = `custom-${crypto.randomUUID()}`;
  const { error } = await supabase.from("preparation_items").insert({
    plan_id: planId,
    item_id: itemId,
    label: normalizedLabel,
    is_checked: false,
    is_custom: true,
  });

  if (error) {
    return { ok: false, message: "준비물을 추가하지 못했어요." };
  }

  revalidatePreparationPaths();
  return { ok: true, itemId };
}

export async function removeCustomPreparationItemAction(
  itemId: string,
): Promise<ActionResult> {
  const { supabase, planId, errorResult } = await resolvePlan();

  if (errorResult) {
    return errorResult;
  }

  const { error } = await supabase
    .from("preparation_items")
    .delete()
    .eq("plan_id", planId)
    .eq("item_id", itemId)
    .eq("is_custom", true);

  if (error) {
    return { ok: false, message: "준비물을 빼지 못했어요." };
  }

  revalidatePreparationPaths();
  return { ok: true };
}

async function resolvePlan() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      supabase,
      planId: null,
      errorResult: { ok: false, message: "로그인이 필요해요." },
    } as const;
  }

  const { data: plan, error } = await supabase
    .from("snap_plans")
    .upsert({ user_id: user.id }, { onConflict: "user_id" })
    .select("id")
    .single();

  if (error || !plan) {
    return {
      supabase,
      planId: null,
      errorResult: { ok: false, message: "준비물 목록을 불러오지 못했어요." },
    } as const;
  }

  return { supabase, planId: plan.id, errorResult: null } as const;
}

function revalidatePreparationPaths() {
  revalidatePath("/planner");
  revalidatePath("/profile");
}
