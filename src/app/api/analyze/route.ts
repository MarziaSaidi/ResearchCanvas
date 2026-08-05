import { extractPdfText } from "@/lib/pdf";
import { extractInsights } from "@/lib/extract";
import { resolveSource } from "@/lib/sources";
import { ALLOWED_MIME, MAX_PDF_BYTES } from "@/lib/limits";
import { createClient } from "@/lib/supabase/server";
import type { PaperMeta } from "@/lib/schema";

// Node runtime: the Anthropic SDK and unpdf need Node APIs, not the edge runtime.
export const runtime = "nodejs";

/**
 * POST /api/analyze
 * multipart/form-data with EITHER a `file` field (a PDF) OR a `source` field
 * (a DOI or PubMed link/identifier). Requires an authenticated user; saves the
 * result to the caller's `papers` row. Returns { id, insights }.
 */
export async function POST(req: Request): Promise<Response> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Sign in to analyze papers" }, { status: 401 });
  }

  // Reject oversized uploads early with a clear message (before parsing the body).
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_PDF_BYTES + 1_000_000) {
    return Response.json(
      { error: `File exceeds the ${MAX_PDF_BYTES / (1024 * 1024)}MB limit` },
      { status: 413 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json(
      { error: "Could not read the upload — the file may be too large or malformed" },
      { status: 400 },
    );
  }

  const file = form.get("file");
  const source = form.get("source");

  // Resolve the input to plain text (+ any metadata we already know).
  let text: string;
  let knownMeta: Partial<PaperMeta> = {};

  if (file instanceof File && file.size > 0) {
    if (file.type && file.type !== ALLOWED_MIME) {
      return Response.json({ error: "Only PDF files are supported" }, { status: 415 });
    }
    if (file.size > MAX_PDF_BYTES) {
      return Response.json(
        { error: `File exceeds ${MAX_PDF_BYTES / (1024 * 1024)}MB limit` },
        { status: 413 },
      );
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    try {
      text = await extractPdfText(bytes);
    } catch {
      return Response.json({ error: "Could not read this PDF" }, { status: 422 });
    }
    if (text.length < 20) {
      return Response.json(
        { error: "No extractable text found (scanned image PDF?)" },
        { status: 422 },
      );
    }
  } else if (typeof source === "string" && source.trim()) {
    try {
      const resolved = await resolveSource(source);
      text = resolved.text;
      knownMeta = resolved.meta;
    } catch (err) {
      const reason = (err as Error).message;
      const msg =
        reason === "unrecognized"
          ? "That doesn't look like a DOI or PubMed link"
          : reason === "no-abstract"
            ? "No abstract available for that link — try uploading the PDF"
            : "Could not fetch that link";
      return Response.json({ error: msg }, { status: 422 });
    }
  } else {
    return Response.json(
      { error: "Provide a PDF `file` or a DOI/PubMed `source`" },
      { status: 400 },
    );
  }

  // --- Extraction ---
  let insights;
  try {
    insights = await extractInsights(text);
  } catch (err) {
    console.error("extraction failed:", err);
    return Response.json({ error: "Failed to analyze the paper" }, { status: 502 });
  }

  // Metadata we resolved from Crossref/PubMed is authoritative over the model's.
  insights.meta = { ...insights.meta, ...knownMeta };

  // --- Persist under the caller's account (RLS enforces ownership) ---
  const { data: saved, error: saveError } = await supabase
    .from("papers")
    .insert({ user_id: user.id, title: insights.title, insights })
    .select("id")
    .single();

  if (saveError) {
    console.error("save failed:", saveError);
    return Response.json({ error: "Analyzed, but could not save" }, { status: 500 });
  }

  return Response.json({ id: saved.id, insights });
}
