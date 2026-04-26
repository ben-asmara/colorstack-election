import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "").trim();
  const adminPassword = String(process.env.ADMIN_PASSWORD ?? "").trim();

  if (!adminPassword || password !== adminPassword) {
    return NextResponse.redirect(new URL("/admin?error=invalid", request.url));
  }

  const response = NextResponse.redirect(new URL("/admin/dashboard", request.url));

  response.cookies.set("admin_session", "authenticated", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}