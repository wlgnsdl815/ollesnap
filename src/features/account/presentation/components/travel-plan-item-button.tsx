"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ChevronRight, Heart, LoaderCircle, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { toggleTravelPlanItemAction } from "../../data/actions/user-wedding.actions";
import { TRAVEL_PLAN_KEYS_QUERY_KEY } from "../hooks/use-saved-travel-plan-keys";

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
  const queryClient = useQueryClient();
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
        // 목록 화면의 "일정에 담음" 배지가 바로 반영되도록 캐시를 비운다.
        void queryClient.invalidateQueries({
          queryKey: TRAVEL_PLAN_KEYS_QUERY_KEY,
        });
        router.refresh();
      } else if (!result.ok) {
        toast.error(result.message ?? "일정을 변경하지 못했어요.");
      }
    });
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-30">
      <div className="mx-auto flex w-full max-w-md flex-col gap-2 px-4 py-3 sm:max-w-2xl lg:max-w-4xl">
        <button
          type="button"
          aria-pressed={isSaved}
          onClick={handleClick}
          disabled={isPending}
          className={`pointer-events-auto flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold shadow-lg disabled:opacity-60 ${
            isSaved
              ? "border border-border bg-card text-primary active:bg-muted"
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
            className="pointer-events-auto flex min-h-11 items-center justify-center gap-1 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-secondary-foreground shadow-lg active:bg-muted"
          >
            제주 일정에서 확인하기
            <ChevronRight className="size-4" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
