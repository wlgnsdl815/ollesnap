import { Skeleton } from "@/shared/components/ui/skeleton";

export default function PlannerLoading() {
  return (
    <div className="flex flex-col gap-7 pb-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-72" />
      </div>
      <Skeleton className="h-44 w-full rounded-2xl" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-44 w-full rounded-2xl" />
      </div>
    </div>
  );
}
