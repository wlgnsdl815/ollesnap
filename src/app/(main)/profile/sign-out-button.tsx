"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/shared/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-card text-sm font-bold text-destructive active:bg-muted disabled:opacity-50"
    >
      <LogOut className="size-4" />
      로그아웃
    </button>
  );
}
