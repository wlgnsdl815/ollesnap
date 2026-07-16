"use client";

import { useState } from "react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

import type {
  SnapArtist,
  SnapScene,
  WeddingCatalog,
  WeddingTone,
} from "../../domain/entity/wedding-catalog.entity";
import { ArtistsScreen } from "./artists-screen";
import { StylingScreen } from "./styling-screen";

type WeddingCatalogTab = "artists" | "styling";

interface WeddingCatalogScreenProps {
  catalog: WeddingCatalog;
  initialArtist?: SnapArtist;
  initialScene?: SnapScene;
  initialTab?: WeddingCatalogTab;
  initialTone?: WeddingTone;
  savedArtistCount?: number;
  selectedPackageId?: string;
}

export function WeddingCatalogScreen({
  catalog,
  initialArtist,
  initialScene,
  initialTab = "artists",
  initialTone,
  savedArtistCount = 0,
  selectedPackageId,
}: WeddingCatalogScreenProps) {
  const [activeTab, setActiveTab] = useState<WeddingCatalogTab>(initialTab);

  function handleTabChange(value: string) {
    if (value === "artists" || value === "styling") {
      setActiveTab(value);
    }
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="-mx-4 -mt-6 gap-6"
    >
      <TabsList
        variant="line"
        aria-label="촬영 준비 카테고리"
        className="sticky top-0 z-20 flex h-14! w-full justify-start gap-0 rounded-none bg-background p-0"
      >
        <TabsTrigger
          value="artists"
          className="rounded-none px-4 text-base font-semibold text-muted-foreground data-active:text-primary after:bottom-0! after:bg-primary"
        >
          작가
        </TabsTrigger>
        <TabsTrigger
          value="styling"
          className="rounded-none px-4 text-base font-semibold text-muted-foreground data-active:text-primary after:bottom-0! after:bg-primary"
        >
          샵 · 패키지
        </TabsTrigger>
      </TabsList>
      <TabsContent value="artists" className="px-4">
        {activeTab === "artists" ? (
          <ArtistsScreen
            catalog={catalog}
            initialScene={initialScene}
            initialTone={initialTone}
            savedArtistCount={savedArtistCount}
          />
        ) : null}
      </TabsContent>
      <TabsContent value="styling" className="px-4">
        {activeTab === "styling" ? (
          <StylingScreen
            artist={initialArtist}
            catalog={catalog}
            onSelectArtists={() => setActiveTab("artists")}
            selectedPackageId={selectedPackageId}
          />
        ) : null}
      </TabsContent>
    </Tabs>
  );
}
