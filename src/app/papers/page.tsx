import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TopNav } from "@/components/TopNav";

export default async function PapersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: papers } = await supabase
    .from("papers")
    .select("id, title, created_at")
    .order("created_at", { ascending: false });

  return (
    <>
      <TopNav email={user.email} />
      <main className="mx-auto w-full max-w-3xl px-6 py-16">
        <h1 className="font-serif text-4xl text-text">My papers</h1>

        {papers && papers.length > 0 ? (
          <ul className="glass mt-8 flex flex-col divide-y divide-border rounded-2xl px-5 py-2">
            {papers.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/paper/${p.id}`}
                  className="flex items-center justify-between gap-4 py-4 hover:opacity-80"
                >
                  <span className="text-text">{p.title}</span>
                  <span className="shrink-0 font-mono text-xs uppercase text-muted">
                    {new Date(p.created_at).toLocaleDateString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-muted">
            No papers yet.{" "}
            <Link href="/" className="text-accent">
              Analyze one
            </Link>
            .
          </p>
        )}
      </main>
    </>
  );
}
