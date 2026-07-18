// "프릳츠/제주성산점"처럼 지점명이 슬래시로 붙는 표기를 읽기 쉽게 푼다.
export function formatSpotName(name: string): string {
  return name.replaceAll("/", " ");
}

export function buildMapSearchLink(spotName: string): string {
  return `https://map.kakao.com/link/search/${encodeURIComponent(`제주 ${formatSpotName(spotName)}`)}`;
}
