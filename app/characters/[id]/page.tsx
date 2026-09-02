import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Dices,
  Edit3,
  Heart,
  Shield,
  Sparkles,
  Swords,
  Trash2,
  Zap,
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

  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;

  inspiration: boolean;
  speed: number;
  temporary_hit_points: number;

  story: string;

  created_at: string;
  updated_at: string;
};

type Skill = {
  name: string;
  ability: AbilityKey;
};

const skills: Skill[] = [
  { name: "Acrobatics", ability: "DEX" },
  { name: "Animal Handling", ability: "WIS" },
  { name: "Arcana", ability: "INT" },
  { name: "Athletics", ability: "STR" },
  { name: "Deception", ability: "CHA" },
  { name: "History", ability: "INT" },
  { name: "Insight", ability: "WIS" },
  { name: "Intimidation", ability: "CHA" },
  { name: "Investigation", ability: "INT" },
  { name: "Medicine", ability: "WIS" },
  { name: "Nature", ability: "INT" },
  { name: "Perception", ability: "WIS" },
  { name: "Performance", ability: "CHA" },
  { name: "Persuasion", ability: "CHA" },
  { name: "Religion", ability: "INT" },
  { name: "Sleight of Hand", ability: "DEX" },
  { name: "Stealth", ability: "DEX" },
  { name: "Survival", ability: "WIS" },
];

const abilityNames: Record<AbilityKey, string> = {
  STR: "Strength",
  DEX: "Dexterity",
  CON: "Constitution",
  INT: "Intelligence",
  WIS: "Wisdom",
  CHA: "Charisma",
};

const savingThrows: {
  name: string;
  ability: AbilityKey;
}[] = [
  { name: "Strength", ability: "STR" },
  { name: "Dexterity", ability: "DEX" },
  { name: "Constitution", ability: "CON" },
  { name: "Intelligence", ability: "INT" },
  { name: "Wisdom", ability: "WIS" },
  { name: "Charisma", ability: "CHA" },
];

function getModifier(score: number) {
  return Math.floor((score - 10) / 2);
}

function formatModifier(score: number) {
  const modifier = getModifier(score);

  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

export default async function CharacterDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let character: Character | null = null;

  try {
    const response = await fetch(`http://localhost:3000/api/characters/${id}`, {
      cache: "no-store",
    });

    if (response.ok) {
      character = await response.json();
    }
  } catch (error) {
    console.error("Error fetching character:", error);
  }

  /*
   * Character not found / API error
   */
  if (!character) {
    return (
      <main className="min-h-screen bg-[#0b0908] px-6 pb-20 pt-28 text-stone-100">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/characters"
            className="inline-flex items-center gap-2 text-sm text-stone-500 transition hover:text-amber-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Characters
          </Link>

          <div className="mt-10 rounded-2xl border border-stone-800 bg-[#12100f] p-10 text-center">
            <Swords className="mx-auto h-10 w-10 text-stone-700" />

            <h1 className="mt-5 font-serif text-3xl font-bold text-stone-100">
              Character Not Found
            </h1>

            <p className="mt-3 text-sm text-stone-500">
              We couldn't find a character with this ID.
            </p>

            <Link
              href="/characters"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Characters
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /*
   * Convert database's flat ability fields
   * into the structure used by the UI.
   */
  const abilities: Record<AbilityKey, number> = {
    STR: character.strength,
    DEX: character.dexterity,
    CON: character.constitution,
    INT: character.intelligence,
    WIS: character.wisdom,
    CHA: character.charisma,
  };

  /*
   * D&D 5e proficiency bonus
   *
   * Level 1-4  = +2
   * Level 5-8  = +3
   * Level 9-12 = +4
   * etc.
   */
  const proficiencyBonus = 2 + Math.floor((character.level - 1) / 4);

  /*
   * Initiative = Dexterity modifier
   */
  const initiative = getModifier(character.dexterity);

  /*
   * Basic Armor Class
   *
   * This is the base AC calculation.
   * Equipment / armor can be added later.
   */
  const armorClass = 10 + getModifier(character.dexterity);

  /*
   * Basic HP calculation.
   *
   * Currently using d10 as the base hit die.
   * Later this can be changed based on class.
   */
  const hitPoints =
    10 +
    getModifier(character.constitution) +
    (character.level - 1) * (6 + getModifier(character.constitution));

  /*
   * Passive Perception
   *
   * Base passive Perception = 10 + Wisdom modifier.
   * Proficiency will be added later when skill
   * proficiencies are stored in the database.
   */
  const passivePerception = 10 + getModifier(character.wisdom);

  return (
    <main className="min-h-screen bg-[#0b0908] px-6 pb-20 pt-28 text-stone-100">
      <div className="mx-auto max-w-7xl">
        {/* ========================================= */}
        {/* TOP BAR                                   */}
        {/* ========================================= */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/characters"
            className="inline-flex w-fit items-center gap-2 text-sm text-stone-500 transition hover:text-amber-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Characters
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href={`/characters/${character.id}/edit`}
              className="inline-flex items-center gap-2 rounded-lg border border-stone-700 px-4 py-2.5 text-sm text-stone-300 transition hover:border-amber-500/40 hover:bg-amber-500/5 hover:text-amber-400"
            >
              <Edit3 className="h-4 w-4" />
              Edit
            </Link>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-red-900/50 px-4 py-2.5 text-sm text-red-400 transition hover:border-red-500/50 hover:bg-red-500/5"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>

        {/* ========================================= */}
        {/* CHARACTER HEADER                          */}
        {/* ========================================= */}

        <section className="relative overflow-hidden rounded-2xl border border-stone-800 bg-[#12100f]">
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              {/* Character Identity */}
              <div className="flex items-start gap-5">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/5">
                  <Swords className="h-8 w-8 text-amber-400" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
                    Character Sheet
                  </p>

                  <h1 className="mt-2 font-serif text-4xl font-bold text-stone-100 sm:text-5xl">
                    {character.name}
                  </h1>

                  <p className="mt-3 text-stone-400">
                    Level {character.level} {character.race} {character.class}
                  </p>
                </div>
              </div>

              {/* Level */}
              <div className="flex items-center gap-4 rounded-xl border border-stone-800 bg-[#0d0b0a] px-6 py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/5">
                  <span className="font-serif text-xl font-bold text-amber-400">
                    {character.level}
                  </span>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-stone-600">
                    Level
                  </p>

                  <p className="mt-1 text-sm font-medium text-stone-300">
                    Adventurer
                  </p>
                </div>
              </div>
            </div>

            {/* Character Metadata */}
            <div className="mt-8 grid gap-4 border-t border-stone-800 pt-8 sm:grid-cols-3">
              <InfoItem label="Race" value={character.race} />

              <InfoItem label="Class" value={character.class} />

              <InfoItem label="Alignment" value={character.alignment} />
            </div>
          </div>
        </section>

        {/* ========================================= */}
        {/* COMBAT STATS                              */}
        {/* ========================================= */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
          <StatCard
            icon={<Heart className="h-5 w-5" />}
            label="Hit Points"
            value={String(hitPoints)}
            description="Maximum HP"
          />

          <StatCard
            icon={<Shield className="h-5 w-5" />}
            label="Armor Class"
            value={String(armorClass)}
            description="Base AC"
          />

          <StatCard
            icon={<Zap className="h-5 w-5" />}
            label="Initiative"
            value={initiative >= 0 ? `+${initiative}` : `${initiative}`}
            description="Dexterity"
          />

          <StatCard
            icon={<Dices className="h-5 w-5" />}
            label="Proficiency"
            value={`+${proficiencyBonus}`}
            description="Proficiency bonus"
          />

          <StatCard
            icon={<Sparkles className="h-5 w-5" />}
            label="Passive Perception"
            value={String(passivePerception)}
            description="Wisdom"
          />

          <StatCard
            icon={<Sparkles className="h-5 w-5" />}
            label="Inspiration"
            value={character.inspiration ? "Yes" : "No"}
            description="Character"
          />

          <StatCard
            icon={<Swords className="h-5 w-5" />}
            label="Speed"
            value={`${character.speed} ft`}
            description="Movement"
          />

          <StatCard
            icon={<Heart className="h-5 w-5" />}
            label="Temp HP"
            value={String(character.temporary_hit_points)}
            description="Temporary"
          />
        </section>

        {/* ========================================= */}
        {/* MAIN CONTENT                              */}
        {/* ========================================= */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* ========================================= */}
            {/* ABILITIES                                  */}
            {/* ========================================= */}

            <section className="rounded-2xl border border-stone-800 bg-[#12100f] p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">
                    Abilities
                  </p>

                  <h2 className="mt-2 font-serif text-2xl font-bold">
                    Ability Scores
                  </h2>
                </div>

                <Dices className="h-5 w-5 text-stone-700" />
              </div>

              <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {(Object.keys(abilities) as AbilityKey[]).map((ability) => {
                  const score = abilities[ability];

                  return (
                    <div
                      key={ability}
                      className="rounded-xl border border-stone-800 bg-[#0d0b0a] p-5 text-center"
                    >
                      <p className="text-xs font-semibold tracking-[0.2em] text-stone-600">
                        {ability}
                      </p>

                      <p className="mt-2 text-xs text-stone-500">
                        {abilityNames[ability]}
                      </p>

                      <div className="mx-auto mt-4 flex h-14 w-14 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/5">
                        <span className="font-serif text-2xl font-bold text-amber-400">
                          {score}
                        </span>
                      </div>

                      <p className="mt-3 text-sm font-semibold text-stone-400">
                        {formatModifier(score)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ========================================= */}
            {/* SKILLS                                    */}
            {/* ========================================= */}

            <section className="rounded-2xl border border-stone-800 bg-[#12100f] p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">
                    Skills
                  </p>

                  <h2 className="mt-2 font-serif text-2xl font-bold">
                    Skills & Proficiencies
                  </h2>
                </div>

                <Sparkles className="h-5 w-5 text-stone-700" />
              </div>

              <div className="mt-7 grid gap-2 sm:grid-cols-2">
                {skills.map((skill) => {
                  const modifier = getModifier(abilities[skill.ability]);

                  return (
                    <div
                      key={skill.name}
                      className="group flex items-center justify-between rounded-lg border border-stone-800 bg-[#0d0b0a] px-4 py-3 transition hover:border-amber-500/20 hover:bg-amber-500/[0.02]"
                    >
                      <div className="flex items-center gap-3">
                        {/* Proficiency indicator */}
                        <div className="flex h-5 w-5 items-center justify-center rounded-full border border-stone-700">
                          <div className="h-2 w-2 rounded-full bg-stone-800 transition group-hover:bg-amber-500/40" />
                        </div>

                        <div>
                          <p className="text-sm font-medium text-stone-300">
                            {skill.name}
                          </p>

                          <p className="mt-0.5 text-xs text-stone-600">
                            {skill.ability} · {abilityNames[skill.ability]}
                          </p>
                        </div>
                      </div>

                      <span className="font-semibold text-amber-400">
                        {modifier >= 0 ? `+${modifier}` : modifier}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* ========================================= */}
            {/* SAVING THROWS                             */}
            {/* ========================================= */}

            <section className="rounded-2xl border border-stone-800 bg-[#12100f] p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">
                    Saving Throws
                  </p>

                  <h2 className="mt-2 font-serif text-2xl font-bold">
                    Saving Throws
                  </h2>
                </div>

                <Shield className="h-5 w-5 text-stone-700" />
              </div>

              <div className="mt-7 grid gap-2 sm:grid-cols-2">
                {savingThrows.map((savingThrow) => {
                  const modifier = getModifier(abilities[savingThrow.ability]);

                  return (
                    <div
                      key={savingThrow.ability}
                      className="group flex items-center justify-between rounded-lg border border-stone-800 bg-[#0d0b0a] px-4 py-3 transition hover:border-amber-500/20 hover:bg-amber-500/[0.02]"
                    >
                      <div className="flex items-center gap-3">
                        {/* Proficiency indicator */}
                        <div className="flex h-5 w-5 items-center justify-center rounded-full border border-stone-700">
                          <div className="h-2 w-2 rounded-full bg-stone-800 transition group-hover:bg-amber-500/40" />
                        </div>

                        <div>
                          <p className="text-sm font-medium text-stone-300">
                            {savingThrow.name}
                          </p>

                          <p className="mt-0.5 text-xs text-stone-600">
                            {savingThrow.ability}
                          </p>
                        </div>
                      </div>

                      <span className="font-semibold text-amber-400">
                        {modifier >= 0 ? `+${modifier}` : modifier}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ========================================= */}
            {/* BACKGROUND                                */}
            {/* ========================================= */}

            <section className="rounded-2xl border border-stone-800 bg-[#12100f] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/5">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-stone-600">
                    Background
                  </p>

                  <h2 className="mt-1 font-serif text-xl font-bold">
                    {character.background}
                  </h2>
                </div>
              </div>
            </section>

            {/* ========================================= */}
            {/* STORY                                     */}
            {/* ========================================= */}

            <section className="rounded-2xl border border-stone-800 bg-[#12100f] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/5">
                  <BookOpen className="h-5 w-5 text-amber-400" />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-stone-600">
                    Biography
                  </p>

                  <h2 className="mt-1 font-serif text-xl font-bold">
                    Character Story
                  </h2>
                </div>
              </div>

              <p className="mt-6 text-sm leading-8 text-stone-500">
                {character.story || "No story has been written yet."}
              </p>
            </section>

            {/* ========================================= */}
            {/* QUICK SUMMARY                              */}
            {/* ========================================= */}

            <section className="rounded-2xl border border-amber-500/10 bg-amber-500/5 p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">
                Character Summary
              </p>

              <p className="mt-4 text-sm leading-7 text-stone-400">
                {character.name} is a level {character.level}{" "}
                {character.race.toLowerCase()} {character.class.toLowerCase()}{" "}
                with a {character.alignment.toLowerCase()} alignment. Their
                journey begins with the {character.background.toLowerCase()}{" "}
                background.
              </p>
            </section>
          </div>
        </div>

        {/* ========================================= */}
        {/* FOOTER ACTIONS                            */}
        {/* ========================================= */}

        <div className="mt-8 flex flex-col gap-3 border-t border-stone-900 pt-8 sm:flex-row sm:justify-between">
          <Link
            href="/characters"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-stone-800 px-5 py-3 text-sm text-stone-400 transition hover:border-stone-600 hover:text-stone-200"
          >
            <ArrowLeft className="h-4 w-4" />
            All Characters
          </Link>

          <Link
            href={`/characters/${character.id}/edit`}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-400"
          >
            <Edit3 className="h-4 w-4" />
            Edit Character
          </Link>
        </div>
      </div>
    </main>
  );
}

/* ================================================= */
/* INFO ITEM                                         */
/* ================================================= */

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-stone-600">
        {label}
      </p>

      <p className="mt-2 text-sm font-medium text-stone-300">{value}</p>
    </div>
  );
}

/* ================================================= */
/* STAT CARD                                         */
/* ================================================= */

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-stone-800 bg-[#12100f] p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/5 text-amber-400">
          {icon}
        </div>

        <span className="text-xs uppercase tracking-widest text-stone-700">
          {description}
        </span>
      </div>

      <p className="mt-5 text-xs uppercase tracking-widest text-stone-600">
        {label}
      </p>

      <p className="mt-1 font-serif text-3xl font-bold text-stone-200">
        {value}
      </p>
    </div>
  );
}
