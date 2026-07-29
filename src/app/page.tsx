export default function Home() {
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
        <p className="text-sm text-zinc-400 dark:text-zinc-600">
          Foundations are up. Upload &amp; extraction coming in Phase 1.
        </p>
      </main>
    </div>
  );
}
