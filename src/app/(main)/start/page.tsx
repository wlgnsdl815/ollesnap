import { getWeddingCatalog } from "@/features/wedding/data/server/get-wedding-catalog";
import { PreparationGuideScreen } from "@/features/wedding/presentation/pages/preparation-guide-screen";

export const metadata = {
  title: "촬영 준비 도우미",
};

export default async function PreparationGuidePage() {
  const catalog = await getWeddingCatalog();

  return <PreparationGuideScreen catalog={catalog} />;
}
