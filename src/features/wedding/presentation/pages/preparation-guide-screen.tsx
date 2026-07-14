"use client";

import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  CircleHelp,
  Clock3,
  MapPinned,
  Mountain,
  Palette,
  RefreshCcw,
  Shirt,
  Sparkles,
  Wallet,
  Waves,
} from "lucide-react";
import Link from "next/link";
import { type ReactNode, useState } from "react";

import type {
  DateReadiness,
  PlanningPriority,
  PreparationGuideAnswers,
  StayLength,
} from "../../domain/entity/preparation-guide.entity";
import type {
  SnapScene,
  WeddingCatalog,
  WeddingTone,
} from "../../domain/entity/wedding-catalog.entity";
import { createPreparationGuideResult } from "../../domain/usecase/create-preparation-guide-result";

interface PreparationGuideScreenProps {
  catalog: WeddingCatalog;
}

type GuideStep = 1 | 2 | 3 | 4 | "result";

interface ChoiceOption {
  id: string;
  label: string;
  description: string;
  icon: typeof Mountain;
}

const TOTAL_STEPS = 4;

export function PreparationGuideScreen({ catalog }: PreparationGuideScreenProps) {
  const [step, setStep] = useState<GuideStep>(1);
  const [answers, setAnswers] = useState<PreparationGuideAnswers>({
    dateReadiness: "unknown",
    stayLength: "unknown",
  });
  const result = createPreparationGuideResult(answers);
  const artistHref = createArtistHref(answers);

  function goToPreviousStep() {
    if (step === "result") {
      setStep(TOTAL_STEPS);
      return;
    }

    if (step > 1) {
      setStep((step - 1) as GuideStep);
    }
  }

  function resetGuide() {
    setAnswers({ dateReadiness: "unknown", stayLength: "unknown" });
    setStep(1);
  }

  return (
    <div className="flex min-h-[calc(100dvh-8rem)] flex-col gap-7 pb-4">
      <header className="flex items-center justify-between gap-3">
        {step === 1 ? (
          <Link
            href="/"
            className="flex min-h-11 items-center gap-1 text-sm font-semibold text-muted-foreground active:text-foreground"
          >
            <ChevronLeft className="size-5" />
            홈
          </Link>
        ) : (
          <button
            type="button"
            onClick={goToPreviousStep}
            className="flex min-h-11 items-center gap-1 text-sm font-semibold text-muted-foreground active:text-foreground"
          >
            <ChevronLeft className="size-5" />
            이전
          </button>
        )}
        <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground">
          촬영 준비 도우미
        </span>
      </header>

      {step === "result" ? (
        <GuideResult
          artistHref={artistHref}
          onReset={resetGuide}
          result={result}
        />
      ) : (
        <>
          <StepProgress step={step} />
          {step === 1 ? (
            <SceneStep
              catalog={catalog}
              selectedScene={answers.scene}
              onSelect={(scene) => setAnswers((current) => ({ ...current, scene }))}
              onSkip={() =>
                setAnswers((current) => ({ ...current, scene: undefined }))
              }
              onContinue={() => setStep(2)}
            />
          ) : null}
          {step === 2 ? (
            <ToneStep
              catalog={catalog}
              selectedTone={answers.tone}
              onSelect={(tone) => setAnswers((current) => ({ ...current, tone }))}
              onSkip={() =>
                setAnswers((current) => ({ ...current, tone: undefined }))
              }
              onContinue={() => setStep(3)}
            />
          ) : null}
          {step === 3 ? (
            <PriorityStep
              selectedPriority={answers.priority}
              onSelect={(priority) =>
                setAnswers((current) => ({ ...current, priority }))
              }
              onSkip={() =>
                setAnswers((current) => ({ ...current, priority: undefined }))
              }
              onContinue={() => setStep(4)}
            />
          ) : null}
          {step === 4 ? (
            <DateAndStayStep
              dateReadiness={answers.dateReadiness}
              stayLength={answers.stayLength}
              onDateReadinessChange={(dateReadiness) =>
                setAnswers((current) => ({ ...current, dateReadiness }))
              }
              onStayLengthChange={(stayLength) =>
                setAnswers((current) => ({ ...current, stayLength }))
              }
              onContinue={() => setStep("result")}
            />
          ) : null}
        </>
      )}
    </div>
  );
}

interface StepProgressProps {
  step: number;
}

function StepProgress({ step }: StepProgressProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-primary">{step} / {TOTAL_STEPS}</p>
        <p className="text-xs text-muted-foreground">정답은 없어요. 편한 만큼만 골라요.</p>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-200"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>
    </div>
  );
}

interface SceneStepProps {
  catalog: WeddingCatalog;
  selectedScene?: SnapScene;
  onSelect: (scene: SnapScene) => void;
  onSkip: () => void;
  onContinue: () => void;
}

function SceneStep({
  catalog,
  selectedScene,
  onSelect,
  onSkip,
  onContinue,
}: SceneStepProps) {
  const sceneIcons: Record<SnapScene, typeof Mountain> = {
    oreum: Mountain,
    sea: Waves,
    ranch: MapPinned,
    "stone-wall": MapPinned,
    forest: Sparkles,
    sunset: Sparkles,
  };

  return (
    <GuideStepLayout
      eyebrow="첫 번째 단서"
      title="어떤 제주를 사진에 남기고 싶나요?"
      description="정확한 포토스팟이 아니라, 작가에게 전하고 싶은 큰 장면만 골라보세요."
      onContinue={onContinue}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {catalog.scenes.map((scene) => (
          <ChoiceCard
            key={scene.id}
            icon={sceneIcons[scene.id]}
            label={scene.label}
            description={scene.description}
            isActive={selectedScene === scene.id}
            onClick={() => onSelect(scene.id)}
          />
        ))}
      </div>
      <SkipChoice isActive={!selectedScene} onClick={onSkip} />
    </GuideStepLayout>
  );
}

interface ToneStepProps {
  catalog: WeddingCatalog;
  selectedTone?: WeddingTone;
  onSelect: (tone: WeddingTone) => void;
  onSkip: () => void;
  onContinue: () => void;
}

function ToneStep({
  catalog,
  selectedTone,
  onSelect,
  onSkip,
  onContinue,
}: ToneStepProps) {
  return (
    <GuideStepLayout
      eyebrow="두 번째 단서"
      title="사진의 분위기는 어떤 쪽에 가까울까요?"
      description="잘 모르겠다면 포트폴리오를 보며 나중에 정해도 괜찮아요."
      onContinue={onContinue}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {catalog.tones.map((tone) => (
          <ChoiceCard
            key={tone.id}
            icon={Palette}
            label={tone.label}
            description={tone.description}
            isActive={selectedTone === tone.id}
            onClick={() => onSelect(tone.id)}
          />
        ))}
      </div>
      <SkipChoice isActive={!selectedTone} onClick={onSkip} />
    </GuideStepLayout>
  );
}

interface PriorityStepProps {
  selectedPriority?: PlanningPriority;
  onSelect: (priority: PlanningPriority) => void;
  onSkip: () => void;
  onContinue: () => void;
}

function PriorityStep({
  selectedPriority,
  onSelect,
  onSkip,
  onContinue,
}: PriorityStepProps) {
  const options: ChoiceOption[] = [
    {
      id: "artist",
      label: "작가의 사진 스타일",
      description: "포즈와 결과물의 분위기가 가장 중요해요",
      icon: Sparkles,
    },
    {
      id: "styling",
      label: "드레스와 메이크업",
      description: "입고 싶은 모습부터 떠올라요",
      icon: Shirt,
    },
    {
      id: "budget",
      label: "예산과 구성",
      description: "합리적인 시작가와 포함 항목이 궁금해요",
      icon: Wallet,
    },
    {
      id: "schedule",
      label: "촬영 가능한 일정",
      description: "결혼식이나 제주 여행 일정이 먼저예요",
      icon: CalendarDays,
    },
  ];

  return (
    <GuideStepLayout
      eyebrow="세 번째 단서"
      title="지금 가장 막막한 건 무엇인가요?"
      description="한 가지만 골라도 다음 순서를 정하는 데 충분해요."
      onContinue={onContinue}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <ChoiceCard
            key={option.id}
            icon={option.icon}
            label={option.label}
            description={option.description}
            isActive={selectedPriority === option.id}
            onClick={() => onSelect(option.id as PlanningPriority)}
          />
        ))}
      </div>
      <SkipChoice isActive={!selectedPriority} onClick={onSkip} />
    </GuideStepLayout>
  );
}

interface DateAndStayStepProps {
  dateReadiness: DateReadiness;
  stayLength: StayLength;
  onDateReadinessChange: (value: DateReadiness) => void;
  onStayLengthChange: (value: StayLength) => void;
  onContinue: () => void;
}

function DateAndStayStep({
  dateReadiness,
  stayLength,
  onDateReadinessChange,
  onStayLengthChange,
  onContinue,
}: DateAndStayStepProps) {
  return (
    <GuideStepLayout
      eyebrow="마지막 단서"
      title="날짜가 아직 없어도 괜찮아요"
      description="정확한 날짜 대신, 지금 떠올리는 정도만 알려주세요."
      onContinue={onContinue}
      continueLabel="내 준비 순서 보기"
    >
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold">촬영 날짜는 어디까지 생각했나요?</p>
        <div className="grid gap-2">
          <SelectableRow
            label="아직 전혀 모르겠어요"
            isActive={dateReadiness === "unknown"}
            onClick={() => onDateReadinessChange("unknown")}
          />
          <SelectableRow
            label="계절 정도만 생각하고 있어요"
            isActive={dateReadiness === "season"}
            onClick={() => onDateReadinessChange("season")}
          />
          <SelectableRow
            label="희망하는 월은 있어요"
            isActive={dateReadiness === "month"}
            onClick={() => onDateReadinessChange("month")}
          />
          <SelectableRow
            label="촬영 날짜가 정해졌어요"
            isActive={dateReadiness === "fixed"}
            onClick={() => onDateReadinessChange("fixed")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-5">
        <p className="text-sm font-semibold">제주에는 얼마나 머물 것 같나요?</p>
        <div className="grid gap-2">
          <SelectableRow
            label="아직 모르겠어요"
            isActive={stayLength === "unknown"}
            onClick={() => onStayLengthChange("unknown")}
          />
          <SelectableRow
            label="2박 3일 정도"
            isActive={stayLength === "two-nights"}
            onClick={() => onStayLengthChange("two-nights")}
          />
          <SelectableRow
            label="3박 이상 머물 예정이에요"
            isActive={stayLength === "three-nights"}
            onClick={() => onStayLengthChange("three-nights")}
          />
        </div>
      </div>
    </GuideStepLayout>
  );
}

interface GuideStepLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  onContinue: () => void;
  continueLabel?: string;
  children: ReactNode;
}

function GuideStepLayout({
  eyebrow,
  title,
  description,
  onContinue,
  continueLabel = "다음으로",
  children,
}: GuideStepLayoutProps) {
  return (
    <section className="flex flex-1 flex-col gap-7">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-primary">{eyebrow}</p>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-balance">
          {title}
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
      <button
        type="button"
        onClick={onContinue}
        className="mt-auto flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-4 text-base font-semibold text-primary-foreground active:bg-primary/90"
      >
        {continueLabel}
        <ArrowRight className="size-4" />
      </button>
    </section>
  );
}

interface ChoiceCardProps {
  icon: typeof Mountain;
  label: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
}

function ChoiceCard({
  icon: Icon,
  label,
  description,
  isActive,
  onClick,
}: ChoiceCardProps) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={`flex min-h-32 flex-col justify-between rounded-2xl border p-4 text-left transition-colors ${
        isActive
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground active:bg-muted"
      }`}
    >
      <span
        className={`flex size-10 items-center justify-center rounded-xl ${
          isActive ? "bg-white/15" : "bg-secondary text-primary"
        }`}
      >
        <Icon className="size-5" />
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-sm font-semibold">{label}</span>
        <span
          className={`text-xs leading-4 ${
            isActive ? "text-primary-foreground/75" : "text-muted-foreground"
          }`}
        >
          {description}
        </span>
      </span>
    </button>
  );
}

interface SkipChoiceProps {
  isActive: boolean;
  onClick: () => void;
}

function SkipChoice({ isActive, onClick }: SkipChoiceProps) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={`flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium ${
        isActive
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-card text-muted-foreground active:bg-muted"
      }`}
    >
      <CircleHelp className="size-4" />
      아직 모르겠어요
    </button>
  );
}

interface SelectableRowProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function SelectableRow({ label, isActive, onClick }: SelectableRowProps) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={`flex min-h-12 items-center justify-between rounded-md border px-4 text-left text-sm font-medium ${
        isActive
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-secondary-foreground active:bg-muted"
      }`}
    >
      {label}
      {isActive ? <Sparkles className="size-4" /> : null}
    </button>
  );
}

interface GuideResultProps {
  artistHref: string;
  result: ReturnType<typeof createPreparationGuideResult>;
  onReset: () => void;
}

function GuideResult({ artistHref, result, onReset }: GuideResultProps) {
  return (
    <section className="flex flex-1 flex-col gap-6">
      <div className="rounded-3xl bg-foreground p-6 text-primary-foreground">
        <div className="flex flex-col gap-5">
          <span className="flex size-11 items-center justify-center rounded-xl bg-white/10">
            <Clock3 className="size-5" />
          </span>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-white/70">{result.stageLabel}</p>
            <h1 className="text-3xl font-semibold leading-tight text-balance">
              {result.title}
            </h1>
            <p className="text-sm leading-6 text-white/80">{result.description}</p>
          </div>
        </div>
      </div>

      <ResultList
        icon={Sparkles}
        title="지금 정해도 좋은 것"
        items={result.decideNow}
      />
      <ResultList
        icon={MapPinned}
        title="작가와 함께 정하면 되는 것"
        items={result.decideWithPhotographer}
      />

      <Link
        href={artistHref}
        className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-4 text-base font-semibold text-primary-foreground active:bg-primary/90"
      >
        {result.nextActionLabel}
        <ArrowRight className="size-4" />
      </Link>
      <button
        type="button"
        onClick={onReset}
        className="flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-muted-foreground active:text-foreground"
      >
        <RefreshCcw className="size-4" />
        처음부터 다시 고르기
      </button>
    </section>
  );
}

interface ResultListProps {
  icon: typeof Sparkles;
  title: string;
  items: string[];
}

function ResultList({ icon: Icon, title, items }: ResultListProps) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <Icon className="size-5 text-primary" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function createArtistHref(answers: PreparationGuideAnswers) {
  const searchParams = new URLSearchParams();

  if (answers.scene) {
    searchParams.set("scene", answers.scene);
  }

  if (answers.tone) {
    searchParams.set("tone", answers.tone);
  }

  const query = searchParams.toString();

  return query ? `/artists?${query}` : "/artists";
}
