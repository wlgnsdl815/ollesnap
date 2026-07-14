import {
  ArrowRight,
  Camera,
  ChevronRight,
  CircleUserRound,
  Map,
  Mountain,
  Sparkles,
  Trees,
  Waves,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type {
  SnapScene,
  WeddingCatalog,
} from "@/features/wedding/domain/entity/wedding-catalog.entity";
import {
  getSceneLabel,
  getToneLabel,
} from "@/features/wedding/domain/usecase/wedding-catalog.usecase";
import { ArtistListCard } from "@/features/wedding/presentation/components/artist-list-card";
import { CatalogDemoNotice } from "@/features/wedding/presentation/components/catalog-demo-notice";

interface HomeScreenProps {
  catalog: WeddingCatalog;
  isAuthenticated: boolean;
}

const SCENE_ICONS: Record<SnapScene, typeof Mountain> = {
  oreum: Mountain,
  sea: Waves,
  ranch: Trees,
  "stone-wall": Map,
  forest: Trees,
  sunset: Sparkles,
};

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
            <Link
              href="/artists"
              className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-4 text-base font-semibold text-primary-foreground active:bg-primary/90"
            >
              내 취향의 작가 찾기
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-primary">01. 촬영 씬</p>
          <h2 className="text-2xl font-semibold tracking-tight">
            원하는 씬부터 골라보세요
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            정확한 스팟은 작가가 날씨와 빛을 보고 안내해요.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {catalog.scenes.map((scene) => {
            const Icon = SCENE_ICONS[scene.id];

            return (
              <Link
                key={scene.id}
                href={`/artists?scene=${scene.id}`}
                className="flex min-h-32 flex-col justify-between rounded-2xl border border-border bg-card p-4 active:bg-muted"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Icon className="size-5" />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-sm font-semibold">{scene.label}</span>
                  <span className="text-xs leading-4 text-muted-foreground">
                    {scene.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-primary">02. 사진 톤</p>
            <h2 className="text-2xl font-semibold tracking-tight">
              나다운 사진의 결
            </h2>
          </div>
          <Link
            href="/artists"
            className="flex min-h-11 items-center gap-1 text-sm font-semibold text-primary"
          >
            작가 전체보기
            <ChevronRight className="size-4" />
          </Link>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {catalog.tones.map((tone) => (
            <Link
              key={tone.id}
              href={`/artists?tone=${tone.id}`}
              className="flex min-h-11 shrink-0 items-center rounded-full border border-border bg-card px-4 text-sm text-secondary-foreground active:bg-muted"
            >
              {tone.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-primary">03. 스냅 작가</p>
          <h2 className="text-2xl font-semibold tracking-tight">
            이런 작가를 찾을 수 있어요
          </h2>
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
        <div className="flex flex-col gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-card text-primary">
            <Sparkles className="size-5" />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold">스드메, 따로 찾지 마세요</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              작가의 사진 톤과 잘 맞는 드레스·메이크업 후보를 함께 비교할 수
              있어요.
            </p>
          </div>
          <Link
            href="/styling"
            className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-foreground px-4 text-base font-semibold text-card active:bg-foreground/90"
          >
            드레스·메이크업 보기
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Camera className="size-5" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="text-lg font-semibold">내 촬영팀</p>
            <p className="text-sm leading-6 text-muted-foreground">
              작가, 드레스, 메이크업을 한 장의 촬영 브리프로 정리해요.
            </p>
          </div>
        </div>
        <Link
          href="/planner"
          className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-4 text-base font-semibold text-primary-foreground active:bg-primary/90"
        >
          촬영팀 구성하기
          <ArrowRight className="size-4" />
        </Link>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/50 p-5">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-card text-primary">
            <Map className="size-5" />
          </span>
          <div className="flex flex-col gap-1">
            <p className="text-lg font-semibold">촬영 뒤, 제주에 더 머무는 날</p>
            <p className="text-sm leading-6 text-muted-foreground">
              촬영일은 작가에게 맡기고, 남은 날의 제주 여행은 따로 가볍게
              둘러보세요.
            </p>
          </div>
        </div>
        <Link
          href="/spots"
          className="flex min-h-11 items-center gap-1 text-sm font-semibold text-primary"
        >
          제주 여행 아이디어 보기
          <ChevronRight className="size-4" />
        </Link>
      </section>

      <CatalogDemoNotice />
    </div>
  );
}
