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

        body {
          margin: 0;
          min-height: 100vh;
          font-family: Arial, sans-serif;
          background: radial-gradient(circle at top right, rgba(245,166,35,0.08), transparent 30%), var(--black);
          color: var(--text);
        }

        .wrap {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 1.5rem;
        }

        .card {
          width: 100%;
          max-width: 460px;
          background: var(--black-2);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 2rem;
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

        h1 {
          margin: 0 0 0.75rem;
          font-size: 2rem;
        }

        p {
          margin: 0 0 1.5rem;
          color: var(--text-soft);
          line-height: 1.7;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
          color: var(--text-soft);
        }

        input {
          width: 100%;
          padding: 0.9rem 1rem;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.12);
          background: var(--black-3);
          color: white;
          font-size: 1rem;
          outline: none;
        }

        input:focus {
          border-color: var(--gold);
        }

        button {
          width: 100%;
          margin-top: 1rem;
          padding: 0.95rem 1rem;
          border: none;
          border-radius: 999px;
          background: var(--gold);
          color: black;
          font-weight: 800;
          font-size: 1rem;
          cursor: pointer;
        }

        .error {
          margin-top: 1rem;
          color: #f87171;
          font-size: 0.95rem;
        }
      `}</style>

      <main className="wrap">
        <div className="card">
          <div className="eyebrow">Protected access</div>
          <h1>Admin Login</h1>
          <p>Enter the admin password to access the application dashboard.</p>

          <form action="/api/admin/login" method="POST">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required />
            <button type="submit">Sign in</button>
          </form>

          {hasError ? (
            <div className="error">Incorrect password. Please try again.</div>
          ) : null}
        </div>
      </main>
    </>
  );
}