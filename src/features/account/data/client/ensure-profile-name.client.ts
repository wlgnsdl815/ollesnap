"use client";

import type { User } from "@supabase/supabase-js";

import {
  generateProfileName,
  getProfileName,
} from "../../domain/usecase/profile-name.usecase";
import { createClient } from "@/shared/supabase/client";

export async function ensureClientProfileName(user: User): Promise<void> {
  if (getProfileName(user.user_metadata)) {
    return;
  }

  const supabase = createClient();
  await supabase.auth.updateUser({
    data: { full_name: generateProfileName() },
  });
}
