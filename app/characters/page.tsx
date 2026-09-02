"use client";

import Navbar from "../../components/Navbar";
import { ArrowRight, Plus, Search, Shield, Swords, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Character, AbilityKey } from "@/types/type";

export default function CharacterList() {
  const router = useRouter();

  const [characters, setCharacters] = useState<Character[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------
  // Fetch characters
  // --------------------------------

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/characters");

        if (!response.ok) {
          throw new Error("Failed to fetch characters");
        }

        const data = await response.json();

        const mappedCharacters: Character[] = data.map((character: any) => ({
          id: character.id,
          name: character.name,
          race: character.race,
          class: character.class,
          level: character.level,
          alignment: character.alignment ?? "",
          background: character.background ?? "",

          strength: character.strength,
          dexterity: character.dexterity,
          constitution: character.constitution,
          intelligence: character.intelligence,
          wisdom: character.wisdom,
          charisma: character.charisma,

          inspiration: character.inspiration ?? false,
          speed: character.speed ?? 30,
          temporary_hit_points: character.temporary_hit_points ?? 0,

          story: character.story ?? "",

          created_at: character.created_at,
          updated_at: character.updated_at,
        }));

        setCharacters(mappedCharacters);
      } catch (error) {
        console.error("Error loading characters:", error);
        setError("Unable to load characters.");
      } finally {
        setLoading(false);
      }
    };

    loadCharacters();
  }, []);

  // --------------------------------
  // Search
  // --------------------------------

  const filteredCharacters = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return characters;
    }

    return characters.filter((character) =>
      [
        character.name,
        character.race,
        character.class,
        character.alignment,
        character.background,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [characters, search]);

  // --------------------------------
  // Delete
  // --------------------------------

  const deleteCharacter = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this character?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/characters/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();

        throw new Error(data.error || "Failed to delete character");
      }

      setCharacters((current) =>
        current.filter((character) => character.id !== id),
      );
    } catch (error) {
      console.error("Error deleting character:", error);

      alert("Failed to delete character.");
    }
  };

  // --------------------------------
  // Loading
  // --------------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b0908] px-6 pb-20 pt-32 text-stone-100">
        <div className="mx-auto max-w-6xl">
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-sm text-stone-600">Loading characters...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0908] px-6 pb-20 pt-32 text-stone-100">
      <Navbar />
      <div className="mx-auto max-w-6xl">
        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Header */}

        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
              Character Vault
            </p>

            <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">
              Your Characters
            </h1>

            <p className="mt-3 max-w-xl text-stone-500">
              View, manage, and continue the adventures of your characters.
            </p>
          </div>

          <Link
            href="/characters/new"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-400"
          >
            <Plus className="h-4 w-4" />
            Create Character
          </Link>
        </div>

        {/* Search */}

        {characters.length > 0 && (
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-600" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search characters..."
                className="w-full rounded-lg border border-stone-800 bg-[#12100f] py-3 pl-11 pr-4 text-sm text-stone-200 outline-none placeholder:text-stone-700 focus:border-amber-500/50"
              />
            </div>
          </div>
        )}

        {/* Empty State */}

        {characters.length === 0 && !error && (
          <div className="rounded-2xl border border-dashed border-stone-800 bg-[#12100f] px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/5">
              <Swords className="h-7 w-7 text-amber-400" />
            </div>

            <h2 className="mt-6 font-serif text-2xl font-bold">
              No characters yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-stone-600">
              Your adventure is waiting. Create your first character and begin
              building your legend.
            </p>

            <Link
              href="/characters/new"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-400"
            >
              <Plus className="h-4 w-4" />
              Forge Your First Character
            </Link>
          </div>
        )}

        {/* No Search Results */}

        {characters.length > 0 && filteredCharacters.length === 0 && (
          <div className="rounded-2xl border border-stone-800 bg-[#12100f] px-6 py-16 text-center">
            <Search className="mx-auto h-8 w-8 text-stone-700" />

            <h2 className="mt-5 font-serif text-xl font-bold">
              No characters found
            </h2>

            <p className="mt-2 text-sm text-stone-600">
              Try searching for a different name, race, or class.
            </p>
          </div>
        )}

        {/* Character Grid */}

        {filteredCharacters.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCharacters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onDelete={deleteCharacter}
                onOpen={() => router.push(`/characters/${character.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

/* -------------------------------- */
/* Character Card                   */
/* -------------------------------- */

function CharacterCard({
  character,
  onDelete,
  onOpen,
}: {
  character: Character;
  onDelete: (id: string) => void;
  onOpen: () => void;
}) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-stone-800 bg-[#12100f] transition hover:border-stone-700">
      {/* Card Header */}

      <div className="relative border-b border-stone-800 p-6">
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/5">
            <Shield className="h-5 w-5 text-amber-400" />
          </div>

          <div className="rounded-full border border-stone-800 px-3 py-1 text-xs text-stone-500">
            Level {character.level}
          </div>
        </div>

        <h2 className="mt-5 truncate font-serif text-xl font-bold text-stone-100">
          {character.name || "Unnamed Character"}
        </h2>

        <p className="mt-1 text-sm text-stone-600">
          {character.race || "Unknown Race"}
          {" · "}
          {character.class || "Unknown Class"}
        </p>
      </div>

      {/* Details */}

      <div className="space-y-4 p-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-stone-800 bg-[#0d0b0a] p-3">
            <p className="text-[10px] uppercase tracking-widest text-stone-700">
              Alignment
            </p>

            <p className="mt-1 truncate text-sm text-stone-400">
              {character.alignment || "—"}
            </p>
          </div>

          <div className="rounded-lg border border-stone-800 bg-[#0d0b0a] p-3">
            <p className="text-[10px] uppercase tracking-widest text-stone-700">
              Background
            </p>

            <p className="mt-1 truncate text-sm text-stone-400">
              {character.background || "—"}
            </p>
          </div>
        </div>

        {/* Actions */}

        <div className="flex gap-2 pt-2">
          <button
            onClick={onOpen}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-stone-950 transition hover:bg-amber-400"
          >
            Open Sheet
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => onDelete(character.id)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-stone-800 text-stone-600 transition hover:border-red-900/50 hover:text-red-400"
            title="Delete character"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
