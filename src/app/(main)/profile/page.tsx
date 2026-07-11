import { UserRound } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

import { createClient } from "@/shared/supabase/server";

import { SignOutButton } from "./sign-out-button";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const displayName =
    user.user_metadata.full_name ??
    user.user_metadata.name ??
    user.email ??
    "올레스냅 사용자";
  const avatarUrl: string | undefined =
    user.user_metadata.avatar_url ?? user.user_metadata.picture;

  return (
    <div className="flex flex-col gap-6 pb-4">
      <section className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-sm">
        <span className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt=""
              fill
              sizes="56px"
              className="object-cover"
            />
          ) : (
            <UserRound className="size-7" />
          )}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <p className="truncate text-lg font-black">{displayName}</p>
          {user.email && (
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          )}
        </div>
      </section>

      <SignOutButton />
    </div>
  );
}
