import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, createAuthToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const adminSecret = process.env.ADMIN_SECRET || "admin123";

    if (!password || password !== adminSecret) {
      return NextResponse.json(
        { success: false, error: "Invalid admin password" },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, createAuthToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({ success: true, message: "Logged in successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to log in";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
