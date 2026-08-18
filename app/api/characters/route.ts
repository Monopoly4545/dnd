import { NextResponse } from "next/server";
import { query } from "@/lib/db";

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
    console.error("Error fetching characters:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch characters",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

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

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Character name is required." },
        { status: 400 },
      );
    }

    if (!race) {
      return NextResponse.json(
        { error: "Race is required." },
        { status: 400 },
      );
    }

    if (!characterClass) {
      return NextResponse.json(
        { error: "Class is required." },
        { status: 400 },
      );
    }

    if (!alignment) {
      return NextResponse.json(
        { error: "Alignment is required." },
        { status: 400 },
      );
    }

    if (!background) {
      return NextResponse.json(
        { error: "Background is required." },
        { status: 400 },
      );
    }

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
      RETURNING *
      `,
      [
        name.trim(),
        race,
        characterClass,
        level,
        alignment,
        background,
        abilities?.STR ?? 10,
        abilities?.DEX ?? 10,
        abilities?.CON ?? 10,
        abilities?.INT ?? 10,
        abilities?.WIS ?? 10,
        abilities?.CHA ?? 10,
        story?.trim() || null,
      ],
    );

    return NextResponse.json(rows[0], {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating character:", error);

    return NextResponse.json(
      {
        error: "Failed to create character.",
      },
      {
        status: 500,
      },
    );
  }
}