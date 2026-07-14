import { weddingCatalogMock } from "@/features/wedding/data/mock/wedding-catalog.mock";
import { HomeScreen } from "@/features/home/presentation/pages/home-screen";
import { getUserWeddingState } from "@/features/account/data/server/user-wedding.server";

export default async function HomePage() {
  const userWeddingState = await getUserWeddingState();

  return (
    <HomeScreen
      catalog={weddingCatalogMock}
      isAuthenticated={userWeddingState.isAuthenticated}
    />
  );
}
