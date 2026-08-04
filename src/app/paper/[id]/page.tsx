import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TopNav } from "@/components/TopNav";
import { PaperDashboard } from "@/components/dashboard/PaperDashboard";
import { paperInsightsSchema } from "@/lib/schema";

export default async function PaperPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // RLS ensures the row is only returned if it belongs to this user.
  const { data: paper } = await supabase
    .from("papers")
    .select("insights, created_at")
    .eq("id", id)
    .single();

  if (!paper) notFound();

  const parsed = paperInsightsSchema.safeParse(paper.insights);
  if (!parsed.success) notFound();

  const analyzedAt = new Date(paper.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <TopNav email={user.email} />
      <PaperDashboard insights={parsed.data} analyzedAt={analyzedAt} />
    </>
  );
}
