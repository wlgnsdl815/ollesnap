"use client";

import { useState, useTransition } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { updateTravelPlanItemDateAction } from "../../data/actions/user-wedding.actions";

const UNSET_VALUE = "unset";

interface TravelPlanItemDateSelectProps {
  itemId: string;
  initialDate: string | null;
  /** 체류 기간의 날짜 목록 (ISO). 비어 있으면 자유 날짜 입력으로 대신한다. */
  stayDates: string[];
}

export function TravelPlanItemDateSelect({
  itemId,
  initialDate,
  stayDates,
}: TravelPlanItemDateSelectProps) {
  const [value, setValue] = useState(initialDate ?? "");
  const [isPending, startTransition] = useTransition();

  function handleChange(nextValue: string) {
    const previousValue = value;
    setValue(nextValue);

    startTransition(async () => {
      const result = await updateTravelPlanItemDateAction(
        itemId,
        nextValue || null,
      );

      if (!result.ok) {
        setValue(previousValue);
      }
    });
  }

  if (stayDates.length === 0) {
    return (
      <input
        type="date"
        value={value}
        disabled={isPending}
        onChange={(event) => handleChange(event.target.value)}
        aria-label="방문 날짜"
        className="min-h-11 rounded-lg border border-input bg-card px-2 text-xs font-semibold text-foreground outline-none focus:border-foreground disabled:opacity-60"
      />
    );
  }

  const dateOptions =
    value && !stayDates.includes(value) ? [value, ...stayDates] : stayDates;
  const items = [
    { value: UNSET_VALUE, label: "날짜 미정" },
    ...dateOptions.map((date) => ({ value: date, label: formatShortDate(date) })),
  ];

  return (
    <Select
      items={items}
      value={value || UNSET_VALUE}
      onValueChange={(nextValue) =>
        handleChange(nextValue === UNSET_VALUE ? "" : String(nextValue))
      }
      disabled={isPending}
    >
      <SelectTrigger
        aria-label="방문 날짜"
        className={`shrink-0 bg-card text-xs font-semibold data-[size=default]:h-11 ${
          value ? "" : "text-muted-foreground"
        }`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function formatShortDate(dateIso: string): string {
  const date = new Date(`${dateIso}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateIso;
  }

  return `${date.getMonth() + 1}.${date.getDate()} (${WEEKDAY_LABELS[date.getDay()]})`;
}
