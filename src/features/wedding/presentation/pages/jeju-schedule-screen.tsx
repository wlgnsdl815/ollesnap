import { ChevronRight } from "lucide-react";
import Link from "next/link";

import type {
  SavedSnapPlan,
  SavedTravelPlanItem,
} from "@/features/account/domain/entity/user-wedding.entity";
import { SaveSnapPlanCard } from "@/features/account/presentation/components/save-snap-plan-card";
import type { CongestionLevel } from "@/features/photo-spot/domain/entity/congestion-forecast.entity";
import { getCongestionLevelLabel } from "@/features/photo-spot/domain/usecase/congestion.usecase";
import { CONGESTION_TEXT_CLASS } from "@/features/photo-spot/presentation/lib/congestion-visuals";

import type { SnapTeam } from "../../domain/entity/wedding-catalog.entity";
import {
  formatPrice,
  formatPriceFrom,
} from "../../domain/usecase/wedding-catalog.usecase";
import { CatalogDemoNotice } from "../components/catalog-demo-notice";

interface JejuScheduleScreenProps {
  team: SnapTeam | null;
  initialSavedPlan: SavedSnapPlan | null;
  isAuthenticated: boolean;
  travelPlanItems: SavedTravelPlanItem[];
  congestionLevelByItemId: Record<string, CongestionLevel>;
}

export function JejuScheduleScreen({
  team,
  initialSavedPlan,
  isAuthenticated,
  travelPlanItems,
  congestionLevelByItemId,
}: JejuScheduleScreenProps) {
  const stayDateRange = formatStayDateRange(
    initialSavedPlan?.stayStartDate,
    initialSavedPlan?.stayEndDate,
  );
  const shootingDate = initialSavedPlan?.shootingDate
    ? formatKoreanDate(initialSavedPlan.shootingDate)
    : null;

  return (
    <div className="flex flex-col gap-7 pb-4">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-balance">
          촬영일과 머무는 날을 한 흐름으로
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          제주 스냅 촬영 하루와 그 전후 여행 계획을 함께 정리해보세요.
        </p>
      </header>

      <section className="flex flex-col gap-4 rounded-2xl bg-foreground p-5 text-primary-foreground">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-white/70">나의 제주 체류 계획</p>
          <p className="text-xl font-semibold">
            {stayDateRange ?? "아직 체류일을 정하는 중이에요"}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <ScheduleMetric
            label="촬영일"
            value={shootingDate ?? (team ? "작가와 조율 예정" : "작가 선택 후 조율")}
          />
          <ScheduleMetric
            label="제주 체류"
            value={stayDateRange ?? "도착일 · 출발일 입력"}
          />
        </div>
      </section>

      {team ? (
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
          returnPath={buildPlannerHref(team)}
        />
      ) : null}

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">일정에 담은 제주</h2>
        {travelPlanItems.length > 0 ? (
          <div className="flex flex-col rounded-2xl border border-border bg-card px-5">
            {travelPlanItems.map((item) => {
              const congestionLevel = congestionLevelByItemId[item.id];

              return (
                <Link
                  key={item.id}
                  href={
                    item.kind === "food"
                      ? `/spots/food/${item.spotId}`
                      : `/spots/${item.spotId}`
                  }
                  className="flex min-h-16 items-center justify-between gap-3 border-b border-border py-3 last:border-b-0"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">
                        {item.title}
                      </span>
                      <span className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                        <span className="truncate">
                          {item.plannedDate
                            ? formatKoreanDate(item.plannedDate)
                            : item.location ?? "날짜는 나중에 정해도 괜찮아요"}
                        </span>
                        {congestionLevel && (
                          <span
                            className={`shrink-0 font-semibold ${CONGESTION_TEXT_CLASS[congestionLevel]}`}
                          >
                            · {getCongestionLevelLabel(congestionLevel)}
                          </span>
                        )}
                      </span>
                    </span>
                  </span>
                  <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-2 rounded-2xl border border-border bg-muted/50 p-5">
            <p className="text-base font-semibold">여행 장소를 아직 담지 않았어요</p>
            <p className="text-sm leading-6 text-muted-foreground">
              촬영 전후에 가고 싶은 제주 장소를 담아두면 일정에 함께 모아볼 수
              있어요.
            </p>
          </div>
        )}
        <Link
          href="/spots"
          className="flex min-h-11 w-fit items-center gap-1 text-sm font-semibold text-primary"
        >
          제주 여행 아이디어 보기
          <ChevronRight className="size-4" />
        </Link>
      </section>

      {team ? (
        <>
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">촬영일 준비</h2>
              <p className="text-sm font-semibold text-primary">
                {formatPriceFrom(team.totalPriceFrom)}
              </p>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              촬영팀 구성은 일정의 한 부분이에요. 실제 촬영 시간과 장소는
              작가와 상담하며 확정합니다.
            </p>
            <div className="flex flex-col gap-3">
              <TeamMemberCard
                label="스냅 작가 · 촬영 상품"
                name={`${team.artist.studioName} · ${team.snapPackage.name}`}
                description={`${team.snapPackage.durationHours}시간 · 의상 ${team.snapPackage.outfitCountMinimum}~${team.snapPackage.outfitCountMaximum}벌 · 촬영 씬 ${team.snapPackage.sceneCount}개`}
                price={formatPriceFrom(team.snapPackage.price)}
                href={`/artists/${team.artist.id}`}
                actionLabel="작가와 상품 보기"
              />
              <TeamMemberCard
                label={team.hasPartnerStylingPrice ? "제휴 스드메" : "스드메"}
                name={`${team.stylingShop.name} · ${team.stylingProduct.name}`}
                description={team.stylingProduct.includedServices.join(" · ")}
                price={formatPrice(team.stylingPrice.total)}
                href={`/artists?tab=styling&artist=${team.artist.id}&package=${team.snapPackage.id}`}
                actionLabel="스드메 상품 보기"
              />
            </div>
            {team.stylingAddOns.length > 0 ? (
              <div className="rounded-xl bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                선택 옵션:{" "}
                {team.stylingAddOns.map((addOn) => addOn.name).join(" · ")}
              </div>
            ) : null}
          </section>

          <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
            <h2 className="text-lg font-semibold">다음에 할 일</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              촬영일을 작가와 조율한 뒤, 제주에서 머무는 날에 여행 장소를
              나누어 담아보세요.
            </p>
            <Link
              href="/artists"
              className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-4 text-base font-semibold text-primary-foreground active:bg-primary/90"
            >
              작가 다시 비교하기
              <ChevronRight className="size-4" />
            </Link>
          </section>
        </>
      ) : (
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold">촬영일 준비</h2>
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-col gap-1">
              <p className="text-base font-semibold">
                아직 촬영팀을 고르지 않았어요
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                마음에 드는 작가와 촬영 상품을 고르면, 스드메까지 포함한 예상
                비용을 여기에서 한눈에 볼 수 있어요.
              </p>
            </div>
            <Link
              href="/artists"
              className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-4 text-base font-semibold text-primary-foreground active:bg-primary/90"
            >
              작가 고르기
              <ChevronRight className="size-4" />
            </Link>
          </div>
        </section>
      )}

      <CatalogDemoNotice />
    </div>
  );
}

interface ScheduleMetricProps {
  label: string;
  value: string;
}

function ScheduleMetric({ label, value }: ScheduleMetricProps) {
  return (
    <div className="flex min-h-16 flex-col justify-center gap-1 rounded-xl bg-white/10 px-3">
      <p className="text-xs text-white/70">{label}</p>
      <p className="line-clamp-2 text-sm font-semibold">{value}</p>
    </div>
  );
}

interface TeamMemberCardProps {
  label: string;
  name: string;
  description: string;
  price: string;
  href: string;
  actionLabel: string;
}

function TeamMemberCard({
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

function buildPlannerHref(team: SnapTeam) {
  const searchParams = new URLSearchParams({
    artist: team.artist.id,
    package: team.snapPackage.id,
    stylingShop: team.stylingShop.id,
    stylingProduct: team.stylingProduct.id,
  });
  const stylingOptions = team.stylingAddOns.map((addOn) => addOn.id).join(",");

  if (stylingOptions) {
    searchParams.set("stylingOptions", stylingOptions);
  }

  return `/planner?${searchParams.toString()}`;
}

function formatKoreanDate(value: string) {
  return value.replaceAll("-", ".");
}

function formatStayDateRange(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
) {
  if (startDate && endDate) {
    return `${formatKoreanDate(startDate)} ~ ${formatKoreanDate(endDate)}`;
  }

  if (startDate || endDate) {
    return formatKoreanDate(startDate ?? endDate ?? "");
  }

  return null;
}
