import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser, checkCharacterOwnership } from "@/lib/authHelpers";
import type { CreateCharacterInput, Abilities, ApiResponse, DeleteCharacterResponse } from "@/types/type";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET /api/characters/:id
 *
 * Get a single character (must belong to authenticated user).
 */
export async function GET(request: Request, { params }: RouteContext) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Character ID is required." },
        { status: 400 },
      );
    }

    const rows = await query(
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
      WHERE id = $1 AND user_id = $2
      `,
      [id, user.id],
    );

    if (rows.length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Character not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("GET /api/characters/[id] error:", error);

    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to fetch character." },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/characters/:id
 *
 * Replace/update the entire character (must belong to authenticated user).
 */
export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const body: CreateCharacterInput = await request.json();

    if (!id) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Character ID is required." },
        { status: 400 },
      );
    }

    // Check ownership
    const isOwner = await checkCharacterOwnership(id, user.id);
    if (!isOwner) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Character not found." },
        { status: 404 },
      );
    }

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
    // Update
    // --------------------------------

    const rows = await query(
      `
      UPDATE characters
      SET
        name = $1,
        race = $2,
        class = $3,
        level = $4,
        alignment = $5,
        background = $6,
        strength = $7,
        dexterity = $8,
        constitution = $9,
        intelligence = $10,
        wisdom = $11,
        charisma = $12,
        story = $13,
        updated_at = NOW()
      WHERE id = $14
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
        id,
      ],
    );

    if (rows.length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Character not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("PUT /api/characters/[id] error:", error);

    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to update character." },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/characters/:id
 *
 * Partially update a character (must belong to authenticated user).
 */
export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const body: Partial<CreateCharacterInput> = await request.json();

    if (!id) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Character ID is required." },
        { status: 400 },
      );
    }

    // --------------------------------
    // Get current character (and verify ownership)
    // --------------------------------

    const existingRows = await query<
      {
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
        story: string | null;
        user_id: string;
      }
    >(
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
        story,
        user_id
      FROM characters
      WHERE id = $1 AND user_id = $2
      `,
      [id, user.id],
    );

    if (existingRows.length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Character not found." },
        { status: 404 },
      );
    }

    const existing = existingRows[0];

    // --------------------------------
    // Merge values
    // --------------------------------

    const name = body.name !== undefined ? body.name : existing.name;

    const race = body.race !== undefined ? body.race : existing.race;

    const characterClass =
      body.class !== undefined ? body.class : existing.class;

    const level = body.level !== undefined ? body.level : existing.level;

    const alignment =
      body.alignment !== undefined ? body.alignment : existing.alignment;

    const background =
      body.background !== undefined ? body.background : existing.background;

    const abilities: Partial<Abilities> = body.abilities ?? {};

    const strength =
      abilities.STR !== undefined
        ? Number(abilities.STR)
        : existing.strength;

    const dexterity =
      abilities.DEX !== undefined
        ? Number(abilities.DEX)
        : existing.dexterity;

    const constitution =
      abilities.CON !== undefined
        ? Number(abilities.CON)
        : existing.constitution;

    const intelligence =
      abilities.INT !== undefined
        ? Number(abilities.INT)
        : existing.intelligence;

    const wisdom =
      abilities.WIS !== undefined ? Number(abilities.WIS) : existing.wisdom;

    const charisma =
      abilities.CHA !== undefined
        ? Number(abilities.CHA)
        : existing.charisma;

    const story =
      body.story !== undefined
        ? body.story?.trim() || null
        : existing.story;

    // --------------------------------
    // Validate merged data
    // --------------------------------

    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Character name is required." },
        { status: 400 },
      );
    }

    if (typeof race !== "string" || !race) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Race is required." },
        { status: 400 },
      );
    }

    if (typeof characterClass !== "string" || !characterClass) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Class is required." },
        { status: 400 },
      );
    }

    if (typeof alignment !== "string" || !alignment) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Alignment is required." },
        { status: 400 },
      );
    }

    if (typeof background !== "string" || !background) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Background is required." },
        { status: 400 },
      );
    }

    // --------------------------------
    // Update
    // --------------------------------

    const rows = await query(
      `
      UPDATE characters
      SET
        name = $1,
        race = $2,
        class = $3,
        level = $4,
        alignment = $5,
        background = $6,
        strength = $7,
        dexterity = $8,
        constitution = $9,
        intelligence = $10,
        wisdom = $11,
        charisma = $12,
        story = $13,
        updated_at = NOW()
      WHERE id = $14
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
        id,
      ],
    );

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("PATCH /api/characters/[id] error:", error);

    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to partially update character." },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/characters/:id
 *
 * Delete a character (must belong to authenticated user).
 */
export async function DELETE(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Character ID is required." },
        { status: 400 },
      );
    }

    const rows = await query(
      `
      DELETE FROM characters
      WHERE id = $1 AND user_id = $2
      RETURNING id, name
      `,
      [id, user.id],
    );

    if (rows.length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Character not found." },
        { status: 404 },
      );
    }

    return NextResponse.json<DeleteCharacterResponse>({
      success: true,
      message: "Character deleted successfully.",
      character: rows[0],
    });
  } catch (error) {
    console.error("DELETE /api/characters/[id] error:", error);

    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to delete character." },
      { status: 500 },
    );
  }
}
