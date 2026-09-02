import { NextResponse } from "next/server";
import { createLogoutCookie } from "@/lib/auth";
import type { AuthResponse } from "@/types/type";

/**
 * POST /api/auth/logout
 *
 * Logout a user by clearing the auth cookie
 */
export async function POST() {
  const response = NextResponse.json<AuthResponse>({
    success: true,
    message: "Logged out successfully.",
  });

  response.headers.set("Set-Cookie", createLogoutCookie());

  return response;
}
