import dotenv from "dotenv";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

// Load .env.local
dotenv.config({
  path: ".env.local",
});

// ========================================
// Database connection
// ========================================

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const pool = new Pool({
  connectionString,
});

// ========================================
// Seed users
// ========================================

const users = [
  {
    username: "admin",
    email: "admin@example.com",
    password: "admin123",
  },
  {
    username: "adventurer",
    email: "player@example.com",
    password: "password123",
  },
];

// ========================================
// Seed characters
// ========================================

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
    story:
      "A skilled warrior who has spent years protecting his people.",
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
    story:
      "A young elven mage searching for forgotten magical knowledge.",
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
    story:
      "A fierce dwarf warrior who wandered the mountains alone.",
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
    story:
      "A mysterious rogue with a talent for disappearing when trouble arrives.",
  },
];

// ========================================
// Database setup
// ========================================

async function setupDatabase() {
  const client = await pool.connect();

  try {
    console.log("");
    console.log("========================================");
    console.log("🚀 Starting database setup...");
    console.log("========================================");
    console.log("");

    await client.query("BEGIN");

    // ========================================
    // 1. Create users table
    // ========================================

    console.log("📋 Creating users table...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    console.log("✅ Users table ready");

    // ========================================
    // 2. Create email index
    // ========================================

    console.log("📋 Creating users email index...");

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email
      ON users(email)
    `);

    console.log("✅ Email index ready");

    // ========================================
    // 3. Check characters table
    // ========================================

    console.log("📋 Checking characters table...");

    const charactersTable = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'characters'
      )
    `);

    if (!charactersTable.rows[0].exists) {
      throw new Error(
        "characters table does not exist. Create the characters table first.",
      );
    }

    console.log("✅ Characters table exists");

    // ========================================
    // 4. Add user_id to characters
    // ========================================

    console.log("📋 Checking characters.user_id...");

    const columnCheck = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'characters'
      AND column_name = 'user_id'
    `);

    if (columnCheck.rows.length === 0) {
      console.log("📋 Adding user_id column...");

      await client.query(`
        ALTER TABLE characters
        ADD COLUMN user_id UUID
        REFERENCES users(id)
        ON DELETE CASCADE
      `);

      console.log("✅ user_id column added");
    } else {
      console.log("⏭️ user_id column already exists");
    }

    // ========================================
    // 5. Create user_id index
    // ========================================

    console.log("📋 Creating characters user_id index...");

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_characters_user_id
      ON characters(user_id)
    `);

    console.log("✅ user_id index ready");

    // ========================================
    // 6. Create admin user
    // ========================================

    console.log("👤 Creating admin user...");

    const adminPasswordHash = await bcrypt.hash(
      users[0].password,
      12,
    );

    const adminResult = await client.query(
      `
      INSERT INTO users (
        username,
        email,
        password_hash
      )
      VALUES ($1, $2, $3)
      ON CONFLICT (email)
      DO UPDATE SET
        username = EXCLUDED.username
      RETURNING id, username, email
      `,
      [
        users[0].username,
        users[0].email,
        adminPasswordHash,
      ],
    );

    const admin = adminResult.rows[0];

    console.log(`✅ Admin ready: ${admin.username}`);

    // ========================================
    // 7. Create normal user
    // ========================================

    console.log("👤 Creating normal user...");

    const userPasswordHash = await bcrypt.hash(
      users[1].password,
      12,
    );

    const userResult = await client.query(
      `
      INSERT INTO users (
        username,
        email,
        password_hash
      )
      VALUES ($1, $2, $3)
      ON CONFLICT (email)
      DO UPDATE SET
        username = EXCLUDED.username
      RETURNING id, username, email
      `,
      [
        users[1].username,
        users[1].email,
        userPasswordHash,
      ],
    );

    const user = userResult.rows[0];

    console.log(`✅ User ready: ${user.username}`);

    // ========================================
    // 8. Seed characters
    // ========================================

    console.log("");
    console.log("🧙 Creating characters...");

    for (const character of characters) {
      await client.query(
        `
        INSERT INTO characters (
          user_id,
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
        `,
        [
          user.id,
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

    // ========================================
    // 9. Commit
    // ========================================

    await client.query("COMMIT");

    console.log("");
    console.log("========================================");
    console.log("🎉 Database setup completed!");
    console.log("========================================");
    console.log("");

    console.log("🔐 Test accounts");
    console.log("----------------------------------------");

    console.log("Admin:");
    console.log("  Email:    admin@example.com");
    console.log("  Password: admin123");
    console.log("");

    console.log("User:");
    console.log("  Email:    player@example.com");
    console.log("  Password: password123");

    console.log("----------------------------------------");
    console.log("");
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("");
    console.error("❌ Database setup failed:");
    console.error(error);
    console.error("");

    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// ========================================
// Run setup
// ========================================

setupDatabase();