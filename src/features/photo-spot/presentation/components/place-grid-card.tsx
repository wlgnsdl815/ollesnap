import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PlaceGridCardProps {
  href: string;
  imageUrl: string;
  title: string;
  subtitle: string;
}

export function PlaceGridCard({
  href,
  imageUrl,
  title,
  subtitle,
}: PlaceGridCardProps) {
  return (
    <Link href={href} className="flex flex-col gap-2">
      <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-muted">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover"
        />
        <div className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-white/90 text-muted-foreground">
          <MapPin className="size-4" />
        </div>
      </div>
      <div className="flex flex-col gap-0.5 px-0.5">
        <p className="truncate text-sm font-bold">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </Link>
  );
}
