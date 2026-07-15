"use client";

import { Heart, LoaderCircle } from "lucide-react";
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
        router.refresh();
      }
    });
  }

  return (
    <button
      type="button"
      aria-pressed={isSaved}
      onClick={handleClick}
      disabled={isPending}
      className={`flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold disabled:opacity-60 ${
        isSaved
          ? "bg-primary text-primary-foreground"
          : "bg-primary/10 text-primary active:bg-primary/20"
      }`}
    >
      {isPending ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : (
        <Heart className={`size-4 ${isSaved ? "fill-current" : ""}`} />
      )}
      {isSaved ? "내 여행 일정에서 빼기" : "내 여행 일정에 담기"}
    </button>
  );
}
