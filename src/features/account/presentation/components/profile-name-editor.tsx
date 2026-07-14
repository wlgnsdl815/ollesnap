"use client";

import { Check, PencilLine, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState, useTransition } from "react";

import { updateProfileNameAction } from "../../data/actions/user-wedding.actions";

interface ProfileNameEditorProps {
  initialName: string;
}

export function ProfileNameEditor({ initialName }: ProfileNameEditorProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const result = await updateProfileNameAction(name);
      setMessage(result.message ?? null);

      if (result.ok) {
        setIsEditing(false);
        router.refresh();
      }
    });
  }

  function handleCancel() {
    setName(initialName);
    setMessage(null);
    setIsEditing(false);
  }

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="flex min-h-11 shrink-0 items-center justify-center gap-1 rounded-md bg-secondary px-3 text-sm font-semibold text-secondary-foreground active:bg-muted"
      >
        <PencilLine className="size-4" />
        프로필 수정
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-3 rounded-xl bg-muted/60 p-3"
    >
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        표시 이름
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={30}
          autoFocus
          className="min-h-11 rounded-md border border-input bg-card px-3 text-base font-normal outline-none placeholder:text-muted-foreground focus:border-primary"
        />
      </label>
      {message ? (
        <p className="text-sm text-muted-foreground" role="status">
          {message}
        </p>
      ) : null}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isPending}
          className="flex min-h-11 items-center justify-center gap-1 rounded-md bg-card px-3 text-sm font-semibold text-secondary-foreground active:bg-muted disabled:opacity-50"
        >
          <X className="size-4" />
          취소
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex min-h-11 items-center justify-center gap-1 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground active:bg-primary/90 disabled:opacity-50"
        >
          <Check className="size-4" />
          {isPending ? "저장 중" : "저장"}
        </button>
      </div>
    </form>
  );
}
