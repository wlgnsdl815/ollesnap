import { getWeddingCatalog } from "@/features/wedding/data/server/get-wedding-catalog";
import { PreparationGuideScreen } from "@/features/wedding/presentation/pages/preparation-guide-screen";

export default async function PreparationGuidePage() {
  const catalog = await getWeddingCatalog();

  return <PreparationGuideScreen catalog={catalog} />;
}
