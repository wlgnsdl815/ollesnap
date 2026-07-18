"use client";

import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";

import { Checkbox } from "@/shared/components/ui/checkbox";

import {
  addCustomPreparationItemAction,
  removeCustomPreparationItemAction,
  setPreparationItemAction,
} from "../../data/actions/preparation.actions";
import {
  buildPreparationChecklist,
  type PreparationItemState,
} from "../../domain/preparation-checklist";

interface PreparationChecklistProps {
  initialStates: PreparationItemState[];
  isAuthenticated: boolean;
  returnPath: string;
}

export function PreparationChecklist({
  initialStates,
  isAuthenticated,
  returnPath,
}: PreparationChecklistProps) {
  const router = useRouter();
  const [states, setStates] = useState(initialStates);
  const [newItemLabel, setNewItemLabel] = useState("");
  const [isAdding, startAddTransition] = useTransition();
  const checklist = buildPreparationChecklist(states);

  function requireLogin(): boolean {
    if (isAuthenticated) {
      return false;
    }

    router.push(`/login?next=${encodeURIComponent(returnPath)}`);
    return true;
  }

  function handleToggle(itemId: string, label: string, isCustom: boolean) {
    if (requireLogin()) {
      return;
    }

    const previousStates = states;
    const existing = states.find((state) => state.itemId === itemId);
    const nextChecked = !(existing?.isChecked ?? false);
    setStates(
      existing
        ? states.map((state) =>
            state.itemId === itemId
              ? { ...state, isChecked: nextChecked }
              : state,
          )
        : [...states, { itemId, label, isChecked: nextChecked, isCustom }],
    );

    void setPreparationItemAction({
      itemId,
      label,
      isChecked: nextChecked,
      isCustom,
    }).then((result) => {
      if (!result.ok) {
        setStates(previousStates);
        toast.error(result.message ?? "준비물을 저장하지 못했어요.");
      }
    });
  }

  function handleAddSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (requireLogin()) {
      return;
    }

    const label = newItemLabel.trim();

    if (!label) {
      return;
    }

    startAddTransition(async () => {
      const result = await addCustomPreparationItemAction(label);

      if (result.ok && result.itemId) {
        setStates((current) => [
          ...current,
          { itemId: result.itemId!, label, isChecked: false, isCustom: true },
        ]);
        setNewItemLabel("");
      } else {
        toast.error(result.message ?? "준비물을 추가하지 못했어요.");
      }
    });
  }

  function handleRemoveCustom(itemId: string) {
    const previousStates = states;
    setStates(states.filter((state) => state.itemId !== itemId));

    void removeCustomPreparationItemAction(itemId).then((result) => {
      if (!result.ok) {
        setStates(previousStates);
        toast.error(result.message ?? "준비물을 빼지 못했어요.");
      }
    });
  }

  return (
    <section id="preparation" className="flex scroll-mt-24 flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-xl font-semibold">촬영 준비물</h2>
        {checklist.checkedCount > 0 ? (
          <p className="text-sm font-semibold text-primary">
            {checklist.checkedCount}/{checklist.totalCount} 챙겼어요
          </p>
        ) : null}
      </div>
      <p className="text-sm leading-6 text-muted-foreground">
        제주 야외 촬영 기준으로 골랐어요. 촬영 전날 하나씩 확인해보세요.
      </p>

      <div className="flex flex-col rounded-2xl border border-border bg-card px-5 py-2">
        {checklist.categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-col border-t border-border pb-2 first:border-t-0"
          >
            <p className="pt-3 pb-1 text-xs font-semibold text-muted-foreground">
              {category.label}
            </p>
            {category.items.map((item) => (
              <ChecklistRow
                key={item.id}
                id={`prep-${item.id}`}
                label={item.label}
                isChecked={item.isChecked}
                onToggle={() => handleToggle(item.id, item.label, false)}
              />
            ))}
          </div>
        ))}

        {checklist.customItems.length > 0 ? (
          <div className="flex flex-col border-t border-border pb-2">
            <p className="pt-3 pb-1 text-xs font-semibold text-muted-foreground">
              직접 챙길 것
            </p>
            {checklist.customItems.map((item) => (
              <ChecklistRow
                key={item.id}
                id={`prep-${item.id}`}
                label={item.label}
                isChecked={item.isChecked}
                onToggle={() => handleToggle(item.id, item.label, true)}
                onRemove={() => handleRemoveCustom(item.id)}
              />
            ))}
          </div>
        ) : null}

        <form
          onSubmit={handleAddSubmit}
          className="flex items-center gap-2 border-t border-border py-3"
        >
          <input
            type="text"
            value={newItemLabel}
            maxLength={40}
            onChange={(event) => setNewItemLabel(event.target.value)}
            placeholder="더 챙길 것이 있나요?"
            aria-label="준비물 직접 추가"
            className="min-h-11 min-w-0 flex-1 rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground"
          />
          <button
            type="submit"
            disabled={isAdding || !newItemLabel.trim()}
            className="flex min-h-11 shrink-0 items-center gap-1 rounded-md bg-secondary px-4 text-sm font-semibold text-secondary-foreground active:bg-muted disabled:opacity-50"
          >
            <Plus className="size-4" />
            추가
          </button>
        </form>
      </div>
    </section>
  );
}

interface ChecklistRowProps {
  id: string;
  label: string;
  isChecked: boolean;
  onToggle: () => void;
  onRemove?: () => void;
}

function ChecklistRow({
  id,
  label,
  isChecked,
  onToggle,
  onRemove,
}: ChecklistRowProps) {
  return (
    <div className="flex min-h-11 items-center gap-3">
      <Checkbox id={id} checked={isChecked} onCheckedChange={onToggle} />
      <label
        htmlFor={id}
        className={`min-w-0 flex-1 truncate py-2.5 text-sm ${
          isChecked ? "text-muted-foreground" : "text-foreground"
        }`}
      >
        {label}
      </label>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`${label} 빼기`}
          className="flex size-11 shrink-0 items-center justify-center text-muted-foreground active:text-foreground"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
