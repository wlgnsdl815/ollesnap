import {
  ArrowRight,
  CalendarDays,
  Camera,
  Check,
  ChevronRight,
  Map,
  PackageCheck,
} from "lucide-react";
import Link from "next/link";

import type { SnapTeam } from "../../domain/entity/wedding-catalog.entity";
import {
  formatPrice,
  formatPriceFrom,
} from "../../domain/usecase/wedding-catalog.usecase";
import { CatalogDemoNotice } from "../components/catalog-demo-notice";
import type { SavedSnapPlan } from "@/features/account/domain/entity/user-wedding.entity";
import { SaveSnapPlanCard } from "@/features/account/presentation/components/save-snap-plan-card";

interface MySnapTeamScreenProps {
  team: SnapTeam;
  initialSavedPlan: SavedSnapPlan | null;
  isAuthenticated: boolean;
}

export function MySnapTeamScreen({
  team,
  initialSavedPlan,
  isAuthenticated,
}: MySnapTeamScreenProps) {
  const stylingHref = `/styling?artist=${team.artist.id}&package=${team.snapPackage.id}`;
  const stylingOptions = team.stylingAddOns.map((addOn) => addOn.id).join(",");
  const plannerSearchParams = new URLSearchParams({
    artist: team.artist.id,
    package: team.snapPackage.id,
    stylingShop: team.stylingShop.id,
    stylingProduct: team.stylingProduct.id,
  });

  if (stylingOptions) {
    plannerSearchParams.set("stylingOptions", stylingOptions);
  }

  const plannerHref = `/planner?${plannerSearchParams.toString()}`;

  return (
    <div className="flex flex-col gap-7 pb-4">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-primary">내 촬영팀</p>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-balance">
          한 장으로 정리한 제주 스냅 브리프
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          작가가 실제 촬영 장소와 시간대를 최종 조율하기 전, 취향과 준비
          구성을 한눈에 확인하는 단계예요.
        </p>
      </header>

      <section className="flex flex-col gap-4 rounded-2xl bg-foreground p-5 text-primary-foreground">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-white/70">촬영팀 준비 상태</p>
            <p className="text-xl font-semibold">3가지 구성을 골랐어요</p>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium">
            목 데이터 예시
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <ProgressItem label="작가" />
          <ProgressItem label="상품" />
          <ProgressItem label="스드메" />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">선택한 구성</h2>
        <TeamMemberCard
          icon={Camera}
          label="스냅 작가"
          name={team.artist.studioName}
          description={`${team.artist.artistName} 작가 · ${team.artist.keywords.join(" · ")}`}
          price="선택됨"
          href="/artists"
          actionLabel="작가 바꾸기"
        />
        <TeamMemberCard
          icon={Camera}
          label="촬영 상품"
          name={team.snapPackage.name}
          description={`${team.snapPackage.durationHours}시간 · 의상 ${team.snapPackage.outfitCountMinimum}~${team.snapPackage.outfitCountMaximum}벌 · 촬영 씬 ${team.snapPackage.sceneCount}개`}
          price={formatPriceFrom(team.snapPackage.price)}
          href={`/artists/${team.artist.id}`}
          actionLabel="상품 바꾸기"
        />
        <TeamMemberCard
          icon={PackageCheck}
          label={team.hasPartnerStylingPrice ? "제휴 스드메 패키지" : "스드메 상품"}
          name={`${team.stylingShop.name} · ${team.stylingProduct.name}`}
          description={team.stylingProduct.includedServices.join(" · ")}
          price={formatPrice(team.stylingPrice.total)}
          href={stylingHref}
          actionLabel="스드메 상품 바꾸기"
        />
        {team.stylingAddOns.length > 0 ? (
          <div className="rounded-xl bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
            선택 옵션: {team.stylingAddOns.map((addOn) => addOn.name).join(" · ")}
          </div>
        ) : null}
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-primary">예상 시작가</p>
            <p className="text-2xl font-semibold">
              {formatPriceFrom(team.totalPriceFrom)}
            </p>
          </div>
          <CalendarDays className="size-6 text-primary" />
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          스드메 옵션, 이동비, 헬퍼 비용, 추가 보정은 실제 상담에서 일정과 촬영
          범위에 따라 확인해야 해요.
        </p>
      </section>

      <SaveSnapPlanCard
        plan={{
          artistId: team.artist.id,
          packageId: team.snapPackage.id,
          stylingShopId: team.stylingShop.id,
          stylingProductId: team.stylingProduct.id,
          stylingOptionIds: team.stylingAddOns.map((addOn) => addOn.id),
          shootingDate: null,
          stayStartDate: null,
          stayEndDate: null,
        }}
        initialSavedPlan={initialSavedPlan}
        isAuthenticated={isAuthenticated}
        returnPath={plannerHref}
      />

      <section className="flex flex-col gap-4 rounded-2xl bg-accent p-5">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-card text-primary">
            <Map className="size-5" />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold">촬영 뒤, 제주에서 더 머무는 날</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              스냅 촬영일은 작가에게 맡기고, 남은 날의 여행 아이디어만 가볍게
              둘러보세요.
            </p>
          </div>
        </div>
        <Link
          href="/spots"
          className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-foreground px-4 text-base font-semibold text-card active:bg-foreground/90"
        >
          제주 여행 아이디어 보기
          <ArrowRight className="size-4" />
        </Link>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
        <p className="text-lg font-semibold">다음에 할 일</p>
        <p className="text-sm leading-6 text-muted-foreground">
          실제 서비스에서는 이 브리프를 바탕으로 작가에게 상담을 요청하고,
          촬영 날짜와 비공개 포토스팟을 함께 확정합니다.
        </p>
        <Link
          href="/artists"
          className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-4 text-base font-semibold text-primary-foreground active:bg-primary/90"
        >
          작가 다시 비교하기
          <ChevronRight className="size-4" />
        </Link>
      </section>

      <CatalogDemoNotice />
    </div>
  );
}

interface ProgressItemProps {
  label: string;
}

function ProgressItem({ label }: ProgressItemProps) {
  return (
    <div className="flex min-h-10 items-center justify-center gap-1 rounded-lg bg-white/10 px-2 text-xs font-medium">
      <Check className="size-3.5" />
      {label}
    </div>
  );
}

interface TeamMemberCardProps {
  icon: typeof Camera;
  label: string;
  name: string;
  description: string;
  price: string;
  href: string;
  actionLabel: string;
}

function TeamMemberCard({
  icon: Icon,
  label,
  name,
  description,
  price,
  href,
  actionLabel,
}: TeamMemberCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-primary">{label}</p>
          <p className="mt-0.5 text-base font-semibold">{name}</p>
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
        <p className="shrink-0 text-sm font-semibold text-primary">{price}</p>
      </div>
      <Link
        href={href}
        className="flex min-h-11 items-center justify-center rounded-md bg-secondary px-4 text-sm font-semibold text-secondary-foreground active:bg-muted"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
