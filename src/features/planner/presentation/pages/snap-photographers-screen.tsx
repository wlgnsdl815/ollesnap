import { UserRound } from "lucide-react";

export function SnapPhotographersScreen() {
  return (
    <div className="flex min-h-[calc(100dvh-8rem)] flex-col gap-7 pb-4">
      <header className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-black leading-tight text-balance">
            스냅작가를 모아볼 페이지예요
          </h1>
        </div>
      </header>

      <section className="flex flex-1 items-center">
        <div className="flex w-full flex-col items-center gap-4 rounded-3xl border border-border bg-card p-6 text-center shadow-sm">
          <span className="flex size-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <UserRound className="size-10" />
          </span>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-black">작가 데이터 연결 준비 중</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              추후 이 화면에서 작가님 포트폴리오와 예약 가능 일정을 비교할 수
              있습니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
