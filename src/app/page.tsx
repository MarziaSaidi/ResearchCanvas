import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./login/actions";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col items-center gap-6 text-center">
        <span className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:border-white/15 dark:text-zinc-400">
          MVP · Phase 0
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-black sm:text-5xl dark:text-zinc-50">
          ResearchCanvas
        </h1>
        <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Turn a research paper into an interactive, visual dashboard —
          executive summary, key findings, charts, causal flows, and evidence
          you can trace.
        </p>

        {user ? (
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Signed in as{" "}
              <span className="font-medium text-zinc-700 dark:text-zinc-200">
                {user.email}
              </span>
            </p>
            <form action={signOut}>
              <button className="rounded-full border border-black/15 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black/5 dark:border-white/20 dark:text-zinc-50 dark:hover:bg-white/10">
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Sign in to get started
          </Link>
        )}
      </main>
    </div>
  );
}
