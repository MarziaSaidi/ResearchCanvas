// Ingestion + safety limits, shared by the upload route and the pipeline.

export const MAX_PDF_BYTES = 20 * 1024 * 1024; // 20 MB upload cap
export const ALLOWED_MIME = "application/pdf";

// Cap how much extracted text we feed the model. Opus has a huge context window,
// but bounding this controls cost/latency and keeps a malicious PDF from ballooning
// the request. ~200k chars comfortably covers a long paper.
export const MAX_TEXT_CHARS = 200_000;
