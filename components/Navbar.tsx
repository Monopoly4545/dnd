"use client";

import { Menu, Swords, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10">
              <Swords className="h-5 w-5 text-amber-400" />
            </div>

            <div>
              <span className="block font-serif text-lg font-bold tracking-wide text-stone-100">
                Character Forge
              </span>

              <span className="hidden text-[10px] uppercase tracking-[0.25em] text-stone-500 sm:block">
                Adventure Awaits
              </span>
            </div>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/features"
              className="text-sm text-stone-400 transition hover:text-amber-400"
            >
              Features
            </Link>

            <Link
              href="/about"
              className="text-sm text-stone-400 transition hover:text-amber-400"
            >
              About
            </Link>

            <Link
              href="/characters/new"
              className="text-sm text-stone-400 transition hover:text-amber-400"
            >
              Create
            </Link>

            <Link
              href="/characters"
              className="text-sm text-stone-400 transition hover:text-amber-400"
            >
              Characters
            </Link>

            <button
              type="button"
              className="rounded-lg border border-stone-700 px-5 py-2.5 text-sm font-medium text-stone-300 transition hover:border-amber-500/50 hover:bg-amber-500/10"
            >
              Sign In
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg border border-stone-700 p-2 text-stone-300 transition hover:border-amber-500/50 md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile navigation */}
        {isOpen && (
          <div className="mt-4 rounded-xl border border-stone-800 bg-[#12100f]/95 p-4 backdrop-blur-md md:hidden">
            <div className="flex flex-col gap-2">
              <Link
                href="/features"
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-4 py-3 text-sm text-stone-400 transition hover:bg-stone-900 hover:text-amber-400"
              >
                Features
              </Link>

              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-4 py-3 text-sm text-stone-400 transition hover:bg-stone-900 hover:text-amber-400"
              >
                About
              </Link>

              <Link
                href="/create"
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-4 py-3 text-sm text-stone-400 transition hover:bg-stone-900 hover:text-amber-400"
              >
                Create
              </Link>

              <Link
                href="/characters"
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-4 py-3 text-sm text-stone-400 transition hover:bg-stone-900 hover:text-amber-400"
              >
                Characters
              </Link>

              <button
                type="button"
                className="mt-2 rounded-lg border border-stone-700 px-4 py-3 text-left text-sm text-stone-300 transition hover:border-amber-500/50 hover:bg-amber-500/10"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}