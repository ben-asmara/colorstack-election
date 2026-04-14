import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._() ]/g, "").replace(/\s+/g, "_");
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
    const resume = formData.get("resume") as File | null;

    if (!fullName || !email || !major || !academicYear) {
      return NextResponse.json(
        { error: "Missing required About You fields." },
        { status: 400 }
      );
    }

    if (!Array.isArray(rankedPositions) || rankedPositions.length === 0) {
      return NextResponse.json(
        { error: "Please rank at least one position." },
        { status: 400 }
      );
    }

    if (!whyJoin || !strongFit || !initiativeStory || !goalForYear) {
      return NextResponse.json(
        { error: "Please answer all essay questions." },
        { status: 400 }
      );
    }

    if (!hoursPerWeek || !weeklyMeetings || !enrolledFullYear) {
      return NextResponse.json(
        { error: "Please complete the availability section." },
        { status: 400 }
      );
    }

    let resumePath: string | null = null;

    if (resume && resume.size > 0) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(resume.type)) {
        return NextResponse.json(
          { error: "Resume must be a PDF, DOC, or DOCX file." },
          { status: 400 }
        );
      }

      const maxBytes = 5 * 1024 * 1024;
      if (resume.size > maxBytes) {
        return NextResponse.json(
          { error: "Resume must be 5MB or smaller." },
          { status: 400 }
        );
      }

      const arrayBuffer = await resume.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const safeName = sanitizeFileName(resume.name || "resume");
      const filePath = `applications/${email}/${Date.now()}_${safeName}`;

      const upload = await supabase.storage
        .from("resumes")
        .upload(filePath, buffer, {
          contentType: resume.type,
          upsert: false,
        });

      if (upload.error) {
        return NextResponse.json(
          { error: `Resume upload failed: ${upload.error.message}` },
          { status: 500 }
        );
      }

      resumePath = filePath;
    }

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
      resume_path: resumePath,
      status: "submitted",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unexpected server error",
      },
      { status: 500 }
    );
  }
}