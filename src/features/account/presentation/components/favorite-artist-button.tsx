"use client";

import { ArrowRight, Heart, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { toggleSavedArtistAction } from "../../data/actions/user-wedding.actions";

interface FavoriteArtistButtonProps {
  artistId: string;
  initialIsSaved: boolean;
  isAuthenticated: boolean;
  returnPath: string;
}

export function FavoriteArtistButton({
  artistId,
  initialIsSaved,
  isAuthenticated,
  returnPath,
}: FavoriteArtistButtonProps) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [savedCount, setSavedCount] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const showCompareCta = isSaved && savedCount !== null && savedCount >= 2;

  function handleClick() {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(returnPath)}`);
      return;
    }

    startTransition(async () => {
      const result = await toggleSavedArtistAction(artistId);

      if (result.ok && typeof result.isSaved === "boolean") {
        setIsSaved(result.isSaved);
        setSavedCount(result.savedCount ?? null);
        router.refresh();
      }
    });
  }

  return (
    <>
      <button
        type="button"
        aria-pressed={isSaved}
        aria-label={isSaved ? "찜한 작가에서 빼기" : "작가 찜하기"}
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
        {isSaved ? "찜한 작가" : "작가 찜하기"}
      </button>
      {showCompareCta ? (
        <Link
          href="/artists/compare"
          className="flex min-h-11 items-center justify-center gap-1 rounded-md bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur active:bg-white/20"
        >
          찜한 작가 {savedCount}명 나란히 비교하기
          <ArrowRight className="size-4" />
        </Link>
      ) : null}
    </>
  );
}
