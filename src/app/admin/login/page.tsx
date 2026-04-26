export default function AdminLoginPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const hasError = searchParams?.error === "invalid";

  return (
    <>
      <style>{`
        :root {
          --black: #0a0a0a;
          --black-2: #111111;
          --black-3: #1a1a1a;
          --gold: #f5a623;
          --gold-dark: #c4831a;
          --gold-dim: rgba(245, 166, 35, 0.1);
          --gold-border: rgba(245, 166, 35, 0.28);
          --text: #ffffff;
          --text-soft: rgba(255,255,255,0.75);
          --text-muted: rgba(255,255,255,0.5);
          --border: rgba(255,255,255,0.08);
        }

        * {
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          padding: 0;
          min-height: 100%;
          font-family: Arial, sans-serif;
          background:
            radial-gradient(circle at top right, rgba(245,166,35,0.10), transparent 28%),
            radial-gradient(circle at bottom left, rgba(245,166,35,0.05), transparent 22%),
            var(--black);
          color: var(--text);
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .nav {
          position: sticky;
          top: 0;
          z-index: 20;
          height: 62px;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border);
          background: rgba(10, 10, 10, 0.94);
          backdrop-filter: blur(14px);
        }

        .brand {
          font-weight: 800;
          font-size: 1.1rem;
        }

        .brand span {
          color: var(--gold);
        }

        .nav-link {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .nav-link:hover {
          color: var(--gold);
        }

        .wrap {
          min-height: calc(100vh - 62px);
          display: grid;
          place-items: center;
          padding: 2rem 1rem;
        }

        .shell {
          width: 100%;
          max-width: 1040px;
          display: grid;
          grid-template-columns: 1.1fr 0.95fr;
          border: 1px solid var(--border);
          border-radius: 24px;
          overflow: hidden;
          background: var(--black-2);
          box-shadow: 0 20px 60px rgba(0,0,0,0.35);
        }

        .left {
          padding: 3rem;
          border-right: 1px solid var(--border);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.02), transparent 30%),
            var(--black-2);
        }

        .eyebrow {
          display: inline-block;
          padding: 0.35rem 0.8rem;
          border-radius: 999px;
          background: var(--gold-dim);
          border: 1px solid var(--gold-border);
          color: var(--gold);
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 1rem;
        }

        .title {
          margin: 0;
          font-size: clamp(2.1rem, 4vw, 3.4rem);
          line-height: 1.05;
        }

        .title span {
          color: var(--gold);
          font-style: italic;
        }

        .desc {
          margin: 1rem 0 1.5rem;
          color: var(--text-soft);
          line-height: 1.75;
          max-width: 500px;
          font-size: 1rem;
        }

        .feature-list {
          display: grid;
          gap: 0.9rem;
          margin-top: 2rem;
        }

        .feature {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.95rem 1rem;
          border: 1px solid var(--border);
          border-radius: 14px;
          background: var(--black-3);
        }

        .feature-icon {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: var(--gold-dim);
          border: 1px solid var(--gold-border);
          color: var(--gold);
          font-size: 0.95rem;
          flex-shrink: 0;
        }

        .feature-title {
          font-weight: 700;
          margin-bottom: 0.2rem;
        }

        .feature-text {
          color: var(--text-muted);
          font-size: 0.92rem;
          line-height: 1.55;
        }

        .right {
          display: grid;
          place-items: center;
          padding: 2rem;
          background:
            radial-gradient(circle at top left, rgba(245,166,35,0.06), transparent 26%),
            var(--black-2);
        }

        .card {
          width: 100%;
          max-width: 420px;
          background: var(--black-3);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 2rem;
        }

        .card-title {
          margin: 0 0 0.5rem;
          font-size: 1.8rem;
        }

        .card-sub {
          margin: 0 0 1.5rem;
          color: var(--text-soft);
          line-height: 1.7;
        }

        .label {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--text-soft);
          font-size: 0.95rem;
          font-weight: 600;
        }

        .input {
          width: 100%;
          padding: 0.95rem 1rem;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.02);
          color: #fff;
          font-size: 1rem;
          outline: none;
        }

        .input:focus {
          border-color: var(--gold);
          box-shadow: 0 0 0 4px rgba(245,166,35,0.08);
        }

        .button {
          width: 100%;
          margin-top: 1rem;
          padding: 1rem 1.1rem;
          border: none;
          border-radius: 999px;
          background: var(--gold);
          color: #000;
          font-size: 1rem;
          font-weight: 800;
          cursor: pointer;
          transition: transform 0.15s ease, opacity 0.15s ease;
        }

        .button:hover {
          transform: translateY(-1px);
          opacity: 0.96;
        }

        .error {
          margin-top: 1rem;
          padding: 0.85rem 1rem;
          border-radius: 12px;
          border: 1px solid rgba(248,113,113,0.28);
          background: rgba(248,113,113,0.08);
          color: #fca5a5;
          font-size: 0.95rem;
        }

        .tiny {
          margin-top: 1rem;
          color: var(--text-muted);
          font-size: 0.86rem;
          line-height: 1.6;
        }

        @media (max-width: 880px) {
          .shell {
            grid-template-columns: 1fr;
          }

          .left {
            border-right: none;
            border-bottom: 1px solid var(--border);
          }
        }

        @media (max-width: 640px) {
          .left,
          .right,
          .card {
            padding: 1.5rem;
          }

          .nav {
            padding: 0 1rem;
          }
        }
      `}</style>

      <nav className="nav">
        <div className="brand">
          <span>ColorStack</span> Admin
        </div>
        <a className="nav-link" href="/">
          Back to site
        </a>
      </nav>

      <main className="wrap">
        <div className="shell">
          <section className="left">
            <div className="eyebrow">Board review portal</div>
            <h1 className="title">
              Welcome to the <span>Admin</span> dashboard
            </h1>
            <p className="desc">
              Review applications, update candidate status, and open uploaded
              resumes in one place. This area is protected for board members
              only.
            </p>

            <div className="feature-list">
              <div className="feature">
                <div className="feature-icon">✓</div>
                <div>
                  <div className="feature-title">Review applications faster</div>
                  <div className="feature-text">
                    See ranked positions, essay responses, and availability in a
                    clean dashboard.
                  </div>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">★</div>
                <div>
                  <div className="feature-title">Track candidate status</div>
                  <div className="feature-text">
                    Move applicants through submitted, reviewing, interviewed,
                    accepted, or rejected.
                  </div>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">↗</div>
                <div>
                  <div className="feature-title">Open resumes securely</div>
                  <div className="feature-text">
                    Access uploaded resume files through signed links from
                    storage.
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="right">
            <div className="card">
              <h2 className="card-title">Sign in</h2>
              <p className="card-sub">
                Enter the admin password to continue to the review dashboard.
              </p>

              <form action="/api/admin/login" method="POST">
                <label className="label" htmlFor="password">
                  Password
                </label>
                <input
                  className="input"
                  id="password"
                  name="password"
                  type="password"
                  required
                />
                <button className="button" type="submit">
                  Access dashboard
                </button>
              </form>

              {hasError ? (
                <div className="error">
                  Incorrect password. Please try again.
                </div>
              ) : null}

              <div className="tiny">
                This page is restricted to authorized board reviewers.
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}