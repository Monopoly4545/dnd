import {
  BookOpen,
  Check,
  Dice5,
  Shield,
  Sparkles,
  Swords,
  Users,
  WandSparkles,
} from "lucide-react";

import Navbar from "../../components/Navbar";

const features = [
  {
    icon: WandSparkles,
    title: "Character Builder",
    description:
      "Create your character step by step. Choose a race, class, background, abilities, skills, equipment, and more.",
  },
  {
    icon: ScrollIcon,
    title: "Detailed Character Sheets",
    description:
      "Keep your character's stats, abilities, equipment, spells, and important information organized in one place.",
  },
  {
    icon: Dice5,
    title: "Dice Rolling",
    description:
      "Quickly roll the dice you need for your adventure without leaving your character sheet.",
  },
  {
    icon: Shield,
    title: "Character Progression",
    description:
      "Track your character as they level up, gain abilities, improve their stats, and become stronger.",
  },
  {
    icon: Users,
    title: "Multiple Characters",
    description:
      "Create and manage multiple characters for different campaigns and adventures.",
  },
  {
    icon: BookOpen,
    title: "Everything Organized",
    description:
      "Keep your character information together so you can focus on playing instead of managing paperwork.",
  },
];

function ScrollIcon(props: React.ComponentProps<typeof BookOpen>) {
  return <BookOpen {...props} />;
}

const benefits = [
  "Fast character creation",
  "Clean and easy-to-use interface",
  "Detailed character information",
  "Designed for desktop and mobile",
  "Save and manage your characters",
  "Built for tabletop adventures",
];

export default function Features() {
  return (
    <main className="min-h-screen bg-[#0b0908]">
      <Navbar />
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-stone-900 pt-36 pb-24">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
            The Forge
          </p>

          <h1 className="mt-5 font-serif text-5xl font-bold tracking-tight text-stone-100 sm:text-6xl">
            Tools for your
            <span className="block text-amber-400">next adventure.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-stone-500">
            Everything you need to create, manage, and prepare your characters
            for the adventures ahead.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-xl border border-stone-800 bg-[#12100f] p-7 transition duration-300 hover:-translate-y-1 hover:border-amber-500/30"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/5">
                    <Icon className="h-5 w-5 text-amber-400" />
                  </div>

                  <h2 className="mt-6 font-serif text-xl font-bold text-stone-200">
                    {feature.title}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-stone-500">
                    {feature.description}
                  </p>

                  <div className="mt-6 h-px w-0 bg-amber-500 transition-all duration-500 group-hover:w-full" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Character Forge */}
      <section className="border-y border-stone-900 bg-[#0e0c0b] py-24">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
              Why Character Forge
            </p>

            <h2 className="mt-5 font-serif text-4xl font-bold text-stone-100">
              Less paperwork.
              <span className="block text-amber-400">More adventure.</span>
            </h2>

            <p className="mt-6 max-w-lg leading-8 text-stone-500">
              Your character sheet should help you play the game, not get in the
              way of it. Character Forge keeps your important information
              organized in a simple and immersive interface.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-3 rounded-lg border border-stone-800 bg-[#12100f] px-5 py-4"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
                  <Check className="h-4 w-4 text-amber-400" />
                </div>

                <span className="text-sm text-stone-400">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Sparkles className="mx-auto h-7 w-7 text-amber-500" />

          <h2 className="mt-6 font-serif text-4xl font-bold text-stone-100">
            Ready to forge your character?
          </h2>

          <p className="mt-5 text-stone-500">
            Your next adventure starts with the character you create today.
          </p>

          <a
            href="/create"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-7 py-3.5 font-semibold text-stone-950 transition hover:bg-amber-400"
          >
            <Swords className="h-4 w-4" />
            Create Character
          </a>
        </div>
      </section>
    </main>
  );
}
