import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const fullName = getString(formData, "fullName");
    const email = getString(formData, "email");
    const major = getString(formData, "major");
    const academicYear = getString(formData, "academicYear");
    const whyJoin = getString(formData, "whyJoin");
    const strongFit = getString(formData, "strongFit");
    const initiativeStory = getString(formData, "initiativeStory");
    const goalForYear = getString(formData, "goalForYear");
    const hoursPerWeek = getString(formData, "hoursPerWeek");
    const weeklyMeetings = getString(formData, "weeklyMeetings");
    const enrolledFullYear = getString(formData, "enrolledFullYear");
    const availabilityNotes = getString(formData, "availabilityNotes");
    const rankedPositions = JSON.parse(
      getString(formData, "rankedPositions") || "[]"
    );

    const { error } = await supabase.from("applications").insert({
      full_name: fullName,
      email,
      major,
      academic_year: academicYear,
      ranked_positions: rankedPositions,
      why_join: whyJoin,
      strong_fit: strongFit,
      initiative_story: initiativeStory,
      goal_for_year: goalForYear,
      hours_per_week: hoursPerWeek,
      weekly_meetings: weeklyMeetings,
      enrolled_full_year: enrolledFullYear,
      availability_notes: availabilityNotes || null,
      status: "submitted",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rankedList = Array.isArray(rankedPositions)
      ? rankedPositions
          .map((p: { position: string; rank: number }) => `#${p.rank} ${p.position}`)
          .join("<br />")
      : "";

    await resend.emails.send({
      from: "ColorStack <colorstack.calstatela@gmail.com>",
      to: [email],
      subject: "We received your ColorStack application",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Thanks for applying, ${fullName}.</h2>
          <p>Your ColorStack board application was submitted successfully.</p>
          <p><strong>Major:</strong> ${major}</p>
          <p><strong>Academic Year:</strong> ${academicYear}</p>
          <p><strong>Ranked Positions:</strong><br />${rankedList || "None listed"}</p>
          <p>We’ll review your application and reach out with next steps.</p>
          <p>ColorStack @ Cal State LA</p>
        </div>
      `,
    });

    await resend.emails.send({
      from: "ColorStack <colorstack.calstatela@gmail.com>",
      to: ["bissno@calstatela.edu"],
      subject: `New application from ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>New board application received</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Major:</strong> ${major}</p>
          <p><strong>Academic Year:</strong> ${academicYear}</p>
          <p><strong>Ranked Positions:</strong><br />${rankedList || "None listed"}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unexpected server error",
      },
      { status: 500 }
    );
  }
}