"use client";

import { Camera, ChevronLeft, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import type {
  SnapScene,
  WeddingCatalog,
  WeddingTone,
} from "../../domain/entity/wedding-catalog.entity";
import {
  filterSnapArtists,
  getSceneLabel,
  getToneLabel,
} from "../../domain/usecase/wedding-catalog.usecase";
import { ArtistListCard } from "../components/artist-list-card";
import { CatalogDemoNotice } from "../components/catalog-demo-notice";

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
  const artists = useMemo(
    () => filterSnapArtists(catalog.artists, { scene: selectedScene, tone: selectedTone }),
    [catalog.artists, selectedScene, selectedTone],
  );
  const hasFilter = Boolean(selectedScene || selectedTone);

  function resetFilters() {
    setSelectedScene(undefined);
    setSelectedTone(undefined);
  }

  return (
    <div className="flex flex-col gap-7 pb-4">
      <header className="flex flex-col gap-4">
        <Link
          href="/"
          className="flex min-h-11 w-fit items-center gap-1 text-sm font-semibold text-muted-foreground active:text-foreground"
        >
          <ChevronLeft className="size-5" />
          홈
        </Link>
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
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
          <span className="text-sm text-muted-foreground">{artists.length}명</span>
        </div>
        {artists.length > 0 ? (
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
