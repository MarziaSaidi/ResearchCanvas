# ResearchCanvas — Research → UI Generator

Turn a research paper (PDF / DOI / PubMed) into an interactive, visual dashboard:
executive summary, key findings, charts, causal flow diagrams, timelines,
before/after comparisons, stat cards, and confidence indicators.

---

## Roles

| Owner | Responsible for |
|-------|-----------------|
| **Marzia** — Design & System | UX flows, information architecture, visual design of every component, the "spec" for each visualization (what a stat card / flow node / confidence badge looks like), choosing test papers, product decisions, deciding what content the AI should extract |
| **Claude** — Code & Safety | Scaffolding, ingestion pipeline, PDF/DOI/PubMed parsing, Claude API integration + structured extraction, rendering Marzia's designs, input validation, untrusted-input safety, testing, deploy |

**Shared contract:** the extraction JSON schema (below). It's the seam between
Marzia's designs and Claude's code — agree on it early, then both sides can work
in parallel against it.

---

## MVP scope (thin but complete vertical slice)

One flow, working end to end:

1. Upload a **PDF** (DOI/PubMed come in Phase 3).
2. Extract text.
3. Claude turns it into structured JSON (the schema below).
4. Render a dashboard:
   - Executive summary
   - Key findings list
   - Stat result cards (e.g. "28% reduction")
   - One causal **flow diagram** (Exercise → ↓ inflammation → ↑ mood → 28% ↓)
   - One **chart**

Everything else (timeline, before/after, animated evidence viewer, confidence
tuning, multi-paper) is **iteration after MVP**.

---

## Tech stack (locked)

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** for base components
- **Recharts** — charts
- **@xyflow/react** (React Flow) — causal / flow diagrams
- **Framer Motion** — animations
- **unpdf** — serverless PDF text extraction
- **@anthropic-ai/sdk** — extraction via **Claude** (structured tool-use output)
- **Zod** — validate the model's JSON before rendering
- **Supabase** — Auth + Postgres (saved papers/history) + Storage (uploaded PDFs), one service

---

## Shared data contract (v0 draft — Marzia to refine)

```ts
type PaperInsights = {
  title: string;
  executiveSummary: string;          // 2–4 sentences, plain language
  keyFindings: string[];             // bullet points
  statCards: {
    label: string;                   // "Depression reduction"
    value: string;                   // "28%"
    direction: "up" | "down" | "neutral";
    confidence: "high" | "moderate" | "low";
    sourceQuote: string;             // exact span from paper (traceability)
  }[];
  causalChain: { from: string; to: string; label?: string }[];
  chart?: {
    type: "bar" | "line";
    title: string;
    data: { label: string; value: number }[];
  };
  limitations: string[];             // what the paper does NOT prove
};
```

Every extracted claim carries a `sourceQuote` so nothing is presented as fact
without traceability back to the paper.

---

## Schedule

Anchored from **2026-07-29**. **Full-time / push-hard pace** — days are working days, move as fast as decisions allow.

### Phase 0 — Foundations (Day 1)
- **Claude:** scaffold Next.js + TS + Tailwind + shadcn, wire **Supabase** (auth + DB + storage), `.env` for Anthropic + Supabase keys, deploy a "hello" build.
- **Marzia:** lock the extraction schema + wireframe the dashboard layout and each component.
- **Gate:** schema agreed, empty app deploys, sign-up/login works.

### Phase 1 — Ingestion + extraction pipeline (Days 2–3)
- **Claude:** PDF upload (→ Supabase Storage) → text extraction → **Claude** structured call → Zod-validated `PaperInsights` JSON, persisted per user. No UI yet, just JSON out.
- **Claude (safety):** file-type/size limits, treat PDF text as untrusted data (prompt-injection isolation), health-content disclaimer, per-user row-level security.
- **Marzia:** finalize visual specs for summary, findings, stat cards.
- **Gate:** logged-in user uploads a paper → gets correct JSON saved to their account.

### Phase 2 — Render the MVP dashboard (Days 4–5)
- **Claude:** build components to Marzia's designs — summary, findings, stat cards, causal flow diagram, one chart + a saved-papers list.
- **Marzia:** design review + polish pass on the real rendered output.
- **Gate:** ✅ **MVP** — log in, upload the exercise/depression paper, see the full dashboard, revisit it later.

### Phase 3 — Iterate (Days 6+)
Prioritized after MVP works:
- DOI + PubMed input (resolve → fetch → same pipeline)
- Timeline + before/after comparison components
- Animated graphs + interactive evidence viewer
- Confidence indicators tuning
- Multi-paper / history

---

## Safety notes (Claude owns, Marzia should know)

1. **PDFs are untrusted input.** Their text is fed to the LLM — a malicious PDF can attempt prompt injection. Extracted text is treated as *data to analyze*, never as instructions.
2. **No hallucinated facts.** Every stat carries a `sourceQuote`; low-confidence items are labeled, not hidden.
3. **Not medical advice.** Health papers (like the depression example) get a clear "summarizes research, not medical guidance" disclaimer.
4. **File handling:** type/size validation, no arbitrary file execution.

---

## Decisions (locked 2026-07-29)

- **LLM provider:** ✅ **Claude** (structured tool-use extraction).
- **Auth / saving:** ✅ **Accounts from day one** — Supabase auth + per-user saved papers.
- **Pace:** ✅ **Push hard / full-time** — MVP target ~5 working days.
