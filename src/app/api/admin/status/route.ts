import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const allowedStatuses = [
  "submitted",
  "reviewing",
  "interviewed",
  "accepted",
  "rejected",
];

export async function POST(request: Request) {
  const formData = await request.formData();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id || !allowedStatuses.includes(status)) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const { error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Status update failed:", error.message);
  }

  return NextResponse.redirect(new URL("/admin", request.url));
}