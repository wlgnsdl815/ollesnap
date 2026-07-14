import { NextResponse, type NextRequest } from "next/server";

import {
  generateProfileName,
  getProfileName,
} from "@/features/account/domain/usecase/profile-name.usecase";
import { createClient } from "@/shared/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getSafeNextPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      if (data.user && !getProfileName(data.user.user_metadata)) {
        await supabase.auth.updateUser({
          data: { full_name: generateProfileName() },
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}

function getSafeNextPath(nextPath: string | null) {
  if (nextPath?.startsWith("/") && !nextPath.startsWith("//")) {
    return nextPath;
  }

  return "/";
}
