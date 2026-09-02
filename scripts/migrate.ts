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

async function migrate() {
  const client = await pool.connect();

  try {
    console.log("🚀 Starting database migration...");

    await client.query("BEGIN");

    // ========================================
    // Create users table
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

    console.log("✅ Users table created");

    // ========================================
    // Create index on email for faster lookups
    // ========================================

    console.log("📋 Creating email index...");

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `);

    console.log("✅ Email index created");

    // ========================================
    // Add user_id to characters table
    // ========================================

    console.log("📋 Adding user_id to characters table...");

    // Check if user_id column exists
    const columnCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'characters' AND column_name = 'user_id'
    `);

    if (columnCheck.rows.length === 0) {
      await client.query(`
        ALTER TABLE characters 
        ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE
      `);

      console.log("✅ user_id column added to characters");
    } else {
      console.log("⏭️  user_id column already exists");
    }

    // ========================================
    // Create index on user_id for faster queries
    // ========================================

    console.log("📋 Creating user_id index on characters...");

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_characters_user_id ON characters(user_id)
    `);

    console.log("✅ user_id index created");

    await client.query("COMMIT");

    console.log("🎉 Migration completed successfully!");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
