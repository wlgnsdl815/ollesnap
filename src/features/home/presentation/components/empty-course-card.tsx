import type { Camera } from "lucide-react";

interface EmptyCourseCardProps {
  icon: typeof Camera;
  label: string;
  title: string;
}

export function EmptyCourseCard({
  icon: Icon,
  label,
  title,
}: EmptyCourseCardProps) {
  return (
    <article className="flex h-36 w-[11.25rem] shrink-0 snap-start flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-secondary-foreground">
          {label}
        </span>
        <Icon className="size-5 text-primary" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-lg font-black">{title}</p>
        <div className="flex flex-col gap-1.5">
          <span className="h-2.5 w-full rounded-full bg-muted" />
          <span className="h-2.5 w-2/3 rounded-full bg-muted" />
        </div>
      </div>
    </article>
  );
}
