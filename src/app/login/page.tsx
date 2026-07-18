import { CalendarDays, Heart, Map } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { BackButton } from "@/shared/components/navigation/back-button";
import { getServerUser } from "@/shared/supabase/get-server-user";

import { LoginForm } from "./login-form";

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

export const metadata = {
  title: "로그인",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const query = await searchParams;
  const user = await getServerUser();

  if (user) {
    redirect(getSafeNextPath(query.next));
  }

  const nextPath = getSafeNextPath(query.next);
  const backHref = nextPath === "/profile" ? "/" : nextPath;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="h-[env(safe-area-inset-top)]" />
        <div className="mx-auto flex h-14 w-full max-w-md items-center justify-between px-4 sm:max-w-2xl sm:px-6 lg:max-w-5xl">
          <BackButton fallbackHref={backHref} />
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
              unoptimized
            />
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 py-5 sm:max-w-2xl sm:px-6 lg:max-w-5xl lg:justify-center">
        <div className="flex flex-1 flex-col justify-center gap-8 py-10 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <section className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
                고른 취향과 일정을
                <br />
                계정에 이어두세요
              </h1>
              <p className="max-w-md text-sm leading-6 text-muted-foreground">
                마음에 든 작가, 촬영팀, 제주에서 더 머무는 날의 여행 아이디어를
                언제든 이어서 볼 수 있어요.
              </p>
            </div>
            <div className="grid gap-3 rounded-2xl bg-accent p-4 sm:grid-cols-3 lg:grid-cols-1">
              <Benefit icon={Heart} text="찜한 작가를 다시 비교해요" />
              <Benefit icon={CalendarDays} text="촬영팀과 체류일을 저장해요" />
              <Benefit icon={Map} text="여행 아이디어를 한곳에 모아요" />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <LoginForm nextPath={nextPath} />
          </section>
        </div>
      </main>
    </div>
  );
}

interface BenefitProps {
  icon: typeof Heart;
  text: string;
}

function Benefit({ icon: Icon, text }: BenefitProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-card text-primary">
        <Icon className="size-4" />
      </span>
      <p className="text-sm leading-5 text-secondary-foreground">{text}</p>
    </div>
  );
}

function getSafeNextPath(nextPath: string | undefined) {
  if (nextPath?.startsWith("/") && !nextPath.startsWith("//")) {
    return nextPath;
  }

  return "/";
}
