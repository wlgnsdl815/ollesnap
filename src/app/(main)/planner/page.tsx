import { CalendarPlus, ChevronRight, ClipboardList } from "lucide-react";
import Link from "next/link";

export default function PlannerPage() {
  return (
    <div className="flex min-h-[calc(100dvh-8rem)] flex-col gap-7 pb-4">
      <section className="flex flex-col gap-2">
        <p className="text-sm font-bold text-primary">플래너</p>
        <h1 className="text-2xl font-black leading-tight text-balance">
          아직 만들어진 일정이 없어요
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          촬영 날짜와 스냅, 스드메를 고르면 첫 번째 제주 스냅 일정이
          만들어집니다.
        </p>
      </section>

      <section className="flex flex-1 items-center">
        <div className="flex w-full flex-col items-center gap-5 rounded-3xl border border-border bg-card p-6 text-center shadow-sm">
          <span className="flex size-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <ClipboardList className="size-10" />
          </span>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-black">첫 일정을 생성해보세요</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              일정은 날짜, 스냅 작가, 스드메 선택 순서로 간단하게 만들 수
              있어요.
            </p>
          </div>
          <Link
            href="/planner/new"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-black text-primary-foreground active:bg-primary/90"
          >
            <CalendarPlus className="size-5" />
            일정 생성하러 가기
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
