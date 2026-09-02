import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/authHelpers";
import type { CreateCharacterInput, Abilities, ApiResponse } from "@/types/type";

/**
 * GET /api/characters
 *
 * Get all characters for the authenticated user.
 */
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const characters = await query(
      `
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
        inspiration,
        speed,
        temporary_hit_points,
        story,
        user_id,
        created_at,
        updated_at
      FROM characters
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [user.id],
    );

    return NextResponse.json(characters);
  } catch (error) {
    console.error("GET /api/characters error:", error);

    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to fetch characters." },
      { status: 500 },
    );
  }
}

/**
 * POST /api/characters
 *
 * Create a new character for the authenticated user.
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

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
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Character name is required." },
        { status: 400 },
      );
    }

    if (!race || typeof race !== "string") {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Race is required." },
        { status: 400 },
      );
    }

    if (!characterClass || typeof characterClass !== "string") {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Class is required." },
        { status: 400 },
      );
    }

    if (!alignment || typeof alignment !== "string") {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Alignment is required." },
        { status: 400 },
      );
    }

    if (!background || typeof background !== "string") {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Background is required." },
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
        story,
        user_id
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
        $13,
        $14
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
        inspiration,
        speed,
        temporary_hit_points,
        story,
        user_id,
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
        user.id,
      ],
    );

    return NextResponse.json(rows[0], {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/characters error:", error);

    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to create character." },
      { status: 500 },
    );
  }
}
