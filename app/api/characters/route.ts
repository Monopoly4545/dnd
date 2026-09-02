import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import type { CreateCharacterInput, Abilities } from "@/types/type";

/**
 * GET /api/characters
 *
 * Get all characters.
 */
export async function GET() {
  try {
    const characters = await query(`
      SELECT
        id,
        name,
        race,
        class,
        level,
        alignment,
        background,
        strength,
        dexterity,
        constitution,
        intelligence,
        wisdom,
        charisma,
        story,
        created_at,
        updated_at
      FROM characters
      ORDER BY created_at DESC
    `);

    return NextResponse.json(characters);
  } catch (error) {
    console.error("GET /api/characters error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch characters.",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/characters
 *
 * Create a new character.
 */
export async function POST(request: Request) {
  try {
    const body: CreateCharacterInput = await request.json();

    const {
      name,
      race,
      class: characterClass,
      level,
      alignment,
      background,
      abilities,
      story,
    } = body;

    // --------------------------------
    // Validation
    // --------------------------------

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        {
          error: "Character name is required.",
        },
        { status: 400 },
      );
    }

    if (!race || typeof race !== "string") {
      return NextResponse.json(
        {
          error: "Race is required.",
        },
        { status: 400 },
      );
    }

    if (!characterClass || typeof characterClass !== "string") {
      return NextResponse.json(
        {
          error: "Class is required.",
        },
        { status: 400 },
      );
    }

    if (!alignment || typeof alignment !== "string") {
      return NextResponse.json(
        {
          error: "Alignment is required.",
        },
        { status: 400 },
      );
    }

    if (!background || typeof background !== "string") {
      return NextResponse.json(
        {
          error: "Background is required.",
        },
        { status: 400 },
      );
    }

    // --------------------------------
    // Ability scores
    // --------------------------------

    const strength = Number(abilities?.STR ?? 10);
    const dexterity = Number(abilities?.DEX ?? 10);
    const constitution = Number(abilities?.CON ?? 10);
    const intelligence = Number(abilities?.INT ?? 10);
    const wisdom = Number(abilities?.WIS ?? 10);
    const charisma = Number(abilities?.CHA ?? 10);

    // --------------------------------
    // Insert
    // --------------------------------

    const rows = await query(
      `
      INSERT INTO characters (
        name,
        race,
        class,
        level,
        alignment,
        background,
        strength,
        dexterity,
        constitution,
        intelligence,
        wisdom,
        charisma,
        story
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        $12,
        $13
      )
      RETURNING
        id,
        name,
        race,
        class,
        level,
        alignment,
        background,
        strength,
        dexterity,
        constitution,
        intelligence,
        wisdom,
        charisma,
        story,
        created_at,
        updated_at
      `,
      [
        name.trim(),
        race,
        characterClass,
        level ?? 1,
        alignment,
        background,
        strength,
        dexterity,
        constitution,
        intelligence,
        wisdom,
        charisma,
        story?.trim() || null,
      ],
    );

    return NextResponse.json(rows[0], {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/characters error:", error);

    return NextResponse.json(
      {
        error: "Failed to create character.",
      },
      { status: 500 },
    );
  }
}