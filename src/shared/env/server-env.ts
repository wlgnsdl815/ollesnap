export interface ServerEnv {
  tourApiServiceKey?: string;
  tourApiKorServiceKey?: string;
  tourApiTourismCrowdServiceKey?: string;
  tourApiRelatedAttractionServiceKey?: string;
  tourApiPhotoAwardServiceKey?: string;
}

export function getServerEnv(): ServerEnv {
  const tourApiServiceKey = normalizeOptionalEnv(
    process.env.TOUR_API_SERVICE_KEY,
  );

  return {
    tourApiServiceKey,
    tourApiKorServiceKey:
      normalizeOptionalEnv(process.env.TOUR_API_KOR_SERVICE_KEY) ??
      tourApiServiceKey,
    tourApiTourismCrowdServiceKey:
      normalizeOptionalEnv(process.env.TOUR_API_TOURISM_CROWD_SERVICE_KEY) ??
      tourApiServiceKey,
    tourApiRelatedAttractionServiceKey:
      normalizeOptionalEnv(
        process.env.TOUR_API_RELATED_ATTRACTION_SERVICE_KEY,
      ) ?? tourApiServiceKey,
    tourApiPhotoAwardServiceKey:
      normalizeOptionalEnv(process.env.TOUR_API_PHOTO_AWARD_SERVICE_KEY) ??
      tourApiServiceKey,
  };
}

function normalizeOptionalEnv(value: string | undefined): string | undefined {
  const normalizedValue = value?.trim();

  return normalizedValue ? normalizedValue : undefined;
}
