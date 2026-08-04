import { signIn, signUp } from "./actions";

export default async function LoginPage(props: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await props.searchParams;

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 font-serif text-4xl text-text">ResearchCanvas</h1>
        <p className="mb-6 text-sm text-muted">
          Sign in or create an account to analyze papers.
        </p>

        {error && (
          <p
            className="mb-4 rounded-lg px-3 py-2 text-sm"
            style={{ backgroundColor: "var(--mod-bg)", color: "var(--mod-fg)" }}
          >
            {error}
          </p>
        )}
        {message && (
          <p
            className="mb-4 rounded-lg px-3 py-2 text-sm"
            style={{ backgroundColor: "var(--hi-bg)", color: "var(--hi-fg)" }}
          >
            {message}
          </p>
        )}

        <form className="glass flex flex-col gap-3 rounded-2xl p-6">
          <label className="font-mono text-[10px] uppercase tracking-wide text-muted">
            Email
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-text outline-none focus:border-accent"
          />
          <label className="mt-1 font-mono text-[10px] uppercase tracking-wide text-muted">
            Password
          </label>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="••••••••"
            className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-text outline-none focus:border-accent"
          />
          <div className="mt-2 flex gap-2">
            <button
              formAction={signIn}
              className="flex-1 rounded-lg bg-accent px-4 py-2 font-mono text-sm text-white hover:opacity-90"
            >
              Sign in
            </button>
            <button
              formAction={signUp}
              className="flex-1 rounded-lg border border-accent px-4 py-2 font-mono text-sm text-accent hover:bg-accent/10"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
