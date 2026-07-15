import { ArrowRight, ChevronRight, CircleUserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { WeddingCatalog } from "@/features/wedding/domain/entity/wedding-catalog.entity";
import {
  getSceneLabel,
  getToneLabel,
} from "@/features/wedding/domain/usecase/wedding-catalog.usecase";
import { ArtistListCard } from "@/features/wedding/presentation/components/artist-list-card";
import { CatalogDemoNotice } from "@/features/wedding/presentation/components/catalog-demo-notice";
import {
  SCENE_IMAGES,
  TONE_PHOTO_FILTERS,
} from "@/features/wedding/presentation/lib/scene-tone-visuals";

interface HomeScreenProps {
  catalog: WeddingCatalog;
  isAuthenticated: boolean;
}

export function HomeScreen({ catalog, isAuthenticated }: HomeScreenProps) {
  return (
    <div className="flex flex-col gap-10 pb-4">
      <header className="flex min-h-11 items-center justify-between gap-3">
        <Link href="/" className="text-2xl font-black text-primary">
          ollesnap
        </Link>
        <Link
          href={isAuthenticated ? "/profile" : "/login?next=/"}
          aria-label={isAuthenticated ? "내 프로필" : "로그인"}
          className="flex min-h-11 items-center gap-2 rounded-full bg-secondary px-3 text-xs font-medium text-secondary-foreground active:bg-muted"
        >
          <CircleUserRound className="size-4" />
          {isAuthenticated ? "내 저장" : "로그인"}
        </Link>
      </header>

      <section className="relative min-h-[28rem] overflow-hidden rounded-3xl bg-foreground text-white">
        <Image
          src="/images/jeju-snap-hero.png"
          alt="제주 해안에서 웨딩 스냅을 촬영하는 커플"
          fill
          priority
          sizes="(min-width: 1024px) 896px, (min-width: 640px) 672px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-black/5" />
        <div className="relative flex min-h-[28rem] flex-col justify-between p-5">
          <span className="w-fit rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-foreground">
            장소 대신, 남기고 싶은 분위기부터
          </span>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="max-w-80 text-3xl font-black leading-tight text-balance">
                어떤 제주를 사진에 남기고 싶나요?
              </h1>
              <p className="max-w-72 text-sm leading-6 text-white/85">
                작가의 비공개 포토스팟은 지키고, 당신이 원하는 제주 씬과 사진
                톤으로 촬영팀을 찾아드려요.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/artists"
                className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-4 text-base font-semibold text-primary-foreground active:bg-primary/90"
              >
                내 취향의 작가 찾기
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/start"
                className="flex min-h-11 items-center justify-center rounded-md bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur active:bg-white/20"
              >
                아직 아무것도 못 골랐어요
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            원하는 씬부터 골라보세요
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            정확한 스팟은 작가가 날씨와 빛을 보고 안내해요.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {catalog.scenes.map((scene) => (
            <Link
              key={scene.id}
              href={`/artists?scene=${scene.id}`}
              className="relative aspect-4/5 overflow-hidden rounded-2xl"
            >
              <Image
                src={SCENE_IMAGES[scene.id]}
                alt={scene.label}
                fill
                sizes="(min-width: 640px) 220px, 45vw"
                className="object-cover"
              />
              <span className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-3.5">
                <span className="text-base font-semibold text-white">
                  {scene.label}
                </span>
                <span className="text-xs leading-4 text-white/80">
                  {scene.description}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            나다운 사진의 결
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            같은 바다도 작가의 톤에 따라 다르게 남아요.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {catalog.tones.map((tone) => (
            <Link
              key={tone.id}
              href={`/artists?tone=${tone.id}`}
              className="flex flex-col gap-2"
            >
              <span className="relative aspect-4/3 overflow-hidden rounded-xl">
                <Image
                  src={SCENE_IMAGES.sea}
                  alt={`협재 바다 — ${tone.label} 톤`}
                  fill
                  sizes="(min-width: 640px) 320px, 45vw"
                  className="object-cover"
                  style={{ filter: TONE_PHOTO_FILTERS[tone.id] }}
                />
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold">{tone.label}</span>
                <span className="text-xs leading-4 text-muted-foreground">
                  {tone.description}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">
            이런 작가를 찾을 수 있어요
          </h2>
          <Link
            href="/artists"
            className="flex min-h-11 shrink-0 items-center gap-1 text-sm font-semibold text-primary"
          >
            전체보기
            <ChevronRight className="size-4" />
          </Link>
        </div>
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0">
          {catalog.artists.slice(0, 3).map((artist) => (
            <div key={artist.id} className="w-72 shrink-0 sm:w-auto">
              <ArtistListCard
                artist={artist}
                sceneLabel={getSceneLabel(catalog, artist.scenes[0])}
                toneLabel={getToneLabel(catalog, artist.tones[0])}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-accent p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold">스드메, 따로 찾지 마세요</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              작가의 사진 톤과 잘 맞는 드레스·메이크업 후보를 함께 비교할 수
              있어요.
            </p>
          </div>
          <Link
            href="/artists?tab=styling"
            className="inline-flex min-h-12 w-fit items-center rounded-md bg-foreground px-5 text-base font-semibold text-card active:bg-foreground/90"
          >
            드레스·메이크업 보기
          </Link>
        </div>
      </section>

      <section className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
        <Link
          href="/planner"
          className="flex items-center gap-3 p-5 active:bg-muted"
        >
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-base font-semibold">제주 일정</span>
            <span className="text-sm leading-6 text-muted-foreground">
              촬영일과 더 머무는 날의 계획을 함께 정리해요.
            </span>
          </span>
          <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
        </Link>
        <Link
          href="/spots"
          className="flex items-center gap-3 p-5 active:bg-muted"
        >
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-base font-semibold">
              촬영 뒤, 제주에 더 머무는 날
            </span>
            <span className="text-sm leading-6 text-muted-foreground">
              남은 날의 제주 여행을 가볍게 둘러보세요.
            </span>
          </span>
          <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
        </Link>
      </section>

      <CatalogDemoNotice />
    </div>
  );
}
