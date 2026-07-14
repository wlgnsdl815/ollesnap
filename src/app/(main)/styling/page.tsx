import { redirect } from "next/navigation";

interface StylingPageProps {
  searchParams: Promise<{
    artist?: string;
    package?: string;
  }>;
}

export default async function StylingPage({ searchParams }: StylingPageProps) {
  const query = await searchParams;
  const redirectParams = new URLSearchParams({ tab: "styling" });

  if (query.artist) {
    redirectParams.set("artist", query.artist);
  }

  if (query.package) {
    redirectParams.set("package", query.package);
  }

  redirect(`/artists?${redirectParams.toString()}`);
}
