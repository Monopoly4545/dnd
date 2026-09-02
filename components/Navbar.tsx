"use client";

import {
  LogOut,
  Menu,
  Swords,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const { user, loading, logout } = useAuth();

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    closeMenu();
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenu}
            className="group flex items-center gap-3"
          >
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

          {/* Desktop */}
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

            {/* Authenticated navigation */}
            {user && (
              <>
                <Link
                  href="/characters"
                  className="text-sm text-stone-400 transition hover:text-amber-400"
                >
                  Characters
                </Link>

                <Link
                  href="/characters/new"
                  className="text-sm text-stone-400 transition hover:text-amber-400"
                >
                  Create
                </Link>
              </>
            )}

            {/* Auth state */}
            {loading ? (
              <div className="h-9 w-24 animate-pulse rounded-lg bg-stone-800" />
            ) : user ? (
              <div className="flex items-center gap-3">

                {/* User */}
                <Link
                  href="/profile"
                  className="flex items-center gap-2 rounded-lg border border-stone-800 px-3 py-1.5 transition hover:border-amber-500/30 hover:bg-amber-500/5"
                >
                  <User className="h-4 w-4 text-amber-400" />

                  <span className="text-sm text-stone-300">
                    {user.username}
                  </span>
                </Link>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg border border-stone-700 px-4 py-2 text-sm font-medium text-stone-300 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">

                <Link
                  href="/login"
                  className="text-sm text-stone-400 transition hover:text-amber-400"
                >
                  Sign In
                </Link>

                <Link
                  href="/register"
                  className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-stone-950 transition hover:bg-amber-400"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile button */}
          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="rounded-lg border border-stone-700 p-2 text-stone-300 transition hover:border-amber-500/50 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="mt-4 rounded-xl border border-stone-800 bg-[#12100f]/95 p-4 backdrop-blur-md md:hidden">
            <div className="flex flex-col gap-2">

              <Link
                href="/features"
                onClick={closeMenu}
                className="rounded-lg px-4 py-3 text-sm text-stone-400 transition hover:bg-stone-900 hover:text-amber-400"
              >
                Features
              </Link>

              <Link
                href="/about"
                onClick={closeMenu}
                className="rounded-lg px-4 py-3 text-sm text-stone-400 transition hover:bg-stone-900 hover:text-amber-400"
              >
                About
              </Link>

              {/* Authenticated links */}
              {user && (
                <>
                  <Link
                    href="/characters"
                    onClick={closeMenu}
                    className="rounded-lg px-4 py-3 text-sm text-stone-400 transition hover:bg-stone-900 hover:text-amber-400"
                  >
                    My Characters
                  </Link>

                  <Link
                    href="/characters/new"
                    onClick={closeMenu}
                    className="rounded-lg px-4 py-3 text-sm text-stone-400 transition hover:bg-stone-900 hover:text-amber-400"
                  >
                    Create Character
                  </Link>
                </>
              )}

              {/* Loading */}
              {loading ? (
                <div className="mt-2 h-11 animate-pulse rounded-lg bg-stone-800" />
              ) : user ? (
                <>
                  {/* User */}
                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    className="mt-2 flex items-center gap-2 rounded-lg border border-stone-800 px-4 py-3"
                  >
                    <User className="h-4 w-4 text-amber-400" />

                    <span className="text-sm text-stone-300">
                      {user.username}
                    </span>
                  </Link>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 flex items-center gap-2 rounded-lg border border-stone-700 px-4 py-3 text-left text-sm text-stone-300 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="mt-2 rounded-lg border border-stone-700 px-4 py-3 text-center text-sm text-stone-300 transition hover:border-amber-500/50 hover:bg-amber-500/10"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="rounded-lg bg-amber-500 px-4 py-3 text-center text-sm font-semibold text-stone-950 transition hover:bg-amber-400"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}