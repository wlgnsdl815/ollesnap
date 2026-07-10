import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

interface DataRailSectionProps {
  title: string;
  actionLabel: string;
  href: string;
  children: ReactNode;
}

export function DataRailSection({
  title,
  actionLabel,
  href,
  children,
}: DataRailSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-black">{title}</h2>
        <Link
          href={href}
          className="flex min-h-11 shrink-0 items-center gap-1 text-sm font-semibold text-muted-foreground"
        >
          {actionLabel}
          <ChevronRight className="size-4" />
        </Link>
      </div>
      <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex snap-x snap-mandatory gap-3 pb-1">{children}</div>
      </div>
    </section>
  );
}
