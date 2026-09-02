"use client";

import Navbar from "../../../components/Navbar";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Dices,
  Shield,
  Sparkles,
  Swords,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

import type { Abilities, CharacterFormData } from "@/types/type";

import {
  abilityScores,
  alignments,
  backgrounds,
  classes,
  characterLevels,
  races,
} from "../../../data/characterData";

const steps = ["Basic Info", "Race & Class", "Abilities", "Background"];

export default function CreateCharacter() {
  const router = useRouter();

  const [step, setStep] = useState(0);

  const [character, setCharacter] = useState<CharacterFormData>({
    name: "",
    race: "",
    class: "",
    level: 1,
    alignment: "",
    background: "",
    abilities: {
      STR: 10,
      DEX: 10,
      CON: 10,
      INT: 10,
      WIS: 10,
      CHA: 10,
    },
    story: "",
  });

  const [error, setError] = useState("");

  /* -------------------------------- */
  /* Update Character                  */
  /* -------------------------------- */

  const updateCharacter = (key: keyof CharacterFormData, value: string | number) => {
    setCharacter((current) => ({
      ...current,
      [key]: value,
    }));

    setError("");
  };

  /* -------------------------------- */
  /* Update Ability                   */
  /* -------------------------------- */

  const updateAbility = (ability: keyof Abilities, value: number) => {
    setCharacter((current) => ({
      ...current,
      abilities: {
        ...current.abilities,
        [ability]: value,
      },
    }));

    setError("");
  };

  /* -------------------------------- */
  /* Validate Current Step            */
  /* -------------------------------- */

  const validateStep = () => {
    setError("");

    // Basic Info
    if (step === 0) {
      if (!character.name.trim()) {
        setError("Please enter a character name.");
        return false;
      }

      if (!character.level) {
        setError("Please choose a character level.");
        return false;
      }

      if (!character.alignment) {
        setError("Please choose an alignment.");
        return false;
      }
    }

    // Race & Class
    if (step === 1) {
      if (!character.race) {
        setError("Please choose a race.");
        return false;
      }

      if (!character.class) {
        setError("Please choose a class.");
        return false;
      }
    }

    // Abilities
    if (step === 2) {
      const abilities = Object.values(character.abilities);

      const invalid = abilities.some((value) => value < 1 || value > 30);

      if (invalid) {
        setError("Ability scores must be between 1 and 30.");
        return false;
      }
    }

    // Background
    if (step === 3) {
      if (!character.background) {
        setError("Please choose a background.");
        return false;
      }
    }

    return true;
  };

  /* -------------------------------- */
  /* Next Step                        */
  /* -------------------------------- */

  const nextStep = () => {
    if (!validateStep()) {
      return;
    }

    if (step < steps.length - 1) {
      setStep((current) => current + 1);
    }
  };

  /* -------------------------------- */
  /* Previous Step                    */
  /* -------------------------------- */

  const previousStep = () => {
    setError("");

    if (step > 0) {
      setStep((current) => current - 1);
    }
  };

  /* -------------------------------- */
  /* Finish Character                 */
  /* -------------------------------- */

  const [saving, setSaving] = useState(false);

  const finishCharacter = async () => {
    if (!validateStep()) {
      return;
    }

    setError("");
    setSaving(true);

    try {
      const response = await fetch("/api/characters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(character),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create character");
      }

      console.log("Character created:", data);

      router.push("/characters");
    } catch (error) {
      console.error("Error creating character:", error);

      setError(
        error instanceof Error ? error.message : "Failed to create character.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0908] px-6 pb-20 pt-32 text-stone-100">
      <Navbar />
      <div className="mx-auto max-w-5xl">
        {/* ============================== */}
        {/* HEADER                         */}
        {/* ============================== */}

        <div className="mb-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/5">
            <Swords className="h-5 w-5 text-amber-400" />
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
            Character Forge
          </p>

          <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">
            Forge Your Character
          </h1>

          <p className="mt-4 text-stone-500">
            Create the hero who will enter your next adventure.
          </p>
        </div>

        {/* ============================== */}
        {/* PROGRESS                       */}
        {/* ============================== */}

        <div className="mb-10">
          <div className="flex items-center justify-between">
            {steps.map((item, index) => {
              const completed = index < step;
              const active = index === step;

              return (
                <div
                  key={item}
                  className="flex flex-1 items-center last:flex-none"
                >
                  {/* Step */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition ${
                        completed
                          ? "border-amber-500 bg-amber-500 text-stone-950"
                          : active
                            ? "border-amber-500 text-amber-400"
                            : "border-stone-700 text-stone-600"
                      }`}
                    >
                      {completed ? <Check className="h-4 w-4" /> : index + 1}
                    </div>

                    <span
                      className={`mt-2 hidden text-xs sm:block ${
                        active
                          ? "text-amber-400"
                          : completed
                            ? "text-stone-400"
                            : "text-stone-600"
                      }`}
                    >
                      {item}
                    </span>
                  </div>

                  {/* Connector */}
                  {index !== steps.length - 1 && (
                    <div
                      className={`mx-3 mt-[-20px] h-px flex-1 transition ${
                        index < step ? "bg-amber-500" : "bg-stone-800"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================== */}
        {/* FORM                           */}
        {/* ============================== */}

        <div className="overflow-hidden rounded-2xl border border-stone-800 bg-[#12100f] shadow-2xl shadow-black/20">
          {/* Form Header */}
          <div className="border-b border-stone-800 px-6 py-5 sm:px-8">
            <h2 className="font-serif text-xl font-bold">{steps[step]}</h2>

            <p className="mt-1 text-sm text-stone-600">
              Step {step + 1} of {steps.length}
            </p>
          </div>

          {/* Form Content */}
          <div className="min-h-[400px] p-6 sm:p-8">
            {/* ========================== */}
            {/* STEP 1 - BASIC INFO         */}
            {/* ========================== */}

            {step === 0 && (
              <div className="mx-auto max-w-xl space-y-7">
                {/* Name */}
                <div>
                  <label
                    htmlFor="character-name"
                    className="mb-2 block text-sm font-medium text-stone-300"
                  >
                    Character Name
                  </label>

                  <input
                    id="character-name"
                    type="text"
                    value={character.name}
                    onChange={(e) => updateCharacter("name", e.target.value)}
                    placeholder="e.g. Aldric Stormborn"
                    className="w-full rounded-lg border border-stone-800 bg-[#0d0b0a] px-4 py-3 text-sm text-stone-200 outline-none transition placeholder:text-stone-700 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                  />
                </div>

                {/* Level + Alignment */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <SelectField
                    label="Level"
                    value={String(character.level)}
                    onChange={(value) =>
                      updateCharacter("level", Number(value))
                    }
                    options={characterLevels.map(String)}
                    placeholder="Choose level"
                  />

                  <SelectField
                    label="Alignment"
                    value={character.alignment}
                    onChange={(value) => updateCharacter("alignment", value)}
                    options={alignments}
                    placeholder="Choose alignment"
                  />
                </div>

                {/* Info */}
                <div className="rounded-lg border border-amber-500/10 bg-amber-500/5 p-5">
                  <div className="flex gap-3">
                    <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

                    <div>
                      <p className="text-sm font-medium text-amber-400">
                        Your adventure begins
                      </p>

                      <p className="mt-1 text-sm leading-6 text-stone-500">
                        Give your character a name, level, and alignment. You
                        can customize their race, class, abilities, and
                        background in the next steps.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================== */}
            {/* STEP 2 - RACE & CLASS      */}
            {/* ========================== */}

            {step === 1 && (
              <div className="grid gap-8 md:grid-cols-2">
                <SelectionGrid
                  title="Choose Your Race"
                  icon={<Shield className="h-5 w-5" />}
                  options={races}
                  value={character.race}
                  onChange={(value) => updateCharacter("race", value)}
                />

                <SelectionGrid
                  title="Choose Your Class"
                  icon={<Swords className="h-5 w-5" />}
                  options={classes}
                  value={character.class}
                  onChange={(value) => updateCharacter("class", value)}
                />
              </div>
            )}

            {/* ========================== */}
            {/* STEP 3 - ABILITIES          */}
            {/* ========================== */}

            {step === 2 && (
              <div>
                <div className="mb-8 text-center">
                  <Dices className="mx-auto h-8 w-8 text-amber-400" />

                  <h3 className="mt-4 font-serif text-2xl font-bold">
                    Determine Your Abilities
                  </h3>

                  <p className="mt-2 text-sm text-stone-600">
                    Assign your ability scores.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {abilityScores.map(({ name, short }) => {
                    const ability = short as keyof Abilities;

                    return (
                      <div
                        key={short}
                        className="rounded-xl border border-stone-800 bg-[#0d0b0a] p-5 text-center"
                      >
                        <p className="text-xs uppercase tracking-widest text-stone-600">
                          {short}
                        </p>

                        <p className="mt-2 font-serif text-lg font-bold text-stone-300">
                          {name}
                        </p>

                        <input
                          type="number"
                          value={character.abilities[ability]}
                          min={1}
                          max={30}
                          onChange={(e) =>
                            updateAbility(ability, Number(e.target.value))
                          }
                          className="mx-auto mt-4 block w-20 rounded-lg border border-stone-800 bg-[#171311] px-3 py-3 text-center text-xl font-bold text-amber-400 outline-none transition focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ========================== */}
            {/* STEP 4 - BACKGROUND         */}
            {/* ========================== */}

            {step === 3 && (
              <div className="mx-auto max-w-xl space-y-7">
                {/* Background */}
                <SelectField
                  label="Background"
                  value={character.background}
                  onChange={(value) => updateCharacter("background", value)}
                  options={backgrounds}
                  placeholder="Choose background"
                />

                {/* Story */}
                <div>
                  <label
                    htmlFor="character-story"
                    className="mb-2 block text-sm font-medium text-stone-300"
                  >
                    Character Story
                  </label>

                  <textarea
                    id="character-story"
                    rows={7}
                    value={character.story}
                    onChange={(e) => updateCharacter("story", e.target.value)}
                    placeholder="Tell us about your character..."
                    className="w-full resize-none rounded-lg border border-stone-800 bg-[#0d0b0a] px-4 py-3 text-sm text-stone-300 outline-none transition placeholder:text-stone-700 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ============================== */}
          {/* ERROR                          */}
          {/* ============================== */}

          {error && (
            <div className="border-t border-red-500/10 bg-red-500/5 px-6 py-4 sm:px-8">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* ============================== */}
          {/* ACTIONS                        */}
          {/* ============================== */}

          <div className="flex items-center justify-between border-t border-stone-800 px-6 py-5 sm:px-8">
            {/* Back */}
            <button
              type="button"
              onClick={previousStep}
              disabled={step === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-stone-800 px-5 py-3 text-sm text-stone-400 transition hover:border-stone-600 hover:text-stone-300 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            {/* Next / Finish */}
            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-400"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={finishCharacter}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Forging..." : "Finish Character"}

                <Swords className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

/* ================================================= */
/* SELECTION GRID                                    */
/* ================================================= */

function SelectionGrid({
  title,
  icon,
  options,
  value,
  onChange,
}: {
  title: string;
  icon: ReactNode;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/5 text-amber-400">
          {icon}
        </div>

        <h3 className="font-serif text-lg font-bold">{title}</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => {
          const selected = value === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              aria-pressed={selected}
              className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                selected
                  ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                  : "border-stone-800 bg-[#0d0b0a] text-stone-500 hover:border-stone-600 hover:text-stone-300"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================= */
/* SELECT FIELD                                      */
/* ================================================= */

function SelectField({
  label,
  value,
  options,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-stone-300">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-stone-800 bg-[#0d0b0a] px-4 py-3 text-sm text-stone-300 outline-none transition focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-600" />
      </div>
    </div>
  );
}
