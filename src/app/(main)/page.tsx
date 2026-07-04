import {
  Bell,
  Camera,
  ChevronRight,
  Heart,
  MapPin,
  Menu,
  Search,
  Sparkles,
  Star,
  UtensilsCrossed,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
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
        title="지금 눈여겨볼 스냅 명소"
        actionLabel="전체보기"
        href="/planner"
      >
        <EmptySpotCard />
        <EmptySpotCard />
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

interface DataRailSectionProps {
  title: string;
  actionLabel: string;
  href: string;
  children: React.ReactNode;
}

function DataRailSection({
  title,
  actionLabel,
  href,
  children,
}: DataRailSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-black">{title}</h2>
        <Link
          href={href}
          className="flex min-h-11 shrink-0 items-center gap-1 text-sm font-semibold text-muted-foreground"
        >
          {actionLabel}
          <ChevronRight className="size-4" />
        </Link>
      </div>
      <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex snap-x snap-mandatory gap-3 pb-1">{children}</div>
      </div>
    </section>
  );
}

function EmptySnapCard() {
  return (
    <article className="flex h-48 w-[18.75rem] shrink-0 snap-start flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
            <UserRound className="size-8" />
          </span>
          <div className="flex min-w-0 flex-col gap-2">
            <span className="h-4 w-28 rounded-full bg-muted" />
            <span className="h-3 w-20 rounded-full bg-muted" />
          </div>
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Star className="size-5" />
        </span>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-secondary-foreground">
            포트폴리오
          </span>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-secondary-foreground">
            예약 일정
          </span>
        </div>
        <p className="text-xs font-medium text-muted-foreground">
          스냅 데이터 연결 후 표시됩니다.
        </p>
      </div>
    </article>
  );
}

interface EmptyServiceCardProps {
  icon: typeof Camera;
  label: string;
}

function EmptyServiceCard({ icon: Icon, label }: EmptyServiceCardProps) {
  return (
    <article className="flex h-44 w-[18.75rem] shrink-0 snap-start flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <span className="w-fit rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
            {label}
          </span>
          <div className="flex flex-col gap-2 pt-1">
            <span className="h-4 w-36 rounded-full bg-muted" />
            <span className="h-3 w-48 rounded-full bg-muted" />
          </div>
        </div>
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="size-6" />
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <span className="h-8 w-20 rounded-full bg-muted" />
          <span className="h-8 w-24 rounded-full bg-muted" />
        </div>
        <p className="text-xs font-medium text-muted-foreground">
          업체 데이터 연결 후 표시됩니다.
        </p>
      </div>
    </article>
  );
}

function EmptySpotCard() {
  return (
    <article className="relative flex h-52 w-[18.75rem] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-br from-secondary via-card to-[#d8e6e5]" />
      <div className="absolute top-4 right-4 flex size-11 items-center justify-center rounded-full bg-white/90 text-muted-foreground">
        <MapPin className="size-5" />
      </div>
      <div className="relative flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-16 rounded-full bg-muted" />
          <span className="h-2.5 w-10 rounded-full bg-muted" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="h-4 w-36 rounded-full bg-muted" />
          <span className="h-3 w-48 rounded-full bg-muted" />
          <span className="h-3 w-32 rounded-full bg-muted" />
        </div>
        <p className="text-xs font-medium text-muted-foreground">
          관광 데이터 연결 후 표시됩니다.
        </p>
      </div>
    </article>
  );
}

interface EmptyCourseCardProps {
  icon: typeof Camera;
  label: string;
  title: string;
}

function EmptyCourseCard({ icon: Icon, label, title }: EmptyCourseCardProps) {
  return (
    <article className="flex h-36 w-[11.25rem] shrink-0 snap-start flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-secondary-foreground">
          {label}
        </span>
        <Icon className="size-5 text-primary" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-lg font-black">{title}</p>
        <div className="flex flex-col gap-1.5">
          <span className="h-2.5 w-full rounded-full bg-muted" />
          <span className="h-2.5 w-2/3 rounded-full bg-muted" />
        </div>
      </div>
    </article>
  );
}
