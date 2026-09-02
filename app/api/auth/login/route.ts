import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyPassword, signToken, createAuthCookie } from "@/lib/auth";
import type { LoginInput, AuthResponse, User } from "@/types/type";

/**
 * POST /api/auth/login
 *
 * Login a user
 */
export async function POST(request: Request) {
  try {
    const body: LoginInput = await request.json();

    const { email, password } = body;

    // --------------------------------
    // Validation
    // --------------------------------

    if (!email || typeof email !== "string") {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: "Email is required.",
        },
        { status: 400 },
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: "Password is required.",
        },
        { status: 400 },
      );
    }

    // --------------------------------
    // Find user
    // --------------------------------

    const users = await query<User & { password_hash: string }>(
      "SELECT id, username, email, password_hash, created_at, updated_at FROM users WHERE email = $1",
      [email.toLowerCase()],
    );

    if (users.length === 0) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: "Invalid email or password.",
        },
        { status: 401 },
      );
    }

    const user = users[0];

    // --------------------------------
    // Verify password
    // --------------------------------

    const isValid = await verifyPassword(password, user.password_hash);

    if (!isValid) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: "Invalid email or password.",
        },
        { status: 401 },
      );
    }

    // --------------------------------
    // Create token and set cookie
    // --------------------------------

    const token = signToken({
      userId: user.id,
      email: user.email,
    });

    const response = NextResponse.json<AuthResponse>({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      message: "Login successful.",
    });

    response.headers.set("Set-Cookie", createAuthCookie(token));

    return response;
  } catch (error) {
    console.error("POST /api/auth/login error:", error);

    return NextResponse.json<AuthResponse>(
      {
        success: false,
        error: "Failed to login.",
      },
      { status: 500 },
    );
  }
}
