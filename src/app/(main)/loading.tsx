import { Skeleton } from "@/shared/components/ui/skeleton";

// 홈(히어로형)과 상세 화면(큰 이미지 + 본문)의 공통 폴백 스켈레톤.
export default function Loading() {
  return (
    <div className="flex flex-col gap-7 pb-4">
      <Skeleton className="min-h-112 w-full rounded-3xl" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    </div>
  );
}
