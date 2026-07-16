"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  /** 히스토리가 없을 때 이동할 폴백 경로. */
  fallbackHref: string;
}

export function BackButton({ fallbackHref }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label="뒤로 가기"
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push(fallbackHref);
        }
      }}
      className="-ml-2 flex size-11 shrink-0 items-center justify-center rounded-full text-foreground active:bg-muted"
    >
      <ChevronLeft className="size-6" />
    </button>
  );
}
