"use client";

import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type {
  SnapScene,
  SnapSceneOption,
  WeddingTone,
  WeddingToneOption,
} from "@/features/wedding/domain/entity/wedding-catalog.entity";
import {
  SCENE_IMAGES,
  TONE_PHOTO_FILTERS,
} from "@/features/wedding/presentation/lib/scene-tone-visuals";

interface HomeTastePickerProps {
  scenes: SnapSceneOption[];
  tones: WeddingToneOption[];
}

export function HomeTastePicker({ scenes, tones }: HomeTastePickerProps) {
  const [selectedScene, setSelectedScene] = useState<SnapScene | undefined>();
  const [selectedTone, setSelectedTone] = useState<WeddingTone | undefined>();

  const sceneLabel = scenes.find((scene) => scene.id === selectedScene)?.label;
  const toneLabel = tones.find((tone) => tone.id === selectedTone)?.label;
  const selectionSummary = [sceneLabel, toneLabel ? `${toneLabel} 톤` : null]
    .filter(Boolean)
    .join(" · ");

  const searchParams = new URLSearchParams();

  if (selectedScene) {
    searchParams.set("scene", selectedScene);
  }

  if (selectedTone) {
    searchParams.set("tone", selectedTone);
  }

  const artistsHref = searchParams.size
    ? `/artists?${searchParams.toString()}`
    : "/artists";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold">촬영 씬</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {scenes.map((scene) => (
            <button
              key={scene.id}
              type="button"
              aria-pressed={selectedScene === scene.id}
              onClick={() =>
                setSelectedScene((currentScene) =>
                  currentScene === scene.id ? undefined : scene.id,
                )
              }
              className={`relative aspect-4/5 overflow-hidden rounded-2xl text-left transition-shadow ${
                selectedScene === scene.id
                  ? "ring-3 ring-primary ring-offset-2 ring-offset-cream"
                  : ""
              }`}
            >
              <Image
                src={SCENE_IMAGES[scene.id]}
                alt={scene.label}
                fill
                sizes="(min-width: 640px) 220px, 45vw"
                className="object-cover"
              />
              <span className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
              {selectedScene === scene.id ? (
                <span className="absolute top-2.5 right-2.5 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-4" />
                </span>
              ) : null}
              <span className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-3.5">
                <span className="text-base font-semibold text-white">
                  {scene.label}
                </span>
                <span className="text-xs leading-4 text-white/80">
                  {scene.description}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold">사진 톤</p>
        <div className="grid grid-cols-2 gap-3">
          {tones.map((tone) => (
            <button
              key={tone.id}
              type="button"
              aria-pressed={selectedTone === tone.id}
              onClick={() =>
                setSelectedTone((currentTone) =>
                  currentTone === tone.id ? undefined : tone.id,
                )
              }
              className="flex flex-col gap-2 text-left"
            >
              <span
                className={`relative aspect-video overflow-hidden rounded-xl transition-shadow ${
                  selectedTone === tone.id
                    ? "ring-3 ring-primary ring-offset-2 ring-offset-cream"
                    : ""
                }`}
              >
                <Image
                  src={SCENE_IMAGES.sea}
                  alt={`협재 바다 — ${tone.label} 톤`}
                  fill
                  sizes="(min-width: 640px) 320px, 45vw"
                  className="object-cover"
                  style={{ filter: TONE_PHOTO_FILTERS[tone.id] }}
                />
                {selectedTone === tone.id ? (
                  <span className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-4" />
                  </span>
                ) : null}
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold">{tone.label}</span>
                <span className="text-xs leading-4 text-muted-foreground">
                  {tone.description}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Link
          href={artistsHref}
          className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-4 text-base font-semibold text-primary-foreground active:bg-primary/90"
        >
          {selectionSummary ? `${selectionSummary} 작가 보기` : "작가 전체 보기"}
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href="/start"
          className="flex min-h-11 items-center justify-center text-sm font-medium text-muted-foreground active:text-foreground"
        >
          아직 모르겠다면, 1분 준비 도우미
        </Link>
      </div>
    </div>
  );
}
