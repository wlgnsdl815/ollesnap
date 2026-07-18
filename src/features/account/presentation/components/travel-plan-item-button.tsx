"use client";

import { ChevronRight, Heart, LoaderCircle, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { toggleTravelPlanItemAction } from "../../data/actions/user-wedding.actions";

interface TravelPlanItemButtonProps {
  spotId: string;
  kind: "sight" | "food";
  title: string;
  location: string;
  imageUrl: string;
  initialIsSaved: boolean;
  isAuthenticated: boolean;
  returnPath: string;
}

export function TravelPlanItemButton({
  spotId,
  kind,
  title,
  location,
  imageUrl,
  initialIsSaved,
  isAuthenticated,
  returnPath,
}: TravelPlanItemButtonProps) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [justSaved, setJustSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(returnPath)}`);
      return;
    }

    startTransition(async () => {
      const result = await toggleTravelPlanItemAction({
        spotId,
        kind,
        title,
        location,
        imageUrl,
      });

      if (result.ok && typeof result.isSaved === "boolean") {
        setIsSaved(result.isSaved);
        setJustSaved(result.isSaved);
        router.refresh();
      }
    });
  }

  return (
    <div className="fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-30 border-t border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex w-full max-w-md flex-col gap-2 px-4 py-3 sm:max-w-2xl lg:max-w-4xl">
        <button
          type="button"
          aria-pressed={isSaved}
          onClick={handleClick}
          disabled={isPending}
          className={`flex min-h-12 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold disabled:opacity-60 ${
            isSaved
              ? "bg-primary/10 text-primary active:bg-primary/20"
              : "bg-primary text-primary-foreground active:bg-primary/90"
          }`}
        >
          {isPending ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : !isAuthenticated ? (
            <LogIn className="size-4" />
          ) : (
            <Heart className={`size-4 ${isSaved ? "fill-current" : ""}`} />
          )}
          {!isAuthenticated
            ? "로그인하고 일정에 담기"
            : isSaved
              ? "내 여행 일정에서 빼기"
              : "내 여행 일정에 담기"}
        </button>
        {justSaved ? (
          <Link
            href="/planner"
            className="flex min-h-11 items-center justify-center gap-1 rounded-md bg-secondary px-4 text-sm font-semibold text-secondary-foreground active:bg-muted"
          >
            제주 일정에서 확인하기
            <ChevronRight className="size-4" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
