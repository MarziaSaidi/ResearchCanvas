import type { PaperMeta } from "./schema";

// Polite identification for Crossref / NCBI (they ask for a contact UA).
const UA = "ResearchCanvas/0.1 (mailto:hello@researchcanvas.app)";

export type ResolvedSource = {
  text: string; // title + abstract etc., fed to the extractor
  meta: Partial<PaperMeta>; // authoritative bits we already know (doi/journal/year)
  label: string; // human label, e.g. "DOI 10.1000/xyz"
};

const DOI_RE = /10\.\d{4,9}\/[^\s"'<>]+/i;
const PUBMED_ID_RE = /\bpubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/i;

function withTimeout(ms: number): AbortSignal {
  const c = new AbortController();
  setTimeout(() => c.abort(), ms);
  return c.signal;
}

function stripTags(s: string): string {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Detect what kind of link/identifier the user pasted. */
export function classifySource(
  input: string,
): { kind: "doi"; id: string } | { kind: "pubmed"; id: string } | null {
  const trimmed = input.trim();

  const pm = trimmed.match(PUBMED_ID_RE);
  if (pm) return { kind: "pubmed", id: pm[1] };
  if (/^\d{6,9}$/.test(trimmed)) return { kind: "pubmed", id: trimmed };

  const doi = trimmed.match(DOI_RE);
  if (doi) return { kind: "doi", id: doi[0].replace(/[.,;]+$/, "") };

  return null;
}

async function fetchDoi(doi: string): Promise<ResolvedSource> {
  const res = await fetch(
    `https://api.crossref.org/works/${encodeURIComponent(doi)}`,
    { headers: { "User-Agent": UA }, signal: withTimeout(12_000) },
  );
  if (!res.ok) throw new Error(`Crossref ${res.status}`);
  const json = await res.json();
  const m = json.message ?? {};

  const title: string = Array.isArray(m.title) ? m.title[0] : (m.title ?? "");
  const journal: string | undefined = Array.isArray(m["container-title"])
    ? m["container-title"][0]
    : undefined;
  const year: number | undefined =
    m.published?.["date-parts"]?.[0]?.[0] ??
    m["published-print"]?.["date-parts"]?.[0]?.[0] ??
    m["published-online"]?.["date-parts"]?.[0]?.[0];
  const abstract = m.abstract ? stripTags(m.abstract) : "";

  const text = [
    title && `Title: ${title}`,
    journal && `Journal: ${journal}`,
    year && `Year: ${year}`,
    abstract && `Abstract: ${abstract}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    text,
    meta: { doi, journal, year },
    label: `DOI ${doi}`,
  };
}

async function fetchPubmed(pmid: string): Promise<ResolvedSource> {
  const res = await fetch(
    `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${encodeURIComponent(
      pmid,
    )}&rettype=abstract&retmode=text`,
    { headers: { "User-Agent": UA }, signal: withTimeout(12_000) },
  );
  if (!res.ok) throw new Error(`PubMed ${res.status}`);
  const text = (await res.text()).trim();

  return {
    text,
    meta: {},
    label: `PubMed ${pmid}`,
  };
}

/**
 * Resolve a DOI or PubMed link/identifier to text + known metadata.
 * Throws if the input isn't recognized or the lookup returns nothing usable.
 */
export async function resolveSource(input: string): Promise<ResolvedSource> {
  const kind = classifySource(input);
  if (!kind) throw new Error("unrecognized");

  const resolved =
    kind.kind === "doi" ? await fetchDoi(kind.id) : await fetchPubmed(kind.id);

  if (resolved.text.replace(/\s/g, "").length < 40) {
    throw new Error("no-abstract");
  }
  return resolved;
}
