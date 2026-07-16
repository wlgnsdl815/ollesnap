import { ChevronRight } from "lucide-react";
import Link from "next/link";

import type {
  SnapArtist,
  SnapPackage,
} from "../../domain/entity/wedding-catalog.entity";
import { formatPrice } from "../../domain/usecase/wedding-catalog.usecase";

interface SnapSelectionBarProps {
  artist: SnapArtist;
  snapPackage: SnapPackage;
}

/**
 * 작가 상품을 고른 뒤 스드메를 둘러보는 동안, 선택한 상품이 사라지지 않도록
 * 화면 상단에 고정되는 요약 바. 탭하면 작가 상세로 돌아가 상품을 바꿀 수 있다.
 */
export function SnapSelectionBar({ artist, snapPackage }: SnapSelectionBarProps) {
  return (
    <div className="sticky top-14 z-10 -mx-4 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <Link
        href={`/artists/${artist.id}`}
        className="flex min-h-14 items-center justify-between gap-3 px-4 active:bg-muted"
      >
        <span className="min-w-0">
          <span className="block text-xs text-muted-foreground">
            선택한 촬영 상품
          </span>
          <span className="block truncate text-sm font-semibold">
            {artist.studioName} · {snapPackage.name}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1">
          <span className="text-sm font-semibold text-primary">
            {formatPrice(snapPackage.price)}
          </span>
          <ChevronRight className="size-4 text-muted-foreground" />
        </span>
      </Link>
    </div>
  );
}
