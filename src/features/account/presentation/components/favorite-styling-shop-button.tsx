"use client";

import { Heart, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { toggleSavedStylingShopAction } from "../../data/actions/user-wedding.actions";

interface FavoriteStylingShopButtonProps {
  shopId: string;
  initialIsSaved: boolean;
  isAuthenticated: boolean;
  returnPath: string;
}

export function FavoriteStylingShopButton({
  shopId,
  initialIsSaved,
  isAuthenticated,
  returnPath,
}: FavoriteStylingShopButtonProps) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(returnPath)}`);
      return;
    }

    startTransition(async () => {
      const result = await toggleSavedStylingShopAction(shopId);

      if (result.ok && typeof result.isSaved === "boolean") {
        setIsSaved(result.isSaved);
        router.refresh();
      } else if (!result.ok) {
        toast.error(result.message ?? "찜 목록을 변경하지 못했어요.");
      }
    });
  }

  return (
    <button
      type="button"
      aria-pressed={isSaved}
      aria-label={isSaved ? "찜한 샵에서 빼기" : "샵 찜하기"}
      onClick={handleClick}
      disabled={isPending}
      className={`flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 text-sm font-semibold transition-colors disabled:opacity-60 ${
        isSaved
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-secondary-foreground active:bg-muted"
      }`}
    >
      {isPending ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : (
        <Heart className={`size-4 ${isSaved ? "fill-current" : ""}`} />
      )}
      {isSaved ? "찜한 샵" : "샵 찜하기"}
    </button>
  );
}
