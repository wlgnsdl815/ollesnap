import { HomeScreen } from "@/features/home/presentation/pages/home-screen";
import { getWeddingCatalog } from "@/features/wedding/data/server/get-wedding-catalog";

export default async function HomePage() {
  const catalog = await getWeddingCatalog();

  return <HomeScreen catalog={catalog} />;
}
