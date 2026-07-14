interface ProfileMetadata {
  full_name?: unknown;
  name?: unknown;
  nickname?: unknown;
}

const PROFILE_NAME_PREFIXES = [
  "다정한",
  "설레는",
  "여유로운",
  "반짝이는",
  "포근한",
  "맑은",
  "기분 좋은",
  "바람을 닮은",
  "햇살 같은",
  "노을빛",
  "따스한",
  "싱그러운",
  "은은한",
  "고요한",
  "푸른",
  "눈부신",
  "여행을 닮은",
  "자유로운",
  "산뜻한",
  "감성 가득한",
  "별빛 어린",
];

const PROFILE_NAME_NOUNS = [
  "동백",
  "파도",
  "오름",
  "돌고래",
  "구름",
  "갈매기",
  "햇살",
  "제주 바람",
  "유채꽃",
  "현무암",
  "등대",
  "해안길",
  "감귤",
  "억새",
  "노을",
  "별하늘",
  "숲길",
  "바닷길",
  "새벽",
  "물결",
  "무지개",
];

export function getProfileName(metadata: unknown): string | undefined {
  if (!isProfileMetadata(metadata)) {
    return undefined;
  }

  return [metadata.full_name, metadata.name, metadata.nickname].find(
    (value): value is string =>
      typeof value === "string" && value.trim().length > 0,
  );
}

export function generateProfileName(random = Math.random): string {
  const prefix = getRandomItem(PROFILE_NAME_PREFIXES, random);
  const noun = getRandomItem(PROFILE_NAME_NOUNS, random);
  const suffix = Math.floor(random() * 9_000) + 1_000;

  return `${prefix} ${noun} ${suffix}`;
}

function isProfileMetadata(value: unknown): value is ProfileMetadata {
  return typeof value === "object" && value !== null;
}

function getRandomItem(items: string[], random: () => number): string {
  const index = Math.min(items.length - 1, Math.floor(random() * items.length));

  return items[index];
}
