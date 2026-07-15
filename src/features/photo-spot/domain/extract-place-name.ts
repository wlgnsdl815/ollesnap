// 촬영 장소 설명("제주시 애월읍, ~카페 앞")에서 검색용 장소명만 뽑아낸다.
export function extractPlaceName(location: string): string {
  const segments = location.split(",").map((segment) => segment.trim());

  return segments[segments.length - 1] ?? "";
}
