import { weddingCatalogMock } from "@/features/wedding/data/mock/wedding-catalog.mock";
import { PreparationGuideScreen } from "@/features/wedding/presentation/pages/preparation-guide-screen";

export default function PreparationGuidePage() {
  return <PreparationGuideScreen catalog={weddingCatalogMock} />;
}
