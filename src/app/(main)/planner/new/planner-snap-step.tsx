"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function PlannerSnapStep() {
  const [photographerName, setPhotographerName] = useState("");

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-base font-black">정해둔 스냅작가가 있나요?</p>
          <p className="text-sm leading-6 text-muted-foreground">
            이미 마음에 둔 작가님이나 스튜디오가 있다면 먼저 입력해주세요.
          </p>
        </div>

        <label className="flex min-h-14 items-center rounded-2xl border border-border bg-card px-4">
          <input
            type="text"
            value={photographerName}
            onChange={(event) => setPhotographerName(event.target.value)}
            placeholder="작가명 또는 스튜디오명 입력"
            className="min-w-0 flex-1 bg-transparent text-base font-bold outline-none placeholder:text-muted-foreground"
          />
        </label>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-black">아직 스냅작가를 못 정했나요?</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            인기 스냅작가와 포트폴리오를 모아보고, 일정에 맞는 작가님을
            비교해볼 수 있어요.
          </p>
        </div>
        <Link
          href="/planner/snap"
          className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-black text-primary-foreground active:bg-primary/90"
        >
          스냅작가 둘러보기
          <ChevronRight className="size-4" />
        </Link>
      </section>
    </div>
  );
}
