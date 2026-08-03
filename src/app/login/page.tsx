import { signIn, signUp } from "./actions";

export default async function LoginPage(props: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await props.searchParams;

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-black">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          ResearchCanvas
        </h1>
        <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
          Sign in or create an account to analyze papers.
        </p>

        {error && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}
        {message && (
          <p className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
            {message}
          </p>
        )}

        <form className="flex flex-col gap-3">
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-black outline-none focus:border-black/30 dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-50"
          />
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="Password"
            className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-black outline-none focus:border-black/30 dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-50"
          />
          <div className="mt-1 flex gap-2">
            <button
              formAction={signIn}
              className="flex-1 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Sign in
            </button>
            <button
              formAction={signUp}
              className="flex-1 rounded-lg border border-black/15 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black/5 dark:border-white/20 dark:text-zinc-50 dark:hover:bg-white/10"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
