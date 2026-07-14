import { ArrowUpRight, Shirt, Sparkles } from "lucide-react";
import Link from "next/link";

import type {
  SnapArtist,
  StylingPartner,
} from "../../domain/entity/wedding-catalog.entity";
import { formatPriceFrom } from "../../domain/usecase/wedding-catalog.usecase";

interface StylingPartnerCardProps {
  artist: SnapArtist;
  partner: StylingPartner;
  selectedDressId?: string;
  selectedMakeupId?: string;
}

export function StylingPartnerCard({
  artist,
  partner,
  selectedDressId,
  selectedMakeupId,
}: StylingPartnerCardProps) {
  const Icon = partner.kind === "dress" ? Shirt : Sparkles;
  const searchParams = new URLSearchParams({ artist: artist.id });

  if (selectedDressId) {
    searchParams.set("dress", selectedDressId);
  }

  if (selectedMakeupId) {
    searchParams.set("makeup", selectedMakeupId);
  }

  searchParams.set(partner.kind, partner.id);

  return (
    <Link
      href={`/planner?${searchParams.toString()}`}
      className="flex min-h-40 flex-col justify-between rounded-2xl border border-border bg-card p-4 transition-colors active:bg-muted"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <ArrowUpRight className="size-5 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <p className="text-base font-semibold">{partner.name}</p>
          <p className="line-clamp-2 text-sm leading-5 text-muted-foreground">
            {partner.introduction}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {partner.keywords.slice(0, 2).map((keyword) => (
            <span
              key={keyword}
              className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
            >
              {keyword}
            </span>
          ))}
        </div>
        <p className="text-sm font-semibold text-primary">
          {formatPriceFrom(partner.priceFrom)}
        </p>
      </div>
    </Link>
  );
}
