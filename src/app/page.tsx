import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TopNav } from "@/components/TopNav";
import { Analyzer } from "@/components/Analyzer";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <main className="flex w-full max-w-2xl flex-col items-center gap-6 text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-muted">
            MVP
          </span>
          <h1 className="font-serif text-5xl tracking-tight text-text">
            ResearchCanvas
          </h1>
          <p className="max-w-md text-lg leading-8 text-muted">
            Turn a research paper into an interactive, visual dashboard —
            summary, key findings, charts, causal flows, and evidence you can
            trace.
          </p>
          <Link
            href="/login"
            className="rounded-full bg-accent px-5 py-2.5 font-mono text-sm text-white hover:opacity-90"
          >
            Sign in to get started
          </Link>
        </main>
      </div>
    );
  }

  const { data: papers } = await supabase
    .from("papers")
    .select("id, title, created_at")
    .order("created_at", { ascending: false })
    .limit(8);

  return (
    <>
      <TopNav email={user.email} />
      <main className="mx-auto w-full max-w-3xl px-6 py-16">
        <h1 className="text-center font-serif text-4xl text-text">
          Analyze a paper
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-center text-muted">
          Upload a PDF, paste a DOI, or drop a PubMed link to generate an
          interactive summary.
        </p>

        <div className="mt-10">
          <Analyzer />
        </div>

        <div className="mt-16 border-t border-border pt-8">
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted">
            Recent
          </h2>
          {papers && papers.length > 0 ? (
            <ul className="mt-4 flex flex-col divide-y divide-border">
              {papers.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/paper/${p.id}`}
                    className="flex items-center justify-between gap-4 py-3 hover:opacity-80"
                  >
                    <span className="text-sm text-text">{p.title}</span>
                    <span className="shrink-0 font-mono text-xs uppercase text-muted">
                      {new Date(p.created_at).toLocaleDateString()}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-muted">
              No papers yet — upload one to get started.
            </p>
          )}
        </div>
      </main>
    </>
  );
}
