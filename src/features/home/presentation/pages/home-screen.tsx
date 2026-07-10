import {
  Bell,
  Camera,
  ChevronRight,
  Heart,
  Menu,
  Search,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { PhotoSpot } from "@/features/photo-spot/domain/entity/photo-spot.entity";

import { DataRailSection } from "../components/data-rail-section";
import { EmptyCourseCard } from "../components/empty-course-card";
import { EmptyServiceCard } from "../components/empty-service-card";
import { EmptySnapCard } from "../components/empty-snap-card";
import { EmptySpotCard } from "../components/empty-spot-card";
import { SnapSpotCard } from "../components/snap-spot-card";

interface HomeScreenProps {
  jejuSnapSpots: PhotoSpot[];
}

export function HomeScreen({ jejuSnapSpots }: HomeScreenProps) {
  return (
    <div className="flex flex-col gap-8 pb-4">
      <header className="flex flex-col gap-5">
        <div className="flex min-h-11 items-center justify-between gap-3">
          <Link
            href="/"
            className="text-2xl font-black tracking-normal text-primary"
          >
            ollesnap
          </Link>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="알림"
              className="flex size-11 items-center justify-center rounded-full text-foreground transition-colors active:bg-muted"
            >
              <Bell className="size-6" />
            </button>
            <button
              type="button"
              aria-label="메뉴"
              className="flex size-11 items-center justify-center rounded-full text-foreground transition-colors active:bg-muted"
            >
              <Menu className="size-7" />
            </button>
          </div>
        </div>

        <Link
          href="/planner"
          className="flex min-h-[3.25rem] items-center gap-3 rounded-full border-2 border-primary bg-card px-4 text-sm font-semibold text-muted-foreground shadow-sm active:bg-muted"
        >
          <Search className="size-5 shrink-0 text-primary" />
          <span className="min-w-0 flex-1 truncate">
            제주 스냅 명소, 코스 검색
          </span>
          <span className="h-6 w-px bg-border" />
          <span className="inline-flex shrink-0 items-center gap-1 text-primary">
            <Sparkles className="size-4" />
            AI 코스
          </span>
        </Link>
      </header>

      <section className="relative min-h-[17rem] overflow-hidden rounded-3xl bg-foreground text-white shadow-sm">
        <Image
          src="/images/jeju-snap-hero.png"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 896px, (min-width: 640px) 672px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-black/10" />
        <div className="relative flex min-h-[17rem] flex-col justify-between p-5">
          <span className="w-fit rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-foreground">
            제주 웨딩 스냅
          </span>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="max-w-72 text-3xl font-black leading-tight text-balance">
                촬영 브리핑을 한 화면에서
              </h1>
              <p className="max-w-64 text-sm font-medium text-white/80">
                혼잡도, 빛, 동선을 기준으로 제주 스냅 하루를 정리합니다.
              </p>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-black/40 p-3 backdrop-blur">
              <div className="flex min-w-0 flex-col gap-1">
                <span className="text-xs font-medium text-white/70">
                  다음 단계
                </span>
                <span className="truncate text-sm font-bold">
                  촬영 날짜와 장소 선택
                </span>
              </div>
              <Link
                href="/planner"
                className="flex min-h-11 shrink-0 items-center gap-1 rounded-full bg-white px-4 text-sm font-bold text-foreground active:bg-white/80"
              >
                열기
                <ChevronRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <DataRailSection
        title="많이 찾는 스냅"
        actionLabel="전체보기"
        href="/planner"
      >
        <EmptySnapCard />
        <EmptySnapCard />
        <EmptySnapCard />
      </DataRailSection>

      <DataRailSection
        title="추천 스드메"
        actionLabel="전체보기"
        href="/planner"
      >
        <EmptyServiceCard icon={Camera} label="스냅" />
        <EmptyServiceCard icon={Heart} label="드레스" />
        <EmptyServiceCard icon={Sparkles} label="메이크업" />
      </DataRailSection>

      <DataRailSection
        title="제주 이곳저곳"
        actionLabel="전체보기"
        href="/spots"
      >
        {jejuSnapSpots.length > 0 ? (
          jejuSnapSpots.map((spot) => <SnapSpotCard key={spot.id} spot={spot} />)
        ) : (
          <>
            <EmptySpotCard />
            <EmptySpotCard />
          </>
        )}
      </DataRailSection>

      <section className="rounded-2xl bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="size-5" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="text-sm font-bold">맞춤 추천 준비 중</p>
            <p className="truncate text-xs text-muted-foreground">
              촬영 취향과 날짜가 정해지면 추천도가 표시됩니다.
            </p>
          </div>
          <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
        </div>
      </section>

      <DataRailSection
        title="촬영 후 이어갈 코스"
        actionLabel="플래너"
        href="/planner"
      >
        <EmptyCourseCard icon={Camera} label="촬영" title="메인 스팟" />
        <EmptyCourseCard
          icon={UtensilsCrossed}
          label="식사"
          title="근처 맛집"
        />
        <EmptyCourseCard icon={Heart} label="휴식" title="카페·숙소" />
      </DataRailSection>
    </div>
  );
}
