import Image from "next/image";
import {
  Activity,
  BookOpen,
  CalendarDays,
  Camera,
  ChevronRight,
  Clock,
  CloudSun,
  Heart,
  MapPinned,
  Navigation,
  Route,
  Sparkles,
  Sun,
  TrendingDown,
  Users,
} from "lucide-react";

import {
  courseStops,
  photoBookEntries,
  plannerSlots,
  snapSpots as fallbackSnapSpots,
} from "@/features/snap/data/datasources/mock-snap.datasource";
import type {
  PlannerSlot,
  SnapSpot,
} from "@/features/snap/domain/entities/snap.entity";
import {
  getBestPlannerSlot,
  getCrowdLabel,
  getCrowdTone,
} from "@/features/snap/domain/usecases/snap-recommendations.usecase";
import type {
  TourismCrowdAttractionSummary,
  TourismCrowdFetchStatus,
} from "@/features/tourism-crowd/domain/entities/tourism-crowd.entity";
import {
  formatBaseDate,
  getTourismCrowdStatusLabel,
} from "@/features/tourism-crowd/domain/usecases/get-jeju-tourism-crowd.usecase";
import { Button } from "@/shared/components/ui/button";

const bestSlot = getBestPlannerSlot(plannerSlots);

interface OlleSnapPreviewProps {
  snapSpots?: SnapSpot[];
  crowdForecastSummaries?: TourismCrowdAttractionSummary[];
  crowdForecastStatus?: TourismCrowdFetchStatus;
}

interface CrowdForecastSectionProps {
  summaries: TourismCrowdAttractionSummary[];
  spots: SnapSpot[];
  status: TourismCrowdFetchStatus;
}

interface CrowdForecastCard {
  title: string;
  area: string;
  rate: number;
  meta: string;
}

function getCrowdBadgeClassName(crowdLevel: number) {
  const tone = getCrowdTone(crowdLevel);

  if (tone === "low") {
    return "border-[#4E7A5E]/20 bg-[#E7EFE9] text-[#4E7A5E]";
  }

  if (tone === "medium") {
    return "border-[#C9A24B]/25 bg-[#F7EED1] text-[#8A6B1F]";
  }

  return "border-[#A9685C]/25 bg-[#F0DEDA] text-[#A9685C]";
}

function TopBar() {
  return (
    <header className="flex items-center justify-between gap-3 py-3">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-[#4E7A5E] text-[#FAF7F1] shadow-sm">
          <Camera className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-semibold text-[#8A8175]">제주 스냅 여행</p>
          <h1 className="text-xl font-bold tracking-normal text-[#2E2A24]">
            올레스냅
          </h1>
        </div>
      </div>
      <Button className="hidden h-10 bg-[#2E2A24] px-4 text-[#FAF7F1] hover:bg-[#3D372F] sm:inline-flex">
        코스 저장
      </Button>
    </header>
  );
}

function HeroPlanner() {
  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_360px]">
      <div className="relative min-h-[520px] overflow-hidden rounded-lg bg-[#2E2A24] text-[#FAF7F1] sm:min-h-[500px] lg:min-h-[560px]">
        <Image
          src="/images/jeju-snap-hero.png"
          alt="제주 해안 스냅 배경"
          fill
          priority
          sizes="(min-width: 1024px) 70vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#2E2A24]/20 via-[#2E2A24]/20 to-[#2E2A24]/82" />
        <div className="relative flex min-h-[520px] flex-col justify-between p-4 sm:min-h-[500px] sm:p-6 lg:min-h-[560px]">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-md bg-[#FAF7F1]/92 px-3 py-1 text-xs font-semibold text-[#4E7A5E]">
              제주 자연색 플랜
            </span>
            <span className="rounded-md bg-[#2E2A24]/60 px-3 py-1 text-xs font-medium text-[#FAF7F1] ring-1 ring-[#FAF7F1]/25">
              성산 · 협재 · 새별오름
            </span>
          </div>
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold text-[#F3EEE4]">
              2026.05.23 토요일
            </p>
            <h2 className="text-4xl font-bold leading-tight tracking-normal text-[#FFFFFF] sm:text-5xl">
              성산 일출 스냅 플랜
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#F3EEE4] sm:text-lg">
              일출 촬영, 돌담길 산책, 세화 카페까지 이어지는 제주 하루
              일정입니다.
            </p>
          </div>
        </div>
      </div>

      <PlannerControl />
    </section>
  );
}

function PlannerControl() {
  return (
    <aside className="rounded-lg border border-[#ECE7DD] bg-[#FAF7F1] p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#8A8175]">촬영 플랜</p>
          <h2 className="text-xl font-bold text-[#2E2A24]">5월 23일 토요일</h2>
        </div>
        <div className="flex size-10 items-center justify-center rounded-lg bg-[#E7EFE9] text-[#4E7A5E]">
          <CalendarDays className="size-5" aria-hidden="true" />
        </div>
      </div>

      <div className="grid gap-3">
        <label className="grid gap-2 text-sm font-semibold text-[#2E2A24]">
          촬영 날짜
          <input
            type="date"
            defaultValue="2026-05-23"
            className="h-11 rounded-md border border-[#ECE7DD] bg-white px-3 text-sm text-[#2E2A24] outline-none focus:border-[#4E7A5E] focus:ring-3 focus:ring-[#4E7A5E]/20"
          />
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button className="rounded-md border border-[#4E7A5E] bg-[#E7EFE9] px-3 py-3 text-left text-sm font-semibold text-[#4E7A5E]">
            자연색
          </button>
          <button className="rounded-md border border-[#ECE7DD] bg-white px-3 py-3 text-left text-sm font-semibold text-[#8A8175]">
            로즈톤
          </button>
          <button className="rounded-md border border-[#ECE7DD] bg-white px-3 py-3 text-left text-sm font-semibold text-[#8A8175]">
            바다색
          </button>
          <button className="rounded-md border border-[#ECE7DD] bg-white px-3 py-3 text-left text-sm font-semibold text-[#8A8175]">
            황금빛
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-lg bg-white p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#F7EED1] text-[#C9A24B]">
            <Sun className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#8A8175]">
              추천 시간대
            </p>
            <p className="mt-1 text-2xl font-bold text-[#2E2A24]">
              {bestSlot.time}
            </p>
            <p className="mt-1 text-sm leading-6 text-[#8A8175]">
              {bestSlot.note}
            </p>
          </div>
        </div>
      </div>

      <Button className="mt-4 h-12 w-full bg-[#4E7A5E] text-[#FAF7F1] hover:bg-[#416A4F]">
        스냅 코스 만들기
        <ChevronRight className="size-4" aria-hidden="true" />
      </Button>
    </aside>
  );
}

function PlannerSection() {
  return (
    <section className="rounded-lg border border-[#ECE7DD] bg-white p-4 shadow-sm lg:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#8A8175]">
            촬영 날짜 플래너
          </p>
          <h2 className="mt-1 text-2xl font-bold text-[#2E2A24]">
            시간대별 촬영 컨디션
          </h2>
        </div>
        <CloudSun className="size-6 text-[#5E8693]" aria-hidden="true" />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {plannerSlots.map((slot) => (
          <PlannerSlotCard key={slot.time} slot={slot} />
        ))}
      </div>
    </section>
  );
}

function PlannerSlotCard({ slot }: { slot: PlannerSlot }) {
  const isBest = slot.time === bestSlot.time;
  const className = `rounded-lg border p-4 ${
    isBest
      ? "border-[#4E7A5E] bg-[#FAF7F1]"
      : "border-[#ECE7DD] bg-[#FFFFFF]"
  }`;

  return (
    <article className={className}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-2xl font-bold text-[#2E2A24]">{slot.time}</p>
          <h3 className="mt-1 text-base font-bold text-[#2E2A24]">
            {slot.title}
          </h3>
        </div>
        <span
          className={`rounded-md border px-2.5 py-1 text-xs font-bold ${getCrowdBadgeClassName(slot.crowdLevel)}`}
        >
          {getCrowdLabel(slot.crowdLevel)}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-[#8A8175]">
        <p className="rounded-md bg-[#F3EEE4] px-3 py-2">{slot.weather}</p>
        <p className="rounded-md bg-[#F3EEE4] px-3 py-2">{slot.light}</p>
      </div>
      <p className="mt-3 text-sm leading-6 text-[#8A8175]">{slot.note}</p>
    </article>
  );
}

function CrowdForecastSection({
  summaries,
  spots,
  status,
}: CrowdForecastSectionProps) {
  const hasTourismCrowdData = status === "ready" && summaries.length > 0;
  const forecastCards: CrowdForecastCard[] = hasTourismCrowdData
    ? summaries.slice(0, 4).map((summary) => ({
        title: summary.attractionName,
        area: summary.districtName || summary.areaName || "제주",
        rate: summary.averageRate,
        meta: `${formatBaseDate(summary.latestBaseDate)} 기준 · ${summary.forecastDays}일 예측`,
      }))
    : [...spots]
        .sort((a, b) => a.crowdLevel - b.crowdLevel)
        .slice(0, 4)
        .map((spot) => ({
          title: spot.name,
          area: spot.region,
          rate: spot.crowdLevel,
          meta: "제주 기본 플랜",
        }));

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#8A8175]">
            제주 집중률
          </p>
          <h2 className="mt-1 text-2xl font-bold text-[#2E2A24]">
            한산한 촬영 후보
          </h2>
        </div>
        <span className="inline-flex h-9 items-center gap-2 rounded-md border border-[#ECE7DD] bg-white px-3 text-sm font-bold text-[#4E7A5E] shadow-sm">
          <Activity className="size-4" aria-hidden="true" />
          {getTourismCrowdStatusLabel(status)}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {forecastCards.map((item) => (
          <article
            key={`${item.title}-${item.area}`}
            className="rounded-lg border border-[#ECE7DD] bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-[#8A8175]">
                  {item.area}
                </p>
                <h3 className="mt-1 text-lg font-bold text-[#2E2A24]">
                  {item.title}
                </h3>
              </div>
              <span
                className={`rounded-md border px-2.5 py-1 text-xs font-bold ${getCrowdBadgeClassName(item.rate)}`}
              >
                {getCrowdLabel(item.rate)}
              </span>
            </div>
            <div className="mt-5 flex items-end justify-between gap-3">
              <p className="text-3xl font-bold text-[#2E2A24]">
                {item.rate}
                <span className="ml-1 text-base text-[#8A8175]">%</span>
              </p>
              <TrendingDown className="size-6 text-[#4E7A5E]" aria-hidden="true" />
            </div>
            <p className="mt-3 text-sm font-semibold text-[#8A8175]">
              {item.meta}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function MapPreview({ spots }: { spots: SnapSpot[] }) {
  return (
    <section className="rounded-lg border border-[#ECE7DD] bg-[#FAF7F1] p-4 shadow-sm lg:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#8A8175]">제주 맵</p>
          <h2 className="mt-1 text-2xl font-bold text-[#2E2A24]">
            명소와 코스 동선
          </h2>
        </div>
        <MapPinned className="size-6 text-[#4E7A5E]" aria-hidden="true" />
      </div>

      <div className="relative mt-5 aspect-[4/3] overflow-hidden rounded-lg border border-[#ECE7DD] bg-[#E7EFE9]">
        <div className="absolute inset-[8%] rounded-[48%_52%_46%_54%] bg-[#F3EEE4]" />
        <div className="absolute left-[16%] top-[18%] h-[60%] w-[68%] rounded-[42%_58%_50%_50%] border-2 border-[#4E7A5E]/25 bg-[#FAF7F1]" />
        <div className="absolute left-[28%] top-[34%] h-[36%] w-[42%] rounded-[50%] bg-[#ECE7DD]" />
        <div className="absolute left-[22%] top-[52%] h-1 w-[48%] rotate-[-14deg] rounded-full bg-[#5E8693]/35" />
        <div className="absolute left-[36%] top-[40%] h-1 w-[38%] rotate-[21deg] rounded-full bg-[#C9A24B]/45" />
        {spots.map((spot) => (
          <div
            key={spot.id}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
            style={spot.mapPosition}
          >
            <span
              className="flex size-8 items-center justify-center rounded-lg text-white shadow-md"
              style={{ backgroundColor: spot.accentColor }}
            >
              <Camera className="size-4" aria-hidden="true" />
            </span>
            <span className="rounded-md bg-white/90 px-2 py-1 text-[11px] font-bold text-[#2E2A24] shadow-sm">
              {spot.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SpotSection({ spots }: { spots: SnapSpot[] }) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#8A8175]">스냅 명소</p>
          <h2 className="mt-1 text-2xl font-bold text-[#2E2A24]">
            제주 자연색 촬영지
          </h2>
        </div>
        <Button
          variant="outline"
          className="hidden h-10 border-[#ECE7DD] bg-white text-[#2E2A24] hover:bg-[#FAF7F1] sm:inline-flex"
        >
          전체 보기
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {spots.map((spot) => (
          <SpotCard key={spot.id} spot={spot} />
        ))}
      </div>
    </section>
  );
}

function SpotCard({ spot }: { spot: SnapSpot }) {
  return (
    <article className="overflow-hidden rounded-lg border border-[#ECE7DD] bg-white shadow-sm">
      <div className="relative h-36 bg-[#F3EEE4]">
        <Image
          src="/images/jeju-snap-hero.png"
          alt={`${spot.name} 스냅 무드`}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 mix-blend-multiply"
          style={{ backgroundColor: `${spot.accentColor}66` }}
        />
        <div className="absolute left-3 top-3 rounded-md bg-white/92 px-2.5 py-1 text-xs font-bold text-[#2E2A24]">
          {spot.region}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[#8A8175]">{spot.mood}</p>
            <h3 className="mt-1 text-lg font-bold text-[#2E2A24]">
              {spot.name}
            </h3>
          </div>
          <span
            className={`rounded-md border px-2.5 py-1 text-xs font-bold ${getCrowdBadgeClassName(spot.crowdLevel)}`}
          >
            {getCrowdLabel(spot.crowdLevel)}
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-[#8A8175]">
          {spot.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {spot.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-[#F3EEE4] px-2.5 py-1 text-xs font-semibold text-[#8A8175]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function CourseSection() {
  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <div className="rounded-lg border border-[#ECE7DD] bg-[#2E2A24] p-5 text-[#FAF7F1] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#C9A24B] text-[#2E2A24]">
            <Route className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#C9A24B]">
              자동 생성 코스
            </p>
            <h2 className="text-2xl font-bold">성산 일출 스냅 루트</h2>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <Metric label="총 이동" value="38km" />
          <Metric label="촬영" value="2곳" />
          <Metric label="휴식" value="2곳" />
        </div>
        <p className="mt-5 text-sm leading-6 text-[#ECE7DD]">
          성산 06:20 시작 · 구좌 경유 · 세화 12:00 휴식
        </p>
      </div>

      <div className="rounded-lg border border-[#ECE7DD] bg-white p-4 shadow-sm lg:p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-[#2E2A24]">하루 타임라인</h2>
          <Clock className="size-5 text-[#B07B45]" aria-hidden="true" />
        </div>
        <div className="mt-4 grid gap-4">
          {courseStops.map((stop) => (
            <article key={`${stop.time}-${stop.title}`} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className="flex size-9 items-center justify-center rounded-lg text-xs font-bold text-white"
                  style={{ backgroundColor: stop.accentColor }}
                >
                  {stop.time}
                </span>
                <span className="mt-2 h-full w-px bg-[#ECE7DD]" />
              </div>
              <div className="pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-[#F3EEE4] px-2 py-1 text-xs font-bold text-[#8A8175]">
                    {stop.type}
                  </span>
                  <span className="text-xs font-semibold text-[#8A8175]">
                    {stop.area} · {stop.duration}
                  </span>
                </div>
                <h3 className="mt-2 text-base font-bold text-[#2E2A24]">
                  {stop.title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-[#8A8175]">
                  {stop.note}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[#FAF7F1]/10 p-3">
      <p className="text-xs font-semibold text-[#ECE7DD]">{label}</p>
      <p className="mt-1 text-lg font-bold text-white">{value}</p>
    </div>
  );
}

function PhotoBookSection() {
  return (
    <section className="grid gap-4 pb-20 md:pb-2 lg:grid-cols-[360px_minmax(0,1fr)]">
      <div className="rounded-lg border border-[#ECE7DD] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#F0DEDA] text-[#A9685C]">
            <BookOpen className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#8A8175]">
              커플 포토북
            </p>
            <h2 className="text-2xl font-bold text-[#2E2A24]">공유 미리보기</h2>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-[#8A8175]">
          3장 업로드 대기 · 공유 링크 준비됨
        </p>
        <Button className="mt-5 h-11 w-full bg-[#A9685C] text-white hover:bg-[#975D52]">
          포토북 만들기
          <Heart className="size-4" aria-hidden="true" />
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {photoBookEntries.map((entry) => (
          <article
            key={entry.title}
            className="relative min-h-48 overflow-hidden rounded-lg border border-[#ECE7DD] bg-[#F3EEE4] p-4 shadow-sm"
          >
            <div
              className="absolute inset-x-0 top-0 h-24"
              style={{ backgroundColor: entry.accentColor }}
            />
            <div className="relative mt-12 rounded-lg bg-white p-4 shadow-sm">
              <Sparkles
                className="mb-5 size-5 text-[#C9A24B]"
                aria-hidden="true"
              />
              <h3 className="text-lg font-bold text-[#2E2A24]">
                {entry.title}
              </h3>
              <p className="mt-1 text-sm font-semibold text-[#8A8175]">
                {entry.place}
              </p>
              <p className="mt-5 text-xs font-semibold text-[#8A8175]">
                {entry.date}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 grid h-16 grid-cols-4 rounded-lg border border-[#ECE7DD]/20 bg-[#2E2A24] px-2 text-[#FAF7F1] shadow-xl md:hidden">
      <a className="flex flex-col items-center justify-center gap-1 text-[11px] font-semibold">
        <CalendarDays className="size-5" aria-hidden="true" />
        플랜
      </a>
      <a className="flex flex-col items-center justify-center gap-1 text-[11px] font-semibold text-[#C9A24B]">
        <MapPinned className="size-5" aria-hidden="true" />
        명소
      </a>
      <a className="flex flex-col items-center justify-center gap-1 text-[11px] font-semibold">
        <Navigation className="size-5" aria-hidden="true" />
        코스
      </a>
      <a className="flex flex-col items-center justify-center gap-1 text-[11px] font-semibold">
        <Users className="size-5" aria-hidden="true" />
        포토북
      </a>
    </nav>
  );
}

export function OlleSnapPreview({
  snapSpots = fallbackSnapSpots,
  crowdForecastSummaries = [],
  crowdForecastStatus = "missing-service-key",
}: OlleSnapPreviewProps) {
  return (
    <main className="min-h-screen bg-[#F3EEE4] text-[#2E2A24]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 pb-8 sm:px-6 lg:px-8">
        <TopBar />
        <HeroPlanner />
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
          <PlannerSection />
          <MapPreview spots={snapSpots} />
        </div>
        <CrowdForecastSection
          summaries={crowdForecastSummaries}
          spots={snapSpots}
          status={crowdForecastStatus}
        />
        <SpotSection spots={snapSpots} />
        <CourseSection />
        <PhotoBookSection />
      </div>
      <MobileBottomNav />
    </main>
  );
}
