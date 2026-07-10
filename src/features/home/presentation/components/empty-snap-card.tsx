import { Star, UserRound } from "lucide-react";

export function EmptySnapCard() {
  return (
    <article className="flex h-48 w-[18.75rem] shrink-0 snap-start flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
            <UserRound className="size-8" />
          </span>
          <div className="flex min-w-0 flex-col gap-2">
            <span className="h-4 w-28 rounded-full bg-muted" />
            <span className="h-3 w-20 rounded-full bg-muted" />
          </div>
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Star className="size-5" />
        </span>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-secondary-foreground">
            포트폴리오
          </span>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-secondary-foreground">
            예약 일정
          </span>
        </div>
        <p className="text-xs font-medium text-muted-foreground">
          스냅 데이터 연결 후 표시됩니다.
        </p>
      </div>
    </article>
  );
}
