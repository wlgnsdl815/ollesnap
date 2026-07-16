"use client";

import { Camera, ClipboardList, House, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface TabItem {
  href: string;
  label: string;
  icon: typeof House;
  activePaths?: string[];
}

const TAB_ITEMS: TabItem[] = [
  { href: "/", label: "홈", icon: House },
  {
    href: "/artists",
    label: "촬영 준비",
    icon: Camera,
    activePaths: ["/artists", "/styling"],
  },
  { href: "/planner", label: "제주 일정", icon: ClipboardList },
  { href: "/profile", label: "내 준비", icon: UserRound },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="주요 화면 이동"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80"
    >
      <ul className="mx-auto flex w-full max-w-md items-stretch justify-around px-2 sm:max-w-2xl lg:max-w-4xl">
        {TAB_ITEMS.map((item) => {
          const isActive = item.activePaths
            ? item.activePaths.some((path) => pathname.startsWith(path))
            : item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-11 flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors
                  ${isActive ? "text-primary" : "text-muted-foreground"}`}
              >
                <item.icon
                  className="size-5"
                  strokeWidth={isActive ? 2.4 : 2}
                />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
