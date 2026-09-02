import { query } from "@/lib/db";
import { verifyToken, getTokenFromCookies } from "@/lib/auth";
import type { User } from "@/types/type";

/**
 * Get the current authenticated user from request
 * Returns null if not authenticated
 */
export async function getCurrentUser(request: Request): Promise<User | null> {
  try {
    const cookieHeader = request.headers.get("cookie");
    const token = getTokenFromCookies(cookieHeader);

    if (!token) {
      return null;
    }

    const payload = verifyToken(token);

    if (!payload) {
      return null;
    }

    const users = await query<User>(
      "SELECT id, username, email, created_at, updated_at FROM users WHERE id = $1",
      [payload.userId],
    );

    return users.length > 0 ? users[0] : null;
  } catch {
    return null;
  }
}

/**
 * Check if a character belongs to a user
 */
export async function checkCharacterOwnership(
  characterId: string,
  userId: string,
): Promise<boolean> {
  try {
    const rows = await query(
      "SELECT id FROM characters WHERE id = $1 AND user_id = $2",
      [characterId, userId],
    );

    return rows.length > 0;
  } catch {
    return false;
  }
}
