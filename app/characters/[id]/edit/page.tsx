"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Dices,
  Save,
  Shield,
  Sparkles,
  Swords,
  WandSparkles,
} from "lucide-react";

type AbilityKey = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";

type Character = {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  alignment: string;
  background: string;
  story: string;
  abilities: Record<AbilityKey, number>;
};

const steps = [
  {
    title: "Identity",
    subtitle: "Who are you?",
    icon: Sparkles,
  },
  {
    title: "Origin",
    subtitle: "Race & class",
    icon: Shield,
  },
  {
    title: "Abilities",
    subtitle: "Your strengths",
    icon: Dices,
  },
  {
    title: "Story",
    subtitle: "Your legacy",
    icon: WandSparkles,
  },
];

const abilityInfo: {
  key: AbilityKey;
  name: string;
  description: string;
}[] = [
  {
    key: "STR",
    name: "Strength",
    description: "Physical power",
  },
  {
    key: "DEX",
    name: "Dexterity",
    description: "Agility & reflexes",
  },
  {
    key: "CON",
    name: "Constitution",
    description: "Endurance & vitality",
  },
  {
    key: "INT",
    name: "Intelligence",
    description: "Knowledge & reasoning",
  },
  {
    key: "WIS",
    name: "Wisdom",
    description: "Awareness & insight",
  },
  {
    key: "CHA",
    name: "Charisma",
    description: "Presence & influence",
  },
];

const alignments = [
  "Lawful Good",
  "Neutral Good",
  "Chaotic Good",
  "Lawful Neutral",
  "True Neutral",
  "Chaotic Neutral",
  "Lawful Evil",
  "Neutral Evil",
  "Chaotic Evil",
];

const races = [
  "Human",
  "Elf",
  "Half-Elf",
  "Dwarf",
  "Halfling",
  "Dragonborn",
  "Tiefling",
  "Half-Orc",
  "Gnome",
];

const classes = [
  "Barbarian",
  "Bard",
  "Cleric",
  "Druid",
  "Fighter",
  "Monk",
  "Paladin",
  "Ranger",
  "Rogue",
  "Sorcerer",
  "Warlock",
  "Wizard",
];

const backgrounds = [
  "Acolyte",
  "Charlatan",
  "Criminal",
  "Entertainer",
  "Folk Hero",
  "Guild Artisan",
  "Hermit",
  "Noble",
  "Outlander",
  "Sage",
  "Soldier",
  "Urchin",
];

export default function EditCharacterPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);

  useEffect(() => {
    async function loadCharacter() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/characters/${id}`);

        if (!response.ok) {
          throw new Error("Character not found");
        }

        const data = await response.json();

        setCharacter({
          ...data,
          abilities: {
            STR: data.abilities?.STR ?? 10,
            DEX: data.abilities?.DEX ?? 10,
            CON: data.abilities?.CON ?? 10,
            INT: data.abilities?.INT ?? 10,
            WIS: data.abilities?.WIS ?? 10,
            CHA: data.abilities?.CHA ?? 10,
          },
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load character.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadCharacter();
    }
  }, [id]);

  function updateField<K extends keyof Character>(
    field: K,
    value: Character[K],
  ) {
    setCharacter((current) =>
      current
        ? {
            ...current,
            [field]: value,
          }
        : current,
    );
  }

  function updateAbility(
    ability: AbilityKey,
    value: number,
  ) {
    setCharacter((current) =>
      current
        ? {
            ...current,
            abilities: {
              ...current.abilities,
              [ability]: value,
            },
          }
        : current,
    );
  }

  async function handleSave() {
    if (!character) return;

    try {
      setSaving(true);
      setError("");

      const response = await fetch(`/api/characters/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: character.name,
          race: character.race,
          class: character.class,
          level: character.level,
          alignment: character.alignment,
          background: character.background,
          story: character.story,
          abilities: character.abilities,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          data?.error || "Failed to update character",
        );
      }

      router.push(`/characters/${id}`);
      router.refresh();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save character.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (error && !character) {
    return (
      <main className="min-h-screen bg-[#090807] px-6 py-32 text-stone-100">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5">
            <Swords className="h-7 w-7 text-red-400" />
          </div>

          <h1 className="mt-6 font-serif text-3xl font-bold">
            Character Lost
          </h1>

          <p className="mt-3 text-sm text-stone-500">
            {error}
          </p>

          <button
            onClick={() => router.back()}
            className="mt-8 inline-flex items-center gap-2 rounded-lg border border-stone-800 px-5 py-3 text-sm text-stone-400 transition hover:border-stone-600 hover:text-stone-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Return
          </button>
        </div>
      </main>
    );
  }

  if (!character) return null;

  const currentStep = steps[step];
  const StepIcon = currentStep.icon;

  return (
    <main className="min-h-screen bg-[#090807] text-stone-100">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-amber-500/[0.025] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 pb-32 pt-24 sm:px-8">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="group mb-8 inline-flex items-center gap-2 text-sm text-stone-600 transition hover:text-amber-400"
        >
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
          Back to character
        </button>

        {/* Character Header */}
        <header className="mb-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/5">
                  <Swords className="h-5 w-5 text-amber-400" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500">
                    Character Forge
                  </p>

                  <p className="mt-0.5 text-xs text-stone-700">
                    Editing character
                  </p>
                </div>
              </div>

              <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">
                {character.name || "Unnamed Hero"}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-stone-500">
                <span>{character.race || "Unknown Race"}</span>

                <span className="text-stone-800">•</span>

                <span>{character.class || "Unknown Class"}</span>

                <span className="text-stone-800">•</span>

                <span>Level {character.level}</span>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-[#100d08] shadow-lg shadow-amber-500/10 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Swords className="h-4 w-4 animate-pulse" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </header>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-400">
            <Shield className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Step Navigation */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex min-w-[620px] rounded-2xl border border-stone-800 bg-[#100e0d] p-2">
            {steps.map((item, index) => {
              const Icon = item.icon;
              const active = index === step;
              const completed = index < step;

              return (
                <button
                  key={item.title}
                  onClick={() => setStep(index)}
                  className={`group relative flex flex-1 items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                    active
                      ? "bg-amber-500/10 text-amber-400"
                      : "text-stone-600 hover:bg-stone-900 hover:text-stone-400"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                      active
                        ? "border-amber-500/30 bg-amber-500/10"
                        : completed
                          ? "border-amber-500/20 bg-amber-500/5"
                          : "border-stone-800 bg-[#0c0b0a]"
                    }`}
                  >
                    {completed ? (
                      <Check className="h-4 w-4 text-amber-500" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>

                  <div className="hidden sm:block">
                    <p className="text-xs font-semibold">
                      {item.title}
                    </p>

                    <p className="mt-0.5 text-[10px] text-stone-700">
                      {item.subtitle}
                    </p>
                  </div>

                  {active && (
                    <div className="absolute bottom-0 left-5 right-5 h-px bg-amber-500/60" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Form */}
        <div className="overflow-hidden rounded-2xl border border-stone-800 bg-[#100e0d] shadow-2xl shadow-black/30">

          {/* Section Header */}
          <div className="border-b border-stone-800 px-6 py-6 sm:px-8">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-400">
                <StepIcon className="h-5 w-5" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500">
                  Step {step + 1} of {steps.length}
                </p>

                <h2 className="mt-1 font-serif text-2xl font-bold">
                  {currentStep.title}
                </h2>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-10">

            {/* STEP 1 */}
            {step === 0 && (
              <div className="mx-auto max-w-2xl">

                <div className="mb-8">
                  <p className="text-sm leading-6 text-stone-500">
                    Every legend begins with a name. Shape the
                    identity of your adventurer.
                  </p>
                </div>

                <div className="space-y-7">

                  <Field label="Character Name">
                    <input
                      value={character.name}
                      onChange={(e) =>
                        updateField("name", e.target.value)
                      }
                      placeholder="Aldric Stormborn"
                      className={inputClass}
                    />
                  </Field>

                  <div className="grid gap-6 sm:grid-cols-2">

                    <Field label="Level">
                      <Select
                        value={String(character.level)}
                        options={Array.from(
                          { length: 20 },
                          (_, i) => String(i + 1),
                        )}
                        placeholder="Choose level"
                        onChange={(value) =>
                          updateField(
                            "level",
                            Number(value),
                          )
                        }
                      />
                    </Field>

                    <Field label="Alignment">
                      <Select
                        value={character.alignment}
                        options={alignments}
                        placeholder="Choose alignment"
                        onChange={(value) =>
                          updateField(
                            "alignment",
                            value,
                          )
                        }
                      />
                    </Field>

                  </div>

                  <div className="rounded-xl border border-amber-500/10 bg-amber-500/[0.035] p-5">
                    <div className="flex gap-4">
                      <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

                      <div>
                        <p className="text-sm font-semibold text-amber-400">
                          Shape your legend
                        </p>

                        <p className="mt-1 text-sm leading-6 text-stone-600">
                          Your name, level, and alignment define
                          the foundation of your character's
                          identity.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 1 && (
              <div>
                <div className="mb-8">
                  <p className="text-sm leading-6 text-stone-500">
                    Choose the ancestry and calling that will
                    shape your character's abilities and place
                    in the world.
                  </p>
                </div>

                <div className="grid gap-10 lg:grid-cols-2">

                  <ChoiceSection
                    title="Race"
                    description="Your character's ancestry."
                    icon={Shield}
                    options={races}
                    value={character.race}
                    onChange={(value) =>
                      updateField("race", value)
                    }
                  />

                  <ChoiceSection
                    title="Class"
                    description="Your character's calling."
                    icon={Swords}
                    options={classes}
                    value={character.class}
                    onChange={(value) =>
                      updateField("class", value)
                    }
                  />

                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 2 && (
              <div>

                <div className="mb-8">
                  <p className="text-sm leading-6 text-stone-500">
                    Refine the abilities that define how your
                    character fights, thinks, survives, and
                    influences the world.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                  {abilityInfo.map((ability) => (
                    <div
                      key={ability.key}
                      className="group rounded-xl border border-stone-800 bg-[#0c0b0a] p-5 transition hover:border-stone-700"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500">
                            {ability.key}
                          </p>

                          <h3 className="mt-1 font-serif text-lg font-bold text-stone-200">
                            {ability.name}
                          </h3>

                          <p className="mt-1 text-xs text-stone-700">
                            {ability.description}
                          </p>
                        </div>

                        <Dices className="h-4 w-4 text-stone-800 transition group-hover:text-amber-500/50" />
                      </div>

                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={
                          character.abilities[
                            ability.key
                          ]
                        }
                        onChange={(e) =>
                          updateAbility(
                            ability.key,
                            Number(e.target.value),
                          )
                        }
                        className="mt-5 w-full rounded-lg border border-stone-800 bg-[#151210] px-4 py-3 text-center font-serif text-2xl font-bold text-amber-400 outline-none transition focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/10"
                      />
                    </div>
                  ))}

                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 3 && (
              <div className="mx-auto max-w-3xl">

                <div className="mb-8">
                  <p className="text-sm leading-6 text-stone-500">
                    Every adventurer has a past. Tell the story
                    that brought your character to the beginning
                    of their adventure.
                  </p>
                </div>

                <div className="space-y-7">

                  <Field label="Background">
                    <Select
                      value={character.background}
                      options={backgrounds}
                      placeholder="Choose background"
                      onChange={(value) =>
                        updateField(
                          "background",
                          value,
                        )
                      }
                    />
                  </Field>

                  <Field label="Character Story">
                    <textarea
                      rows={10}
                      value={character.story}
                      onChange={(e) =>
                        updateField(
                          "story",
                          e.target.value,
                        )
                      }
                      placeholder="Tell the story of your character..."
                      className={`${inputClass} resize-none leading-7`}
                    />
                  </Field>

                  <div className="rounded-xl border border-stone-800 bg-[#0c0b0a] p-5">
                    <div className="flex gap-4">
                      <WandSparkles className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

                      <div>
                        <p className="text-sm font-semibold text-stone-300">
                          Your story matters
                        </p>

                        <p className="mt-1 text-sm leading-6 text-stone-600">
                          This is the history that will follow
                          your character into every adventure.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between border-t border-stone-800 bg-[#0d0c0b] px-6 py-5 sm:px-8">

            <button
              disabled={step === 0}
              onClick={() =>
                setStep((current) => current - 1)
              }
              className="inline-flex items-center gap-2 rounded-lg border border-stone-800 px-5 py-2.5 text-sm font-medium text-stone-500 transition hover:border-stone-600 hover:text-stone-300 disabled:invisible"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>

            {step < steps.length - 1 ? (
              <button
                onClick={() =>
                  setStep((current) => current + 1)
                }
                className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-bold text-[#100d08] transition hover:bg-amber-400"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-bold text-[#100d08] transition hover:bg-amber-400 disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
                {saving ? "Saving..." : "Save Character"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile / Desktop save bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-800 bg-[#0b0a09]/95 px-5 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="text-xs text-stone-600">
              Editing
            </p>

            <p className="text-sm font-semibold text-stone-300">
              {character.name || "Unnamed Character"}
            </p>
          </div>

          <div className="flex flex-1 justify-end gap-3">

            <button
              onClick={() => router.back()}
              className="rounded-lg border border-stone-800 px-4 py-2.5 text-sm text-stone-500 transition hover:text-stone-300"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-[#100d08] transition hover:bg-amber-400 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </div>
        </div>
      </div>
    </main>
  );
}

/* -------------------------------- */
/* Field                            */
/* -------------------------------- */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">
        {label}
      </label>

      {children}
    </div>
  );
}

/* -------------------------------- */
/* Input                            */
/* -------------------------------- */

const inputClass =
  "w-full rounded-xl border border-stone-800 bg-[#0c0b0a] px-4 py-3.5 text-sm text-stone-200 outline-none transition placeholder:text-stone-800 hover:border-stone-700 focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/10";

/* -------------------------------- */
/* Select                           */
/* -------------------------------- */

function Select({
  value,
  options,
  placeholder,
  onChange,
}: {
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} appearance-none pr-10`}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-700" />
    </div>
  );
}

/* -------------------------------- */
/* Choice Section                   */
/* -------------------------------- */

function ChoiceSection({
  title,
  description,
  icon: Icon,
  options,
  value,
  onChange,
}: {
  title: string;
  description: string;
  icon: typeof Shield;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>

      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-400">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <h3 className="font-serif text-lg font-bold">
            {title}
          </h3>

          <p className="text-xs text-stone-700">
            {description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {options.map((option) => {
          const selected = value === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`group relative rounded-lg border px-3 py-3 text-left text-sm transition ${
                selected
                  ? "border-amber-500/40 bg-amber-500/[0.08] text-amber-400"
                  : "border-stone-800 bg-[#0c0b0a] text-stone-600 hover:border-stone-700 hover:text-stone-300"
              }`}
            >
              {option}

              {selected && (
                <Check className="absolute right-2 top-2 h-3.5 w-3.5 text-amber-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------- */
/* Loading                          */
/* -------------------------------- */

function LoadingScreen() {
  return (
    <main className="min-h-screen bg-[#090807] px-6 py-24 text-stone-100">
      <div className="mx-auto max-w-6xl">

        <div className="mb-10 space-y-4">
          <div className="h-4 w-28 animate-pulse rounded bg-stone-900" />
          <div className="h-10 w-72 animate-pulse rounded bg-stone-900" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded bg-stone-900" />
        </div>

        <div className="h-16 animate-pulse rounded-2xl bg-stone-900" />

        <div className="mt-6 h-[500px] animate-pulse rounded-2xl bg-stone-900" />
      </div>
    </main>
  );
}