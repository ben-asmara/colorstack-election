export default function AdminLoginPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const hasError = searchParams?.error === "invalid";

  return (
    <main>
      <h1>Admin Login</h1>

      <form action="/api/admin/login" method="POST">
        <input name="password" type="password" required />
        <button type="submit">Sign in</button>
      </form>

      {hasError ? <p>Incorrect password. Please try again.</p> : null}
    </main>
  );
}
