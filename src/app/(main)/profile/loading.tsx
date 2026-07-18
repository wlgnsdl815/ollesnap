import { Skeleton } from "@/shared/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="flex flex-col gap-7 pb-4">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-28 w-full rounded-2xl" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-7 w-28" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="hidden h-20 w-full rounded-2xl sm:block" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-52 w-full rounded-2xl" />
      </div>
    </div>
  );
}
