export const tourismCrowdQueryKeys = {
  all: ["tourism-crowd"] as const,
  jeju: () => [...tourismCrowdQueryKeys.all, "jeju"] as const,
};
