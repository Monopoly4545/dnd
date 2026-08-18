import Link from "next/link";
import {
  ArrowRight,
  Dice5,
  ScrollText,
  Swords,
  Sparkles,
} from "lucide-react";

import Navbar from "../components/Navbar";

const features = [
  {
    icon: ScrollText,
    title: "Character Builder",
    description:
      "Create detailed characters with races, classes, abilities, skills, equipment, and more.",
  },
  {
    icon: Dice5,
    title: "Built for Adventure",
    description:
      "Keep everything you need for your next campaign organized in one beautiful character sheet.",
  },
  {
    icon: Swords,
    title: "Play Your Way",
    description:
      "Build heroes, villains, warriors, wizards, rogues, and anything your imagination can create.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0b0908] text-stone-100">
      {/* ==================== NAVBAR ==================== */}
      <Navbar />

      {/* ==================== HERO ==================== */}
      <section className="relative flex min-h-screen items-center">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_45%,rgba(180,120,35,0.16),transparent_35%)]" />

          <div className="absolute inset-0 bg-[linear-gradient(90deg,#0b0908_0%,rgba(11,9,8,0.92)_45%,rgba(11,9,8,0.45)_100%)]" />

          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0b0908] to-transparent" />
        </div>

        {/* Decorative lines */}
        <div className="absolute left-0 top-1/3 h-px w-32 bg-gradient-to-r from-transparent to-amber-500/30" />

        <div className="absolute right-0 top-2/3 h-px w-40 bg-gradient-to-l from-transparent to-amber-500/20" />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-6 pt-24 lg:grid-cols-2 lg:px-8">
          {/* Left Content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />

              <span className="text-xs font-medium uppercase tracking-[0.2em] text-amber-400">
                Your adventure begins here
              </span>
            </div>

            {/* Heading */}
            <h1 className="font-serif text-5xl font-bold leading-[1.05] tracking-tight text-stone-100 sm:text-6xl lg:text-7xl">
              Create Your
              <span className="block text-amber-400">Legend.</span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-xl text-lg leading-8 text-stone-400 sm:text-xl">
              Forge unforgettable characters, shape their stories, and prepare
              them for adventures beyond imagination.
            </p>

            {/* Buttons */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/characters/new"
                className="group inline-flex items-center justify-center gap-3 rounded-lg bg-amber-500 px-7 py-3.5 font-semibold text-stone-950 transition hover:bg-amber-400"
              >
                Create Your Character

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-lg border border-stone-700 px-7 py-3.5 font-medium text-stone-300 transition hover:border-stone-500 hover:bg-white/5"
              >
                Explore Features
              </a>
            </div>

            {/* Stats */}
            <div className="mt-12 flex items-center gap-8 border-t border-stone-800 pt-7">
              <div>
                <p className="font-serif text-2xl font-bold text-stone-200">
                  ∞
                </p>

                <p className="mt-1 text-xs uppercase tracking-wider text-stone-600">
                  Possibilities
                </p>
              </div>

              <div className="h-8 w-px bg-stone-800" />

              <div>
                <p className="font-serif text-2xl font-bold text-stone-200">
                  1
                </p>

                <p className="mt-1 text-xs uppercase tracking-wider text-stone-600">
                  Adventure
                </p>
              </div>

              <div className="h-8 w-px bg-stone-800" />

              <div>
                <p className="font-serif text-2xl font-bold text-stone-200">
                  You
                </p>

                <p className="mt-1 text-xs uppercase tracking-wider text-stone-600">
                  The Hero
                </p>
              </div>
            </div>
          </div>

          {/* ==================== HERO VISUAL ==================== */}
          <div className="relative hidden h-[600px] lg:block">
            {/* Glow */}
            <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl" />

            {/* Character Sheet */}
            <div className="absolute left-1/2 top-1/2 w-[390px] -translate-x-1/2 -translate-y-1/2 rotate-3 rounded-xl border border-amber-500/20 bg-[#171311]/95 p-7 shadow-2xl shadow-black/60 backdrop-blur">
              {/* Sheet Header */}
              <div className="border-b border-stone-700 pb-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-amber-500">
                      Character
                    </p>

                    <h2 className="mt-2 font-serif text-3xl font-bold text-stone-100">
                      Aldric
                    </h2>

                    <p className="mt-1 text-sm text-stone-500">
                      Human • Paladin • Level 5
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10">
                    <Swords className="h-5 w-5 text-amber-400" />
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 py-6">
                {[
                  ["STR", "18"],
                  ["DEX", "12"],
                  ["CON", "16"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-lg border border-stone-800 bg-stone-900/60 p-3 text-center"
                  >
                    <p className="text-[10px] tracking-widest text-stone-600">
                      {label}
                    </p>

                    <p className="mt-1 font-serif text-xl font-bold text-amber-400">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* HP */}
              <div className="rounded-lg border border-stone-800 bg-stone-900/60 p-4">
                <div className="flex justify-between text-xs">
                  <span className="uppercase tracking-widest text-stone-500">
                    Hit Points
                  </span>

                  <span className="font-semibold text-stone-300">
                    42 / 42
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-800">
                  <div className="h-full w-full rounded-full bg-amber-500" />
                </div>
              </div>

              {/* Skills */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  "Athletics +7",
                  "Insight +4",
                  "Persuasion +6",
                  "Religion +4",
                ].map((skill) => (
                  <div
                    key={skill}
                    className="rounded-md border border-stone-800 px-3 py-2 text-xs text-stone-500"
                  >
                    {skill}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-6 flex items-center justify-between border-t border-stone-800 pt-5">
                <span className="text-[10px] uppercase tracking-widest text-stone-600">
                  Character Forge
                </span>

                <Dice5 className="h-5 w-5 text-stone-700" />
              </div>
            </div>

            {/* Floating Dice */}
            <div className="absolute right-4 top-20 flex h-16 w-16 rotate-12 items-center justify-center rounded-xl border border-amber-500/20 bg-[#171311] shadow-xl">
              <Dice5 className="h-7 w-7 text-amber-400" />
            </div>

            {/* Floating D20 */}
            <div className="absolute bottom-24 left-4 flex h-12 w-12 -rotate-12 items-center justify-center rounded-lg border border-stone-700 bg-[#171311] shadow-xl">
              <span className="font-serif font-bold text-stone-500">
                20
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section
        id="features"
        className="relative border-t border-stone-900 bg-[#0d0b0a] py-28"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section Header */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
              The Forge
            </p>

            <h2 className="mt-4 font-serif text-4xl font-bold text-stone-100 sm:text-5xl">
              Everything you need to begin
            </h2>

            <p className="mt-5 text-stone-500">
              Build your character without fighting through complicated
              interfaces.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-xl border border-stone-800 bg-[#12100f] p-7 transition duration-300 hover:-translate-y-1 hover:border-amber-500/30"
                >
                  {/* Icon */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/5">
                    <Icon className="h-5 w-5 text-amber-400" />
                  </div>

                  {/* Title */}
                  <h3 className="mt-6 font-serif text-xl font-bold text-stone-200">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-sm leading-7 text-stone-500">
                    {feature.description}
                  </p>

                  {/* Hover Line */}
                  <div className="mt-6 h-px w-0 bg-amber-500 transition-all duration-500 group-hover:w-full" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section
        id="start"
        className="relative overflow-hidden border-t border-stone-900 py-32"
      >
        {/* Background Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(180,120,35,0.12),transparent_45%)]" />

        <div className="relative mx-auto max-w-3xl px-6 text-center">
          {/* Icon */}
          <Swords className="mx-auto h-8 w-8 text-amber-500" />

          {/* Heading */}
          <h2 className="mt-7 font-serif text-4xl font-bold text-stone-100 sm:text-5xl">
            Your story is waiting.
          </h2>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-xl text-stone-500">
            Gather your courage. Choose your path. Create the character who
            will become part of your next great adventure.
          </p>

          {/* CTA Button */}
          <Link
            href="/characters/new"
            className="group mt-9 inline-flex items-center gap-3 rounded-lg bg-amber-500 px-8 py-4 font-semibold text-stone-950 transition hover:bg-amber-400"
          >
            Begin Your Adventure

            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-stone-900 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-stone-600 sm:flex-row">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Swords className="h-4 w-4 text-amber-500" />

            <span>Character Forge</span>
          </div>

          {/* Copyright */}
          <p>© 2026 Character Forge. Crafted for adventurers.</p>
        </div>
      </footer>
    </main>
  );
}