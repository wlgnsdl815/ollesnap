import { weddingCatalogMock } from "@/features/wedding/data/mock/wedding-catalog.mock";
import { HomeScreen } from "@/features/home/presentation/pages/home-screen";

export default function HomePage() {
  return <HomeScreen catalog={weddingCatalogMock} />;
}
