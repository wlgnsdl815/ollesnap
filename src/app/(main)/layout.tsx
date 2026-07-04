import type { ReactNode } from "react";

import { BottomTabBar } from "@/shared/components/navigation/bottom-tab-bar";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <main className="mx-auto w-full max-w-md flex-1 px-4 pt-6 pb-24 sm:max-w-2xl lg:max-w-4xl">
        {children}
      </main>
      <BottomTabBar />
    </div>
  );
}
