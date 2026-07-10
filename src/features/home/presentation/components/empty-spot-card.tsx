import { MapPin } from "lucide-react";

export function EmptySpotCard() {
  return (
    <article className="relative flex h-52 w-[18.75rem] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-br from-secondary via-card to-[#d8e6e5]" />
      <div className="absolute top-4 right-4 flex size-11 items-center justify-center rounded-full bg-white/90 text-muted-foreground">
        <MapPin className="size-5" />
      </div>
      <div className="relative flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-16 rounded-full bg-muted" />
          <span className="h-2.5 w-10 rounded-full bg-muted" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="h-4 w-36 rounded-full bg-muted" />
          <span className="h-3 w-48 rounded-full bg-muted" />
          <span className="h-3 w-32 rounded-full bg-muted" />
        </div>
        <p className="text-xs font-medium text-muted-foreground">
          관광 데이터 연결 후 표시됩니다.
        </p>
      </div>
    </article>
  );
}
