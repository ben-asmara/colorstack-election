import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type RankedPosition = {
  position: string;
  rank: number;
};

type ApplicationRow = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  major: string;
  academic_year: string;
  ranked_positions: RankedPosition[];
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

  const resumeUrls = await Promise.all(
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

  const resumeMap = new Map(
    resumeUrls.map((item) => [item.id, item.signedUrl])
  );

  return rows.map((row) => ({
    ...row,
    signed_resume_url: resumeMap.get(row.id) ?? null,
  }));
}

function statusColor(status: string) {
  switch (status) {
    case "reviewing":
      return "#f5a623";
    case "interviewed":
      return "#5fb3ff";
    case "accepted":
      return "#4ade80";
    case "rejected":
      return "#f87171";
    default:
      return "rgba(255,255,255,0.75)";
  }
}

export default async function AdminPage() {
  const applications = await getApplications();

  return (
    <>
      <style>{`
        :root {
          --black: #0a0a0a;
          --black-2: #111111;
          --black-3: #1a1a1a;
          --gold: #f5a623;
          --gold-dim: rgba(245, 166, 35, 0.1);
          --gold-border: rgba(245, 166, 35, 0.28);
          --text: #ffffff;
          --text-soft: rgba(255,255,255,0.75);
          --text-muted: rgba(255,255,255,0.5);
          --border: rgba(255,255,255,0.08);
          --radius: 12px;
          --radius-lg: 18px;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: var(--black);
          color: var(--text);
          font-family: Arial, sans-serif;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .nav {
          position: sticky;
          top: 0;
          z-index: 50;
          height: 62px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          background: rgba(10, 10, 10, 0.94);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
        }

        .nav-brand {
          font-size: 1.1rem;
          font-weight: 700;
        }

        .nav-brand span {
          color: var(--gold);
        }

        .nav-links {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .nav-link {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .nav-link:hover {
          color: var(--gold);
        }

        .hero {
          padding: 4.5rem 2rem 2rem;
          border-bottom: 1px solid var(--border);
          background: radial-gradient(circle at top right, rgba(245,166,35,0.08), transparent 28%), var(--black);
        }

        .hero-inner {
          max-width: 1200px;
          margin: 0 auto;
        }

        .eyebrow {
          display: inline-block;
          padding: 0.35rem 0.8rem;
          border-radius: 999px;
          background: var(--gold-dim);
          border: 1px solid var(--gold-border);
          color: var(--gold);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        .hero h1 {
          margin: 0;
          font-size: clamp(2.2rem, 5vw, 3.4rem);
          line-height: 1.06;
        }

        .hero h1 span {
          color: var(--gold);
        }

        .hero p {
          margin: 1rem 0 0;
          max-width: 700px;
          color: var(--text-soft);
          font-size: 1rem;
          line-height: 1.7;
        }

        .stats {
          max-width: 1200px;
          margin: 2rem auto 0;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1rem;
        }

        .stat-card {
          background: var(--black-2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1rem 1.1rem;
        }

        .stat-label {
          color: var(--text-muted);
          font-size: 0.85rem;
          margin-bottom: 0.4rem;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 800;
        }

        .page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .section-title {
          font-size: 1.8rem;
          margin: 0 0 1rem;
        }

        .section-sub {
          color: var(--text-muted);
          margin: 0 0 2rem;
        }

        .applications {
          display: grid;
          gap: 1.25rem;
        }

        .card {
          background: var(--black-2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          padding: 1.25rem;
          border-bottom: 1px solid var(--border);
          background: linear-gradient(to bottom, rgba(255,255,255,0.01), transparent);
        }

        .identity h2 {
          margin: 0;
          font-size: 1.25rem;
        }

        .identity .meta {
          color: var(--text-soft);
          margin-top: 0.35rem;
          line-height: 1.6;
        }

        .identity .time {
          margin-top: 0.5rem;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .right-panel {
          min-width: 260px;
          max-width: 320px;
        }

        .status-chip {
          display: inline-block;
          padding: 0.35rem 0.7rem;
          border-radius: 999px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 0.75rem;
        }

        .status-form label {
          display: block;
          font-size: 0.85rem;
          color: var(--text-soft);
          margin-bottom: 0.4rem;
        }

        .status-form select {
          width: 100%;
          background: var(--black-3);
          color: white;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          padding: 0.75rem;
          font-size: 0.95rem;
        }

        .status-form button,
        .resume-link {
          margin-top: 0.8rem;
          display: inline-block;
          width: 100%;
          text-align: center;
          background: var(--gold);
          color: black;
          border: none;
          border-radius: 999px;
          padding: 0.75rem 1rem;
          font-weight: 800;
          cursor: pointer;
        }

        .resume-link.secondary {
          background: transparent;
          color: var(--gold);
          border: 1px solid var(--gold-border);
        }

        .card-body {
          padding: 1.25rem;
          display: grid;
          gap: 1rem;
        }

        .blocks {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 1rem;
        }

        .block {
          background: var(--black-3);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1rem;
        }

        .block h3 {
          margin: 0 0 0.75rem;
          font-size: 1rem;
          color: var(--gold);
        }

        .block p, .block li {
          color: var(--text-soft);
          line-height: 1.7;
          margin: 0;
        }

        .rank-list {
          margin: 0;
          padding-left: 1.1rem;
        }

        .essay-grid {
          display: grid;
          gap: 1rem;
        }

        .essay {
          background: var(--black-3);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1rem;
        }

        .essay h4 {
          margin: 0 0 0.65rem;
          font-size: 0.95rem;
          color: var(--gold);
        }

        .essay p {
          margin: 0;
          color: var(--text-soft);
          line-height: 1.75;
          white-space: pre-wrap;
        }

        .empty {
          background: var(--black-2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 2rem;
          text-align: center;
          color: var(--text-muted);
        }

        @media (max-width: 900px) {
          .stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .card-top,
          .blocks {
            grid-template-columns: 1fr;
            display: grid;
          }

          .right-panel {
            min-width: 0;
            max-width: none;
          }
        }

        @media (max-width: 640px) {
          .page,
          .hero,
          .nav {
            padding-left: 1rem;
            padding-right: 1rem;
          }

          .stats {
            grid-template-columns: 1fr;
          }

          .nav-links {
            display: none;
          }
        }
      `}</style>
      <form action="/api/admin/logout" method="POST">
        <button
            type="submit"
            style={{
            background: "transparent",
            color: "var(--gold)",
            border: "1px solid rgba(245,166,35,0.28)",
            borderRadius: 999,
            padding: "0.6rem 1rem",
            cursor: "pointer",
            fontWeight: 700,
            }}
        >
            Log out
          </button>
        </form>

      <nav className="nav">
        <div className="nav-brand">
          <span>ColorStack</span> Admin
        </div>
        <div className="nav-links">
          <a className="nav-link" href="/">
            Public Site
          </a>
          <a className="nav-link" href="/admin">
            Dashboard
          </a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-inner">
          <div className="eyebrow">Board review dashboard</div>
          <h1>
            Review <span>Applications</span>
          </h1>
          <p>
            View submissions, open resumes, and update candidate status in one
            place.
          </p>
        </div>

        <div className="stats">
          <div className="stat-card">
            <div className="stat-label">Total Applications</div>
            <div className="stat-value">{applications.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Submitted</div>
            <div className="stat-value">
              {applications.filter((a) => a.status === "submitted").length}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Reviewing</div>
            <div className="stat-value">
              {applications.filter((a) => a.status === "reviewing").length}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Accepted</div>
            <div className="stat-value">
              {applications.filter((a) => a.status === "accepted").length}
            </div>
          </div>
        </div>
      </section>

      <main className="page">
        <h2 className="section-title">All Applications</h2>
        <p className="section-sub">
          Sorted by newest submission first.
        </p>

        {applications.length === 0 ? (
          <div className="empty">No applications yet.</div>
        ) : (
          <div className="applications">
            {applications.map((app) => (
              <div className="card" key={app.id}>
                <div className="card-top">
                  <div className="identity">
                    <h2>{app.full_name}</h2>
                    <div className="meta">
                      <div>{app.email}</div>
                      <div>
                        {app.major} · {app.academic_year}
                      </div>
                    </div>
                    <div className="time">
                      Submitted {new Date(app.created_at).toLocaleString()}
                    </div>
                  </div>

                  <div className="right-panel">
                    <div
                      className="status-chip"
                      style={{ color: statusColor(app.status) }}
                    >
                      {app.status}
                    </div>

                    <form
                      className="status-form"
                      action="/api/admin/status"
                      method="POST"
                    >
                      <input type="hidden" name="id" value={app.id} />
                      <label htmlFor={`status-${app.id}`}>Update status</label>
                      <select
                        id={`status-${app.id}`}
                        name="status"
                        defaultValue={app.status}
                      >
                        <option value="submitted">submitted</option>
                        <option value="reviewing">reviewing</option>
                        <option value="interviewed">interviewed</option>
                        <option value="accepted">accepted</option>
                        <option value="rejected">rejected</option>
                      </select>
                      <button type="submit">Save Status</button>
                    </form>

                    {app.signed_resume_url ? (
                      <a
                        href={app.signed_resume_url}
                        target="_blank"
                        rel="noreferrer"
                        className="resume-link secondary"
                      >
                        View Resume
                      </a>
                    ) : (
                      <div className="time" style={{ marginTop: "0.9rem" }}>
                        No resume uploaded
                      </div>
                    )}
                  </div>
                </div>

                <div className="card-body">
                  <div className="blocks">
                    <div className="block">
                      <h3>Ranked Positions</h3>
                      <ol className="rank-list">
                        {app.ranked_positions?.map((p) => (
                          <li key={`${app.id}-${p.rank}-${p.position}`}>
                            #{p.rank} · {p.position}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="block">
                      <h3>Availability</h3>
                      <p>{app.hours_per_week}</p>
                      <p>{app.weekly_meetings}</p>
                      <p>{app.enrolled_full_year}</p>
                      {app.availability_notes ? (
                        <p style={{ marginTop: "0.75rem" }}>
                          {app.availability_notes}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="essay-grid">
                    <div className="essay">
                      <h4>Why do you want to join the ColorStack board?</h4>
                      <p>{app.why_join}</p>
                    </div>

                    <div className="essay">
                      <h4>
                        What experience or skills make you a strong fit?
                      </h4>
                      <p>{app.strong_fit}</p>
                    </div>

                    <div className="essay">
                      <h4>
                        Describe a time you took initiative. What was the
                        outcome?
                      </h4>
                      <p>{app.initiative_story}</p>
                    </div>

                    <div className="essay">
                      <h4>
                        What goal would you want ColorStack to achieve this
                        year?
                      </h4>
                      <p>{app.goal_for_year}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}