"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";

import type {
  SnapArtist,
  WeddingCatalog,
} from "../../domain/entity/wedding-catalog.entity";
import {
  buildArtistComparisonRows,
  COMPARISON_MAXIMUM,
  COMPARISON_MINIMUM,
} from "../../domain/usecase/compare-artists.usecase";
import { CatalogDemoNotice } from "../components/catalog-demo-notice";

interface CompareArtistsScreenProps {
  savedArtists: SnapArtist[];
  catalog: WeddingCatalog;
  isAuthenticated: boolean;
}

export function CompareArtistsScreen({
  savedArtists,
  catalog,
  isAuthenticated,
}: CompareArtistsScreenProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    savedArtists.slice(0, COMPARISON_MAXIMUM).map((artist) => artist.id),
  );
  const selectedArtists = savedArtists.filter((artist) =>
    selectedIds.includes(artist.id),
  );
  const canCompare = savedArtists.length >= COMPARISON_MINIMUM;
  const rows = canCompare
    ? buildArtistComparisonRows(selectedArtists, catalog)
    : [];

  function toggleArtist(artistId: string) {
    setSelectedIds((currentIds) => {
      if (currentIds.includes(artistId)) {
        if (currentIds.length <= COMPARISON_MINIMUM) {
          return currentIds;
        }

        return currentIds.filter((id) => id !== artistId);
      }

      if (currentIds.length >= COMPARISON_MAXIMUM) {
        return currentIds;
      }

      return [...currentIds, artistId];
    });
  }

  return (
    <div className="flex flex-col gap-7 pb-4">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-balance">
          찜한 작가 나란히 보기
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          가격과 일정 같은 기본 조건부터 차분히 견줘보세요. 마지막 선택은
          포트폴리오와 상담에서 하게 돼요.
        </p>
      </header>

      {!isAuthenticated ? (
        <GuideCard
          title="로그인하면 찜한 작가가 여기에 모여요"
          description="작가 상세에서 찜해둔 작가를 이 화면에서 나란히 비교할 수 있어요."
          href="/login?next=/artists/compare"
          label="로그인하기"
        />
      ) : !canCompare ? (
        <GuideCard
          title={
            savedArtists.length === 1
              ? `지금은 ${savedArtists[0].studioName} 한 곳만 찜해두었어요`
              : "아직 찜한 작가가 없어요"
          }
          description="마음에 드는 작가를 두 명 이상 찜하면 조건을 나란히 놓고 비교할 수 있어요."
          href="/artists"
          label="작가 둘러보기"
        />
      ) : (
        <>
          {savedArtists.length > COMPARISON_MAXIMUM ? (
            <section className="flex flex-col gap-3">
              <p className="text-sm font-semibold">
                비교할 작가를 골라주세요
              </p>
              <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
                {savedArtists.map((artist) => (
                  <button
                    key={artist.id}
                    type="button"
                    aria-pressed={selectedIds.includes(artist.id)}
                    onClick={() => toggleArtist(artist.id)}
                    className={`flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm transition-colors ${
                      selectedIds.includes(artist.id)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-secondary-foreground active:bg-muted"
                    }`}
                  >
                    {artist.studioName}
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
                gridTemplateColumns: `repeat(${selectedArtists.length}, minmax(0, 1fr))`,
              }}
            >
              {selectedArtists.map((artist) => (
                <Link
                  key={artist.id}
                  href={`/artists/${artist.id}`}
                  className="flex flex-col items-center gap-2 pb-4 text-center"
                >
                  <span className="relative size-12 overflow-hidden rounded-full">
                    <Image
                      src={artist.profileImageUrl}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold leading-5">
                      {artist.studioName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {artist.artistName} 작가
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
                      key={selectedArtists[index].id}
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
              {selectedArtists.map((artist) => (
                <Link
                  key={artist.id}
                  href={`/artists/${artist.id}`}
                  className="flex min-h-11 items-center justify-center rounded-md bg-secondary px-2 text-xs font-semibold text-secondary-foreground active:bg-muted"
                >
                  자세히 보기
                </Link>
              ))}
            </div>
            <p className="text-xs leading-5 text-muted-foreground">
              주황색은 비교한 작가 중 가장 유리한 조건이에요. 의상과 보정본은
              각 작가의 기본 상품 기준입니다.
            </p>
          </section>

          <section className="flex flex-col gap-2 rounded-2xl border border-border bg-muted/50 p-5">
            <p className="text-base font-semibold">숫자가 비슷하게 느껴진다면</p>
            <p className="text-sm leading-6 text-muted-foreground">
              조건 차이가 크지 않을 때는 사진의 결이 답이 되는 경우가 많아요.
              두 작가의 상세에서 씬별 사진을 번갈아 보며 마음이 머무는 쪽을
              골라보세요.
            </p>
          </section>
        </>
      )}

      <CatalogDemoNotice />
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
