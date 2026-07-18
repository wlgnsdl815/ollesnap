import type { SavedTravelPlanItem } from "@/features/account/domain/entity/user-wedding.entity";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { createRelatedSpotRepository } from "../../data/repository/related-spot.repository.impl";
import { extractPlaceName } from "../../domain/extract-place-name";
import { buildCourseSuggestions } from "../../domain/usecase/related-spots.usecase";
import { CourseSuggestions } from "./course-suggestions";

const relatedSpotRepository = createRelatedSpotRepository();

// 일정에 담은 장소가 많아도 코스 추천용 연관 관광지 조회는 앞쪽 몇 곳이면 충분하다.
const COURSE_SUGGESTION_BASE_MAXIMUM = 3;

interface CourseSuggestionsSectionProps {
  travelPlanItems: SavedTravelPlanItem[];
}

// 연관 관광지 API 호출이 화면 진입을 막지 않도록
// Suspense 경계 안에서 스스로 데이터를 불러오는 서버 컴포넌트.
export async function CourseSuggestionsSection({
  travelPlanItems,
}: CourseSuggestionsSectionProps) {
  const bases = await Promise.all(
    travelPlanItems
      .filter((item) => item.kind === "sight")
      .slice(0, COURSE_SUGGESTION_BASE_MAXIMUM)
      .map(async (item) => ({
        title: item.title,
        spots: await relatedSpotRepository.getRelatedSpots(
          extractPlaceName(item.location ?? item.title),
        ),
      })),
  );
  const groups = buildCourseSuggestions(
    bases,
    travelPlanItems.map((item) => item.title),
  );

  return <CourseSuggestions groups={groups} />;
}

export function CourseSuggestionsFallback() {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">함께 가면 좋은 곳</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          담아둔 장소와 함께 가기 좋은 곳을 찾는 중이에요.
        </p>
      </div>
      <div className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-11 w-28 rounded-full" />
            <Skeleton className="h-11 w-24 rounded-full" />
            <Skeleton className="h-11 w-32 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
