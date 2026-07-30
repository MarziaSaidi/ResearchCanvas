import { extractPdfText } from "@/lib/pdf";
import { extractInsights } from "@/lib/extract";
import { ALLOWED_MIME, MAX_PDF_BYTES } from "@/lib/limits";

// Node runtime: the Anthropic SDK and unpdf need Node APIs, not the edge runtime.
export const runtime = "nodejs";

/**
 * POST /api/analyze
 * multipart/form-data with a single `file` field (a PDF).
 * Returns { insights: PaperInsights }.
 *
 * Phase 1: no auth/persistence yet — that layer plugs in once Supabase is wired.
 */
export async function POST(req: Request): Promise<Response> {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: "Expected multipart/form-data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "Missing `file` field" }, { status: 400 });
  }

  // --- Input validation (untrusted upload) ---
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

  let text: string;
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

  try {
    const insights = await extractInsights(text);
    return Response.json({ insights });
  } catch (err) {
    console.error("extraction failed:", err);
    return Response.json({ error: "Failed to analyze the paper" }, { status: 502 });
  }
}
