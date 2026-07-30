import { extractText, getDocumentProxy } from "unpdf";

/**
 * Extract plain text from a PDF buffer using unpdf (serverless-friendly,
 * no native deps). Pages are merged into a single string.
 */
export async function extractPdfText(data: Uint8Array): Promise<string> {
  const pdf = await getDocumentProxy(data);
  const { text } = await extractText(pdf, { mergePages: true });
  return text.trim();
}
