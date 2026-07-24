"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";

import type { StylingShop } from "../../domain/entity/wedding-catalog.entity";
import {
  COMPARISON_MAXIMUM,
  COMPARISON_MINIMUM,
} from "../../domain/usecase/compare-artists.usecase";
import { buildStylingShopComparisonRows } from "../../domain/usecase/compare-styling-shops.usecase";

interface CompareStylingShopsScreenProps {
  savedStylingShops: StylingShop[];
  isAuthenticated: boolean;
}

export function CompareStylingShopsScreen({
  savedStylingShops,
  isAuthenticated,
}: CompareStylingShopsScreenProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    savedStylingShops.slice(0, COMPARISON_MAXIMUM).map((shop) => shop.id),
  );
  const selectedShops = savedStylingShops.filter((shop) =>
    selectedIds.includes(shop.id),
  );
  const canCompare = savedStylingShops.length >= COMPARISON_MINIMUM;
  const rows = canCompare ? buildStylingShopComparisonRows(selectedShops) : [];

  function toggleShop(shopId: string) {
    setSelectedIds((currentIds) => {
      if (currentIds.includes(shopId)) {
        if (currentIds.length <= COMPARISON_MINIMUM) {
          return currentIds;
        }

        return currentIds.filter((id) => id !== shopId);
      }

      if (currentIds.length >= COMPARISON_MAXIMUM) {
        return currentIds;
      }

      return [...currentIds, shopId];
    });
  }

  return (
    <div className="flex flex-col gap-7 pb-4">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-balance">
          찜한 스드메 샵 나란히 보기
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          패키지·단품 가격과 구성부터 차분히 견줘보세요. 마지막 선택은
          상담에서 하게 돼요.
        </p>
      </header>

      {!isAuthenticated ? (
        <GuideCard
          title="로그인하면 찜한 샵이 여기에 모여요"
          description="스드메 샵 상세에서 찜해둔 샵을 이 화면에서 나란히 비교할 수 있어요."
          href="/login?next=/styling/compare"
          label="로그인하기"
        />
      ) : !canCompare ? (
        <GuideCard
          title={
            savedStylingShops.length === 1
              ? `지금은 ${savedStylingShops[0].name} 한 곳만 찜해두었어요`
              : "아직 찜한 스드메 샵이 없어요"
          }
          description="마음에 드는 샵을 두 곳 이상 찜하면 조건을 나란히 놓고 비교할 수 있어요."
          href="/styling"
          label="스드메 샵 둘러보기"
        />
      ) : (
        <>
          {savedStylingShops.length > COMPARISON_MAXIMUM ? (
            <section className="flex flex-col gap-3">
              <p className="text-sm font-semibold">비교할 샵을 골라주세요</p>
              <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
                {savedStylingShops.map((shop) => (
                  <button
                    key={shop.id}
                    type="button"
                    aria-pressed={selectedIds.includes(shop.id)}
                    onClick={() => toggleShop(shop.id)}
                    className={`flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm transition-colors ${
                      selectedIds.includes(shop.id)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-secondary-foreground active:bg-muted"
                    }`}
                  >
                    {shop.name}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                한 번에 두세 곳까지 나란히 볼 수 있어요.
              </p>
            </section>
          ) : null}

          <section className="flex flex-col gap-2">
            <div
              className="grid gap-x-3 rounded-2xl border border-border bg-card p-4"
              style={{
                gridTemplateColumns: `repeat(${selectedShops.length}, minmax(0, 1fr))`,
              }}
            >
              {selectedShops.map((shop) => (
                <Link
                  key={shop.id}
                  href={`/styling/${shop.id}`}
                  className="flex flex-col items-center gap-2 pb-4 text-center"
                >
                  {shop.portfolioImageUrls?.[0] ? (
                    <span className="relative size-12 overflow-hidden rounded-full bg-muted">
                      <Image
                        src={shop.portfolioImageUrls[0]}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </span>
                  ) : null}
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold leading-5">
                      {shop.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {shop.keywords[0]}
                    </span>
                  </span>
                </Link>
              ))}

              {rows.map((row) => (
                <Fragment key={row.label}>
                  <p className="col-span-full border-t border-border pt-3 pb-1 text-xs text-muted-foreground">
                    {row.label}
                  </p>
                  {row.values.map((value, index) => (
                    <div
                      key={selectedShops[index].id}
                      className={`flex flex-col gap-0.5 pb-3 text-center text-sm font-semibold leading-5 ${
                        value.isBest ? "text-primary" : ""
                      }`}
                    >
                      {value.lines.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  ))}
                </Fragment>
              ))}

              <div className="col-span-full border-t border-border pt-3" />
              {selectedShops.map((shop) => (
                <Link
                  key={shop.id}
                  href={`/styling/${shop.id}`}
                  className="flex min-h-11 items-center justify-center rounded-md bg-secondary px-2 text-xs font-semibold text-secondary-foreground active:bg-muted"
                >
                  자세히 보기
                </Link>
              ))}
            </div>
            <p className="text-xs leading-5 text-muted-foreground">
              주황색은 비교한 샵 중 가장 유리한 조건이에요. 가격은 정가
              기준입니다.
            </p>
          </section>
        </>
      )}
    </div>
  );
}

interface GuideCardProps {
  title: string;
  description: string;
  href: string;
  label: string;
}

function GuideCard({ title, description, href, label }: GuideCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold">{title}</p>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      <Link
        href={href}
        className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-4 text-base font-semibold text-primary-foreground active:bg-primary/90"
      >
        {label}
        <ChevronRight className="size-4" />
      </Link>
    </div>
  );
}
