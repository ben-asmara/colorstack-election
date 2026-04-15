import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type ApplicationRow = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  major: string;
  academic_year: string;
  ranked_positions: { position: string; rank: number }[];
  why_join: string;
  strong_fit: string;
  initiative_story: string;
  goal_for_year: string;
  hours_per_week: string;
  weekly_meetings: string;
  enrolled_full_year: string;
  availability_notes: string | null;
  resume_path: string | null;
  status: string;
};

async function getApplications() {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as ApplicationRow[];

  const resumes = await Promise.all(
    rows.map(async (row) => {
      if (!row.resume_path) {
        return { id: row.id, signedUrl: null };
      }

      const { data: signed, error: signedError } = await supabase.storage
        .from("resumes")
        .createSignedUrl(row.resume_path, 60 * 60);

      if (signedError) {
        return { id: row.id, signedUrl: null };
      }

      return { id: row.id, signedUrl: signed.signedUrl };
    })
  );

  const resumeMap = new Map(resumes.map((r) => [r.id, r.signedUrl]));

  return rows.map((row) => ({
    ...row,
    signed_resume_url: resumeMap.get(row.id) ?? null,
  }));
}

export default async function AdminPage() {
  const applications = await getApplications();

  return (
    <main style={{ padding: "2rem", maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>
        Applications Admin
      </h1>

      <div style={{ display: "grid", gap: "1rem" }}>
        {applications.map((app) => (
          <div
            key={app.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: "1rem",
              background: "#fff",
              color: "#111",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "1rem",
                flexWrap: "wrap",
                marginBottom: "1rem",
              }}
            >
              <div>
                <div style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                  {app.full_name}
                </div>
                <div>{app.email}</div>
                <div>
                  {app.major} · {app.academic_year}
                </div>
                <div style={{ fontSize: "0.9rem", color: "#666" }}>
                  Submitted: {new Date(app.created_at).toLocaleString()}
                </div>
              </div>

              <div style={{ minWidth: 220 }}>
                <form action={`/api/admin/status`} method="POST">
                  <input type="hidden" name="id" value={app.id} />
                  <label
                    htmlFor={`status-${app.id}`}
                    style={{ display: "block", marginBottom: 6, fontWeight: 600 }}
                  >
                    Status
                  </label>
                  <select
                    id={`status-${app.id}`}
                    name="status"
                    defaultValue={app.status}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: 8,
                      border: "1px solid #ccc",
                    }}
                  >
                    <option value="submitted">submitted</option>
                    <option value="reviewing">reviewing</option>
                    <option value="interviewed">interviewed</option>
                    <option value="accepted">accepted</option>
                    <option value="rejected">rejected</option>
                  </select>
                  <button
                    type="submit"
                    style={{
                      marginTop: "0.75rem",
                      padding: "0.6rem 0.9rem",
                      borderRadius: 8,
                      border: "none",
                      background: "#111",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Update status
                  </button>
                </form>

                {app.signed_resume_url ? (
                  <a
                    href={app.signed_resume_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-block",
                      marginTop: "0.75rem",
                      color: "#0055cc",
                    }}
                  >
                    View resume
                  </a>
                ) : (
                  <div style={{ marginTop: "0.75rem", color: "#777" }}>
                    No resume uploaded
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <strong>Ranked Positions:</strong>
              <ul>
                {app.ranked_positions?.map((p) => (
                  <li key={`${app.id}-${p.rank}-${p.position}`}>
                    #{p.rank} · {p.position}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: "grid", gap: "0.75rem" }}>
              <div>
                <strong>Why join:</strong>
                <p>{app.why_join}</p>
              </div>
              <div>
                <strong>Strong fit:</strong>
                <p>{app.strong_fit}</p>
              </div>
              <div>
                <strong>Initiative story:</strong>
                <p>{app.initiative_story}</p>
              </div>
              <div>
                <strong>Goal for year:</strong>
                <p>{app.goal_for_year}</p>
              </div>
              <div>
                <strong>Availability:</strong>
                <p>
                  {app.hours_per_week} · {app.weekly_meetings} ·{" "}
                  {app.enrolled_full_year}
                </p>
              </div>
              {app.availability_notes ? (
                <div>
                  <strong>Availability notes:</strong>
                  <p>{app.availability_notes}</p>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}