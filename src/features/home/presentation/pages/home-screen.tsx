import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import type { WeddingCatalog } from "@/features/wedding/domain/entity/wedding-catalog.entity";

import { HomeTastePicker } from "../components/home-taste-picker";

interface HomeScreenProps {
  catalog: WeddingCatalog;
}

const PREPARATION_STEPS = [
  {
    title: "취향으로 작가 찾기",
    description:
      "씬과 톤으로 추려 보고, 마음에 드는 작가를 두세 명 찜해 나란히 비교해요.",
  },
  {
    title: "촬영팀 만들기",
    description:
      "고른 작가의 상품에 제휴 스드메를 묶으면 예상 총비용까지 한 번에 보여요.",
  },
  {
    title: "제주 일정으로 잇기",
    description:
      "촬영일과 머무는 날을 정하고, 촬영 전후에 갈 곳을 일정에 담아요.",
  },
];

export function HomeScreen({ catalog }: HomeScreenProps) {
  return (
    <div className="flex flex-col gap-10 pb-4">
      <section className="relative min-h-112 overflow-hidden rounded-3xl bg-foreground text-white">
        <Image
          src="/images/jeju-snap-hero.png"
          alt="제주 해안에서 웨딩 스냅을 촬영하는 커플"
          fill
          priority
          sizes="(min-width: 1024px) 896px, (min-width: 640px) 672px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-black/5" />
        <div className="relative flex min-h-112 flex-col justify-between p-5">
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
            <div className="flex flex-col gap-2">
              <Link
                href="/artists"
                className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-4 text-base font-semibold text-primary-foreground active:bg-primary/90"
              >
                내 취향의 작가 찾기
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/start"
                className="flex min-h-11 items-center justify-center rounded-md bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur active:bg-white/20"
              >
                아직 아무것도 못 골랐어요
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FullBleedBand className="bg-cream py-10">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            취향을 먼저 골라볼까요?
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            여기서 고른 씬과 톤 그대로 작가 목록으로 이어져요. 나중에 바꿔도
            괜찮아요.
          </p>
        </div>
        <HomeTastePicker scenes={catalog.scenes} tones={catalog.tones} />
      </FullBleedBand>

      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            제주 스냅, 이렇게 준비해요
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            세 걸음이면 촬영과 여행이 하나의 일정으로 정리돼요.
          </p>
        </div>
        <ol className="flex flex-col">
          {PREPARATION_STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {index + 1}
                </span>
                {index < PREPARATION_STEPS.length - 1 ? (
                  <span className="w-px flex-1 bg-border" />
                ) : null}
              </div>
              <div
                className={`flex flex-col gap-1 ${
                  index < PREPARATION_STEPS.length - 1 ? "pb-7" : ""
                }`}
              >
                <p className="text-base font-semibold leading-7">{step.title}</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

interface FullBleedBandProps {
  className?: string;
  children: ReactNode;
}

// 레이아웃의 max-w 컨테이너를 벗어나 화면 전체 폭으로 배경을 까는 섹션 밴드.
// 내부 컨테이너 폭은 (main)/layout.tsx의 main 컨테이너와 동일하게 유지해야 한다.
function FullBleedBand({ className = "", children }: FullBleedBandProps) {
  return (
    <section className={`mx-[calc(50%-50vw)] ${className}`}>
      <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 sm:max-w-2xl lg:max-w-4xl">
        {children}
      </div>
    </section>
  );
}
