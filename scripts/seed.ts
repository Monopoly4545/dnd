import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const pool = new Pool({
  connectionString,
});

const characters = [
  {
    name: "Aragorn",
    race: "Human",
    class: "Fighter",
    level: 5,
    background: "Soldier",
    alignment: "Lawful Good",
    strength: 16,
    dexterity: 14,
    constitution: 15,
    intelligence: 10,
    wisdom: 12,
    charisma: 13,
    story: "A skilled warrior who has spent years protecting his people.",
  },
  {
    name: "Elara Moonshadow",
    race: "Elf",
    class: "Wizard",
    level: 3,
    background: "Sage",
    alignment: "Chaotic Good",
    strength: 8,
    dexterity: 14,
    constitution: 10,
    intelligence: 18,
    wisdom: 13,
    charisma: 12,
    story: "A young elven mage searching for forgotten magical knowledge.",
  },
  {
    name: "Thorin Stonehand",
    race: "Dwarf",
    class: "Barbarian",
    level: 4,
    background: "Outlander",
    alignment: "Neutral Good",
    strength: 18,
    dexterity: 12,
    constitution: 17,
    intelligence: 8,
    wisdom: 13,
    charisma: 10,
    story: "A fierce dwarf warrior who wandered the mountains alone.",
  },
  {
    name: "Lyra Nightbreeze",
    race: "Half-Elf",
    class: "Rogue",
    level: 2,
    background: "Criminal",
    alignment: "Chaotic Neutral",
    strength: 10,
    dexterity: 17,
    constitution: 12,
    intelligence: 14,
    wisdom: 10,
    charisma: 15,
    story: "A mysterious rogue with a talent for disappearing when trouble arrives.",
  },
];

async function seed() {
  try {
    console.log("🌱 Starting database seed...");

    for (const character of characters) {
      await pool.query(
        `
        INSERT INTO characters (
          name,
          race,
          class,
          level,
          background,
          alignment,
          strength,
          dexterity,
          constitution,
          intelligence,
          wisdom,
          charisma,
          story
        )
        VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11, $12, $13
        )
        `,
        [
          character.name,
          character.race,
          character.class,
          character.level,
          character.background,
          character.alignment,
          character.strength,
          character.dexterity,
          character.constitution,
          character.intelligence,
          character.wisdom,
          character.charisma,
          character.story,
        ],
      );

      console.log(`✅ Created: ${character.name}`);
    }

    console.log("🌱 Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();