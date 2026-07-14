import {
  CalendarDays,
  Camera,
  ChevronRight,
  Heart,
  Map,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getUserWeddingState } from "@/features/account/data/server/user-wedding.server";
import {
  generateProfileName,
  getProfileName,
} from "@/features/account/domain/usecase/profile-name.usecase";
import { ProfileNameEditor } from "@/features/account/presentation/components/profile-name-editor";
import { weddingCatalogMock } from "@/features/wedding/data/mock/wedding-catalog.mock";
import {
  formatPriceFrom,
  resolveSnapTeam,
} from "@/features/wedding/domain/usecase/wedding-catalog.usecase";
import { createClient } from "@/shared/supabase/server";

import { SignOutButton } from "./sign-out-button";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/profile");
  }

  const userWeddingState = await getUserWeddingState();
  const savedArtists = weddingCatalogMock.artists.filter((artist) =>
    userWeddingState.savedArtistIds.includes(artist.id),
  );
  const savedPlan = userWeddingState.snapPlan;
  const savedTeam =
    savedPlan?.artistId &&
    savedPlan.dressId &&
    savedPlan.makeupId
    ? resolveSnapTeam(weddingCatalogMock, {
        artistId: savedPlan.artistId,
        packageId: savedPlan.packageId ?? undefined,
        dressId: savedPlan.dressId,
        makeupId: savedPlan.makeupId,
      })
    : null;
  const existingProfileName = getProfileName(user.user_metadata);
  const generatedProfileName = existingProfileName
    ? undefined
    : generateProfileName();

  if (generatedProfileName) {
    await supabase.auth.updateUser({
      data: { full_name: generatedProfileName },
    });
  }

  const displayName =
    existingProfileName ?? generatedProfileName ?? user.email ?? "올레스냅 사용자";
  const avatarUrl: string | undefined =
    user.user_metadata.avatar_url ?? user.user_metadata.picture;

  return (
    <div className="flex flex-col gap-7 pb-4">
      <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-4">
          <span className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">
            {avatarUrl ? (
              // OAuth 공급자가 반환하는 CDN 주소는 고정되지 않아 Next 이미지 최적화를 거치지 않아요.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt=""
                referrerPolicy="no-referrer"
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <UserRound className="size-7" />
            )}
          </span>
          <div className="flex min-w-0 flex-col gap-1">
            <p className="truncate text-lg font-semibold">{displayName}</p>
            {user.email ? (
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            ) : null}
          </div>
        </div>
        <ProfileNameEditor initialName={displayName} />
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Camera className="size-5 text-primary" />
          <h1 className="text-xl font-semibold">저장한 촬영팀</h1>
        </div>
        {savedTeam ? (
          <Link
            href="/planner"
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 active:bg-muted"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <p className="text-base font-semibold">{savedTeam.artist.studioName}</p>
                <p className="text-sm leading-5 text-muted-foreground">
                  {savedTeam.snapPackage.name} · {savedTeam.dress.name} · {savedTeam.makeup.name}
                </p>
              </div>
              <ChevronRight className="size-5 text-muted-foreground" />
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {savedPlan?.shootingDate ? (
                <span className="rounded-full bg-secondary px-3 py-1.5">
                  촬영 {formatKoreanDate(savedPlan.shootingDate)}
                </span>
              ) : null}
              <span className="rounded-full bg-secondary px-3 py-1.5">
                {formatPriceFrom(savedTeam.totalPriceFrom)}
              </span>
            </div>
          </Link>
        ) : (
          <EmptyState
            description="마음에 드는 작가와 스드메를 고르면 촬영팀이 여기에 저장돼요."
            href="/artists"
            label="작가 둘러보기"
          />
        )}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Heart className="size-5 text-primary" />
            <h2 className="text-xl font-semibold">찜한 작가</h2>
          </div>
          <span className="text-sm text-muted-foreground">{savedArtists.length}명</span>
        </div>
        {savedArtists.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {savedArtists.map((artist) => (
              <Link
                key={artist.id}
                href={`/artists/${artist.id}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 active:bg-muted"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Camera className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{artist.studioName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {artist.artistName} 작가 · {artist.keywords.join(" · ")}
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            description="마음에 드는 작가의 상세 화면에서 찜을 누르면 여기서 다시 비교할 수 있어요."
            href="/artists"
            label="작가 찾기"
          />
        )}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Map className="size-5 text-primary" />
          <h2 className="text-xl font-semibold">제주 체류 일정</h2>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
          {savedPlan?.stayStartDate || savedPlan?.stayEndDate ? (
            <div className="flex items-center gap-2 text-sm text-secondary-foreground">
              <CalendarDays className="size-4 text-primary" />
              <span>
                {formatStayDateRange(
                  savedPlan?.stayStartDate,
                  savedPlan?.stayEndDate,
                )}
              </span>
            </div>
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">
              촬영팀에서 제주 도착일과 출발일을 저장해보세요.
            </p>
          )}
          {userWeddingState.travelPlanItems.length > 0 ? (
            <div className="flex flex-col divide-y divide-border">
              {userWeddingState.travelPlanItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/spots/${item.spotId}`}
                  className="flex min-h-12 items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{item.title}</p>
                    {item.location ? (
                      <p className="truncate text-xs text-muted-foreground">
                        {item.location}
                      </p>
                    ) : null}
                  </div>
                  <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
                </Link>
              ))}
            </div>
          ) : null}
          <Link
            href="/spots"
            className="flex min-h-11 items-center gap-1 text-sm font-semibold text-primary"
          >
            여행 아이디어 둘러보기
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </section>

      <SignOutButton />
    </div>
  );
}

interface EmptyStateProps {
  description: string;
  href: string;
  label: string;
}

function EmptyState({ description, href, label }: EmptyStateProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/50 p-5">
      <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      <Link
        href={href}
        className="flex min-h-11 items-center gap-1 text-sm font-semibold text-primary"
      >
        {label}
        <ChevronRight className="size-4" />
      </Link>
    </div>
  );
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

  return formatKoreanDate(startDate ?? endDate ?? "");
}
