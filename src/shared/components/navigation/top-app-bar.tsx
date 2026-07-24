"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BackButton } from "./back-button";

interface ScreenInfo {
  title: string;
  /** 있으면 뒤로가기 버튼을 보여준다. 히스토리가 없을 때 이동할 폴백 경로. */
  backHref?: string;
}

// 탭 루트는 제목만, 하위 화면은 뒤로가기 + 제목. 구체적인 경로부터 매칭한다.
const SCREEN_MATCHERS: Array<{
  match: (pathname: string) => boolean;
  screen: ScreenInfo;
}> = [
  {
    match: (p) => p.startsWith("/spots/food/"),
    screen: { title: "맛집 · 카페", backHref: "/spots" },
  },
  {
    match: (p) => p.startsWith("/spots/"),
    screen: { title: "관광지", backHref: "/spots" },
  },
  {
    match: (p) => p === "/spots",
    screen: { title: "제주 이곳저곳", backHref: "/" },
  },
  {
    match: (p) => p === "/artists/compare",
    screen: { title: "작가 비교", backHref: "/profile" },
  },
  {
    match: (p) => p.startsWith("/artists/"),
    screen: { title: "작가", backHref: "/artists" },
  },
  { match: (p) => p === "/artists", screen: { title: "촬영 준비" } },
  {
    match: (p) => p === "/styling/compare",
    screen: { title: "스드메 샵 비교", backHref: "/profile" },
  },
  {
    match: (p) => p.startsWith("/styling/"),
    screen: { title: "스드메 샵", backHref: "/artists?tab=styling" },
  },
  {
    match: (p) => p === "/styling",
    screen: { title: "스드메", backHref: "/artists" },
  },
  {
    match: (p) => p === "/planner/new",
    screen: { title: "새 일정 만들기", backHref: "/planner" },
  },
  {
    match: (p) => p === "/planner/snap",
    screen: { title: "스냅 작가", backHref: "/planner/new" },
  },
  { match: (p) => p === "/planner", screen: { title: "제주 일정" } },
  { match: (p) => p === "/profile", screen: { title: "내 준비" } },
  {
    match: (p) => p === "/start",
    screen: { title: "촬영 준비 도우미", backHref: "/" },
  },
];

export function TopAppBar() {
  const pathname = usePathname();
  const screen =
    pathname === "/"
      ? null
      : (SCREEN_MATCHERS.find(({ match }) => match(pathname))?.screen ?? null);

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="h-[env(safe-area-inset-top)]" />
      <div className="mx-auto flex h-14 w-full max-w-md items-center gap-1 px-4 sm:max-w-2xl lg:max-w-4xl">
        {screen ? (
          <>
            {screen.backHref ? (
              <BackButton fallbackHref={screen.backHref} />
            ) : null}
            <p className="truncate text-lg font-bold">{screen.title}</p>
          </>
        ) : (
          <Link
            href="/"
            aria-label="올레스냅 홈"
            className="flex min-h-11 items-center"
          >
            <Image
              src="/wordmark.svg"
              alt="올레스냅"
              width={98}
              height={26}
              priority
              unoptimized
            />
          </Link>
        )}
      </div>
    </header>
  );
}
