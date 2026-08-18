import { Heart, Sparkles, Swords, Target, Users } from "lucide-react";

import Navbar from "../../components/Navbar";

const values = [
  {
    icon: Sparkles,
    title: "Simple",
    description:
      "Character creation should be exciting, not complicated. We focus on making every step clear and intuitive.",
  },
  {
    icon: Swords,
    title: "Adventure First",
    description:
      "The character sheet exists to support the adventure. Everything is designed around getting you ready to play.",
  },
  {
    icon: Users,
    title: "For Players",
    description:
      "Built with tabletop players in mind, from first-time adventurers to experienced campaign veterans.",
  },
];

export default function About() {
  return (
    <main className="min-h-screen bg-[#0b0908]">
      <Navbar />
      {/* Hero */}
      <section className="relative overflow-hidden pt-36 pb-28">
        <div className="absolute left-1/2 top-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/5">
            <Swords className="h-6 w-6 text-amber-400" />
          </div>

          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
            About Character Forge
          </p>

          <h1 className="mt-5 font-serif text-5xl font-bold tracking-tight text-stone-100 sm:text-6xl">
            Built for
            <span className="block text-amber-400">adventurers.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-stone-500">
            Character Forge is a character management experience designed to
            make creating and preparing tabletop RPG characters simple,
            beautiful, and enjoyable.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="border-y border-stone-900 bg-[#0e0c0b] py-24">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
              Our Story
            </p>

            <h2 className="mt-5 font-serif text-4xl font-bold text-stone-100">
              Every hero starts with
              <span className="block text-amber-400">an idea.</span>
            </h2>
          </div>

          <div className="space-y-5 text-sm leading-8 text-stone-500">
            <p>
              A great tabletop adventure begins long before the first dice are
              rolled. It begins with an idea — a character, a story, and a world
              waiting to be explored.
            </p>

            <p>
              Character Forge was created to make that first step easier.
              Instead of dealing with scattered notes and complicated character
              sheets, you can bring everything together in one focused
              experience.
            </p>

            <p>
              Whether you're creating your first adventurer or preparing another
              character for your next campaign, the goal is simple: spend less
              time managing your sheet and more time playing.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
              What We Believe
            </p>

            <h2 className="mt-5 font-serif text-4xl font-bold text-stone-100">
              Built around the adventure
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="rounded-xl border border-stone-800 bg-[#12100f] p-8 text-center"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/5">
                    <Icon className="h-5 w-5 text-amber-400" />
                  </div>

                  <h3 className="mt-6 font-serif text-xl font-bold text-stone-200">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-stone-500">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="border-t border-stone-900 py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Target className="mx-auto h-7 w-7 text-amber-500" />

          <h2 className="mt-6 font-serif text-4xl font-bold text-stone-100">
            Our mission
          </h2>

          <p className="mt-6 text-lg leading-9 text-stone-500">
            Make character creation feel like the beginning of an adventure —
            not the preparation for one.
          </p>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-stone-600">
            <Heart className="h-4 w-4 text-amber-500" />
            Made for tabletop adventurers
          </div>
        </div>
      </section>
    </main>
  );
}
