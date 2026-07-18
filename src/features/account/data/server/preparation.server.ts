import "server-only";

import { getServerUser } from "@/shared/supabase/get-server-user";
import { createClient } from "@/shared/supabase/server";

import type { PreparationItemState } from "../../domain/preparation-checklist";

interface PreparationItemRow {
  item_id: string;
  label: string;
  is_checked: boolean;
  is_custom: boolean;
}

export async function getPreparationItemStates(): Promise<
  PreparationItemState[]
> {
  const user = await getServerUser();

  if (!user) {
    return [];
  }

  const supabase = await createClient();
  const { data: plan } = await supabase
    .from("snap_plans")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!plan) {
    return [];
  }

  const { data: rows } = await supabase
    .from("preparation_items")
    .select("item_id, label, is_checked, is_custom")
    .eq("plan_id", plan.id)
    .order("created_at", { ascending: true });

  return (rows ?? []).map((row) => mapPreparationItem(row as PreparationItemRow));
}

function mapPreparationItem(row: PreparationItemRow): PreparationItemState {
  return {
    itemId: row.item_id,
    label: row.label,
    isChecked: row.is_checked,
    isCustom: row.is_custom,
  };
}
