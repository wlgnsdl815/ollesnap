"use client";

import { useState } from "react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

import type { PhotoSpot } from "../../domain/entity/photo-spot.entity";
import { FoodSpotsInfiniteGrid } from "./food-spots-infinite-grid";
import { SnapSpotsInfiniteGrid } from "./snap-spots-infinite-grid";

type JejuExploreTab = "sights" | "food";

interface JejuExploreScreenProps {
  initialSpots: PhotoSpot[];
  initialSpotsHasMore: boolean;
}

export function JejuExploreScreen({
  initialSpots,
  initialSpotsHasMore,
}: JejuExploreScreenProps) {
  const [activeTab, setActiveTab] = useState<JejuExploreTab>("sights");

  function handleTabChange(value: string) {
    if (value === "sights" || value === "food") {
      setActiveTab(value);
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="gap-6">
      <TabsList
        variant="line"
        aria-label="제주 이곳저곳 카테고리"
        className="flex h-11! w-full justify-start gap-0 rounded-none bg-background p-0"
      >
        <TabsTrigger
          value="sights"
          className="rounded-none px-4 text-base font-semibold text-muted-foreground data-active:text-primary after:bottom-0! after:bg-primary"
        >
          관광지
        </TabsTrigger>
        <TabsTrigger
          value="food"
          className="rounded-none px-4 text-base font-semibold text-muted-foreground data-active:text-primary after:bottom-0! after:bg-primary"
        >
          맛집 · 카페
        </TabsTrigger>
      </TabsList>
      <TabsContent value="sights">
        {activeTab === "sights" ? (
          <SnapSpotsInfiniteGrid
            initialSpots={initialSpots}
            initialHasMore={initialSpotsHasMore}
          />
        ) : null}
      </TabsContent>
      <TabsContent value="food">
        {activeTab === "food" ? <FoodSpotsInfiniteGrid /> : null}
      </TabsContent>
    </Tabs>
  );
}
