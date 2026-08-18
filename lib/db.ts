import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const pool = new Pool({
  connectionString,
});

export async function query(text: string, params?: unknown[]) {
  const result = await pool.query(text, params);
  return result.rows;
}

export default pool;
