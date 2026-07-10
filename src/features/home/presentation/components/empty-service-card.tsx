import type { Camera } from "lucide-react";

interface EmptyServiceCardProps {
  icon: typeof Camera;
  label: string;
}

export function EmptyServiceCard({ icon: Icon, label }: EmptyServiceCardProps) {
  return (
    <article className="flex h-44 w-[18.75rem] shrink-0 snap-start flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <span className="w-fit rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
            {label}
          </span>
          <div className="flex flex-col gap-2 pt-1">
            <span className="h-4 w-36 rounded-full bg-muted" />
            <span className="h-3 w-48 rounded-full bg-muted" />
          </div>
        </div>
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="size-6" />
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <span className="h-8 w-20 rounded-full bg-muted" />
          <span className="h-8 w-24 rounded-full bg-muted" />
        </div>
        <p className="text-xs font-medium text-muted-foreground">
          업체 데이터 연결 후 표시됩니다.
        </p>
      </div>
    </article>
  );
}
