import { cookies } from "next/headers";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "admin123";
export const AUTH_COOKIE_NAME = "portfolio_admin_token";

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return false;

  // Verify token matches admin secret hash
  return token === Buffer.from(ADMIN_SECRET).toString("base64");
}

export function createAuthToken(): string {
  return Buffer.from(ADMIN_SECRET).toString("base64");
}
