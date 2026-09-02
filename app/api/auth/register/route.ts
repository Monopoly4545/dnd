import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashPassword, signToken, createAuthCookie } from "@/lib/auth";
import type { RegisterInput, AuthResponse, User } from "@/types/type";

/**
 * POST /api/auth/register
 *
 * Register a new user
 */
export async function POST(request: Request) {
  try {
    const body: RegisterInput = await request.json();

    const { username, email, password } = body;

    // --------------------------------
    // Validation
    // --------------------------------

    if (!username || typeof username !== "string" || username.length < 3) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: "Username must be at least 3 characters.",
        },
        { status: 400 },
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: "Valid email is required.",
        },
        { status: 400 },
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: "Password must be at least 6 characters.",
        },
        { status: 400 },
      );
    }

    // --------------------------------
    // Check if user exists
    // --------------------------------

    const existingUsers = await query(
      "SELECT id FROM users WHERE email = $1 OR username = $2",
      [email.toLowerCase(), username.toLowerCase()],
    );

    if (existingUsers.length > 0) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: "User with this email or username already exists.",
        },
        { status: 409 },
      );
    }

    // --------------------------------
    // Create user
    // --------------------------------

    const hashedPassword = await hashPassword(password);

    const users = await query<User>(
      `
      INSERT INTO users (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at, updated_at
      `,
      [username.toLowerCase(), email.toLowerCase(), hashedPassword],
    );

    const user = users[0];

    // --------------------------------
    // Create token and set cookie
    // --------------------------------

    const token = signToken({
      userId: user.id,
      email: user.email,
    });

    const response = NextResponse.json<AuthResponse>({
      success: true,
      user,
      message: "Registration successful.",
    });

    response.headers.set("Set-Cookie", createAuthCookie(token));

    return response;
  } catch (error) {
    console.error("POST /api/auth/register error:", error);

    return NextResponse.json<AuthResponse>(
      {
        success: false,
        error: "Failed to register user.",
      },
      { status: 500 },
    );
  }
}
