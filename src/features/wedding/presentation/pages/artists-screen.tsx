"use client";

import {
  Camera,
  LoaderCircle,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useState } from "react";

import type {
  SnapScene,
  WeddingCatalog,
  WeddingTone,
} from "../../domain/entity/wedding-catalog.entity";
import {
  getSceneLabel,
  getToneLabel,
} from "../../domain/usecase/wedding-catalog.usecase";
import { ArtistListCard } from "../components/artist-list-card";
import { CatalogDemoNotice } from "../components/catalog-demo-notice";
import { useSnapArtistInfiniteQuery } from "../hooks/use-snap-artist-infinite-query";

interface ArtistsScreenProps {
  catalog: WeddingCatalog;
  initialScene?: SnapScene;
  initialTone?: WeddingTone;
}

export function ArtistsScreen({
  catalog,
  initialScene,
  initialTone,
}: ArtistsScreenProps) {
  const [selectedScene, setSelectedScene] = useState<SnapScene | undefined>(
    initialScene,
  );
  const [selectedTone, setSelectedTone] = useState<WeddingTone | undefined>(
    initialTone,
  );
  const {
    artists,
    totalCount,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isPending,
    fetchNextPage,
    refetch,
  } = useSnapArtistInfiniteQuery({
    scene: selectedScene,
    tone: selectedTone,
  });
  const { ref: sentinelRef } = useInView({
    rootMargin: "320px",
    skip: !hasNextPage || isFetchingNextPage,
    onChange: (isInView) => {
      if (isInView) {
        void fetchNextPage();
      }
    },
  });
  const hasFilter = Boolean(selectedScene || selectedTone);
  const hasInitialLoadError = isError && artists.length === 0;

  function resetFilters() {
    setSelectedScene(undefined);
    setSelectedTone(undefined);
  }

  return (
    <div className="flex flex-col gap-7 pb-4">
      <header className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-primary">제주 스냅 작가</p>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-balance">
            풍경이 아니라, 사진의 결로 고르세요
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            원하는 제주 씬과 사진 톤에 맞는 작가를 먼저 비교해보세요. 실제
            포토스팟은 작가가 촬영일의 날씨와 빛에 맞춰 안내합니다.
          </p>
        </div>
      </header>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <SlidersHorizontal className="size-4 text-primary" />
            촬영 씬
          </p>
          {hasFilter ? (
            <button
              type="button"
              onClick={resetFilters}
              className="flex min-h-11 items-center gap-1 text-sm font-semibold text-muted-foreground active:text-foreground"
            >
              <X className="size-4" />
              초기화
            </button>
          ) : null}
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <FilterChip
            isActive={!selectedScene}
            label="전체"
            onClick={() => setSelectedScene(undefined)}
          />
          {catalog.scenes.map((scene) => (
            <FilterChip
              key={scene.id}
              isActive={selectedScene === scene.id}
              label={scene.label}
              onClick={() =>
                setSelectedScene((currentScene) =>
                  currentScene === scene.id ? undefined : scene.id,
                )
              }
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <p className="text-sm font-semibold">사진 톤</p>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <FilterChip
            isActive={!selectedTone}
            label="전체"
            onClick={() => setSelectedTone(undefined)}
          />
          {catalog.tones.map((tone) => (
            <FilterChip
              key={tone.id}
              isActive={selectedTone === tone.id}
              label={tone.label}
              onClick={() =>
                setSelectedTone((currentTone) =>
                  currentTone === tone.id ? undefined : tone.id,
                )
              }
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-lg font-semibold">
            {hasFilter ? "선택한 취향의 작가" : "제주 스냅 작가"}
          </p>
          <span className="text-sm text-muted-foreground">
            {isPending ? "불러오는 중" : `${totalCount}명`}
          </span>
        </div>
        {isPending ? (
          <ArtistListSkeleton />
        ) : hasInitialLoadError ? (
          <ArtistLoadError onRetry={() => void refetch()} />
        ) : artists.length > 0 ? (
          <>
          <div className="grid gap-3 sm:grid-cols-2">
            {artists.map((artist) => (
              <ArtistListCard
                key={artist.id}
                artist={artist}
                sceneLabel={getSceneLabel(catalog, artist.scenes[0])}
                toneLabel={getToneLabel(catalog, artist.tones[0])}
              />
            ))}
          </div>
            {hasNextPage ? (
              <div
                ref={sentinelRef}
                className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-muted/40 p-4 text-center"
              >
                {isFetchingNextPage ? (
                  <>
                    <LoaderCircle className="size-5 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      다음 작가 10명을 불러오고 있어요.
                    </p>
                  </>
                ) : isError ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      다음 작가 목록을 불러오지 못했어요.
                    </p>
                    <button
                      type="button"
                      onClick={() => void fetchNextPage()}
                      className="flex min-h-11 items-center justify-center rounded-md bg-secondary px-4 text-sm font-semibold text-secondary-foreground active:bg-muted"
                    >
                      다시 시도
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      아래로 스크롤하면 다음 작가 10명을 자동으로 보여드려요.
                    </p>
                    <button
                      type="button"
                      onClick={() => void fetchNextPage()}
                      className="flex min-h-11 items-center justify-center rounded-md bg-secondary px-4 text-sm font-semibold text-secondary-foreground active:bg-muted"
                    >
                      다음 10명 더 보기
                    </button>
                  </>
                )}
              </div>
            ) : (
              <p className="py-2 text-center text-sm text-muted-foreground">
                모든 작가를 둘러봤어요.
              </p>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-muted/50 p-6 text-center">
            <span className="flex size-12 items-center justify-center rounded-xl bg-card text-primary">
              <Camera className="size-6" />
            </span>
            <div className="flex flex-col gap-1">
              <p className="text-base font-semibold">아직 맞는 조합이 없어요</p>
              <p className="text-sm leading-6 text-muted-foreground">
                씬이나 사진 톤 중 하나를 바꾸어 다시 찾아보세요.
              </p>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="flex min-h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground active:bg-primary/90"
            >
              필터 초기화
            </button>
          </div>
        )}
      </section>

      <CatalogDemoNotice />
    </div>
  );
}

interface ArtistLoadErrorProps {
  onRetry: () => void;
}

function ArtistLoadError({ onRetry }: ArtistLoadErrorProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-muted/50 p-6 text-center">
      <span className="flex size-12 items-center justify-center rounded-xl bg-card text-primary">
        <Camera className="size-6" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold">작가 목록을 불러오지 못했어요</p>
        <p className="text-sm leading-6 text-muted-foreground">
          잠시 후 다시 시도해주세요.
        </p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="flex min-h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground active:bg-primary/90"
      >
        다시 시도
      </button>
    </div>
  );
}

function ArtistListSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2" aria-label="작가 목록 불러오는 중">
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="h-40 animate-pulse rounded-2xl border border-border bg-muted/60"
        />
      ))}
    </div>
  );
}

interface FilterChipProps {
  isActive: boolean;
  label: string;
  onClick: () => void;
}

function FilterChip({ isActive, label, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm transition-colors ${
        isActive
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-secondary-foreground active:bg-muted"
      }`}
    >
      {label}
    </button>
  );
}
