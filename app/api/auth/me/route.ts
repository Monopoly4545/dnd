import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyToken, getTokenFromCookies } from "@/lib/auth";
import type { AuthResponse, User } from "@/types/type";

/**
 * GET /api/auth/me
 *
 * Get the current authenticated user
 */
export async function GET(request: Request) {
  try {
    // --------------------------------
    // Get token from cookies
    // --------------------------------

    const cookieHeader = request.headers.get("cookie");
    const token = getTokenFromCookies(cookieHeader);

    if (!token) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: "Not authenticated.",
        },
        { status: 401 },
      );
    }

    // --------------------------------
    // Verify token
    // --------------------------------

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: "Invalid token.",
        },
        { status: 401 },
      );
    }

    // --------------------------------
    // Get user from database
    // --------------------------------

    const users = await query<User>(
      "SELECT id, username, email, created_at, updated_at FROM users WHERE id = $1",
      [payload.userId],
    );

    if (users.length === 0) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: "User not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json<AuthResponse>({
      success: true,
      user: users[0],
    });
  } catch (error) {
    console.error("GET /api/auth/me error:", error);

    return NextResponse.json<AuthResponse>(
      {
        success: false,
        error: "Failed to get user.",
      },
      { status: 500 },
    );
  }
}
