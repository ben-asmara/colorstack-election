import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "@vercel/edge";

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

  await supabase.from("applications").update({ status }).eq("id", id);

  return NextResponse.redirect(new URL("/admin", request.url));
}