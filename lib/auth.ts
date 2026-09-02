import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { JWTPayload } from "@/types/type";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Sign a JWT token
 */
export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Get token from request cookies
 */
export function getTokenFromCookies(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((c) => c.trim());
  const authCookie = cookies.find((c) => c.startsWith("auth_token="));

  if (!authCookie) return null;

  return authCookie.split("=")[1];
}

/**
 * Create auth cookie string
 */
export function createAuthCookie(token: string): string {
  return `auth_token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Strict${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}

/**
 * Create logout cookie string (expires immediately)
 */
export function createLogoutCookie(): string {
  return "auth_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict";
}
