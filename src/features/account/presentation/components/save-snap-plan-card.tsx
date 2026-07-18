"use client";

import { CheckCircle2, LogIn, Save } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useState, useTransition } from "react";

import type { SavedSnapPlan } from "../../domain/entity/user-wedding.entity";
import {
  saveSnapPlanAction,
  type SaveSnapPlanInput,
} from "../../data/actions/user-wedding.actions";

interface SaveSnapPlanCardProps {
  plan: SaveSnapPlanInput;
  initialSavedPlan: SavedSnapPlan | null;
  isAuthenticated: boolean;
  returnPath: string;
  shootingDate: string;
  onShootingDateChange: (value: string) => void;
}

export function SaveSnapPlanCard({
  plan,
  initialSavedPlan,
  isAuthenticated,
  returnPath,
  shootingDate,
  onShootingDateChange,
}: SaveSnapPlanCardProps) {
  const [stayStartDate, setStayStartDate] = useState(
    initialSavedPlan?.stayStartDate ?? "",
  );
  const [stayEndDate, setStayEndDate] = useState(
    initialSavedPlan?.stayEndDate ?? "",
  );
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await saveSnapPlanAction({
        ...plan,
        shootingDate: shootingDate || null,
        stayStartDate: stayStartDate || null,
        stayEndDate: stayEndDate || null,
      });

      setMessage(
        result.ok
          ? "제주 일정과 촬영 구성을 계정에 저장했어요."
          : (result.message ?? "저장하지 못했어요."),
      );
    });
  }

  if (!isAuthenticated) {
    return (
      <section
        id="jeju-dates"
        className="flex scroll-mt-24 flex-col gap-3 rounded-2xl border border-border bg-card p-5"
      >
        <div className="flex flex-col gap-1">
          <p className="text-lg font-semibold">이 제주 일정을 저장할까요?</p>
          <p className="text-sm leading-6 text-muted-foreground">
            로그인하면 촬영 구성과 제주 체류 일정을 다음에도 이어서 볼 수 있어요.
          </p>
        </div>
        <Link
          href={`/login?next=${encodeURIComponent(returnPath)}`}
          className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-4 text-base font-semibold text-primary-foreground active:bg-primary/90"
        >
          <LogIn className="size-4" />
          로그인하고 저장하기
        </Link>
      </section>
    );
  }

  return (
    <section
      id="jeju-dates"
      className="flex scroll-mt-24 flex-col gap-4 rounded-2xl border border-border bg-card p-5"
    >
      <div className="flex flex-col gap-1">
        <p className="text-lg font-semibold">내 제주 일정에 저장</p>
        <p className="text-sm leading-6 text-muted-foreground">
          촬영일과 제주 체류일을 함께 저장하면 여행 아이디어도 같은 계정에
          모입니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <DateField
          label="촬영 예정일"
          value={shootingDate}
          onChange={onShootingDateChange}
        />
        <div className="grid grid-cols-2 gap-3">
          <DateField
            label="제주 도착일"
            value={stayStartDate}
            onChange={setStayStartDate}
          />
          <DateField
            label="제주 출발일"
            value={stayEndDate}
            min={stayStartDate || undefined}
            onChange={setStayEndDate}
          />
        </div>
        {message ? (
          <p
            className={`text-sm leading-5 ${
              message.includes("저장했어요")
                ? "text-primary"
                : "text-destructive"
            }`}
          >
            {message}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={isPending}
          className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-4 text-base font-semibold text-primary-foreground active:bg-primary/90 disabled:opacity-60"
        >
          {isPending ? <Save className="size-4 animate-pulse" /> : <CheckCircle2 className="size-4" />}
          {initialSavedPlan ? "내 일정 업데이트" : "내 일정에 저장"}
        </button>
      </form>
    </section>
  );
}

interface DateFieldProps {
  label: string;
  value: string;
  min?: string;
  onChange: (value: string) => void;
}

function DateField({ label, value, min, onChange }: DateFieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-secondary-foreground">{label}</span>
      <input
        type="date"
        value={value}
        min={min}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none focus:border-foreground"
      />
    </label>
  );
}
