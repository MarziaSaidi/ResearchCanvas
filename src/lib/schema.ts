import { z } from "zod";

/**
 * PaperInsights — the shared contract between the extraction pipeline (Claude)
 * and the dashboard UI (the Figma design).
 *
 * Every claim carries a `sourceQuote` so nothing is presented as fact without
 * traceability. This schema is also the tool-input schema handed to Claude, and
 * validates the model's output before render. See ROADMAP.md.
 */

export const confidenceEnum = z.enum(["high", "moderate", "low"]);
export type Confidence = z.infer<typeof confidenceEnum>;

// Header metadata line: "[RCT] Journal of Clinical Psychiatry · Vol 85 · 2024 · n = 480 · DOI ..."
export const paperMetaSchema = z.object({
  studyType: z
    .string()
    .optional()
    .describe("Short study-type tag, e.g. 'RCT', 'Meta-analysis', 'Cohort'"),
  journal: z.string().optional().describe("Publishing journal name"),
  year: z.number().int().optional().describe("Publication year"),
  sampleSize: z
    .number()
    .int()
    .optional()
    .describe("Number of participants/subjects (the 'n')"),
  doi: z.string().optional().describe("DOI, if known"),
});
export type PaperMeta = z.infer<typeof paperMetaSchema>;

export const statCardSchema = z.object({
  label: z.string().describe("Short label, e.g. 'Depression symptom reduction'"),
  value: z.string().describe("Headline value as shown, e.g. '28%' or '12 wk'"),
  direction: z
    .enum(["up", "down", "neutral"])
    .describe("Direction of the effect, for the arrow"),
  confidence: confidenceEnum.describe(
    "How strongly the paper supports this figure",
  ),
  sourceQuote: z
    .string()
    .describe("Exact span from the paper supporting this stat (traceability)"),
});
export type StatCard = z.infer<typeof statCardSchema>;

// A node in the causal pathway. Nodes are ordered; the UI draws an arrow
// between each consecutive pair.
export const causalNodeSchema = z.object({
  label: z.string().describe("Node title, e.g. 'Lower inflammation'"),
  detail: z
    .string()
    .optional()
    .describe("Small caption under the node, e.g. 'CRP ↓ 6.2×'"),
});
export type CausalNode = z.infer<typeof causalNodeSchema>;

export const causalChainSchema = z.object({
  nodes: z
    .array(causalNodeSchema)
    .describe("Ordered cause -> effect nodes; arrows are drawn between them"),
  note: z
    .string()
    .optional()
    .describe(
      "Caveat about the pathway, e.g. 'Hypothesized mechanism; no formal mediation analysis.'",
    ),
});
export type CausalChain = z.infer<typeof causalChainSchema>;

export const chartSchema = z.object({
  type: z.enum(["bar", "line"]),
  title: z.string(),
  subtitle: z
    .string()
    .optional()
    .describe("Axis/context caption, e.g. '% change from baseline · 12-week endpoint'"),
  data: z.array(
    z.object({
      label: z.string(),
      value: z.number(),
    }),
  ),
});
export type Chart = z.infer<typeof chartSchema>;

export const paperInsightsSchema = z.object({
  title: z.string().describe("Full paper title"),
  meta: paperMetaSchema.describe("Header metadata; omit any field that's unknown"),
  executiveSummary: z
    .string()
    .describe("4-6 sentences, plain language, no jargon"),
  keyFindings: z.array(z.string()).describe("Bullet-point key findings"),
  statCards: z.array(statCardSchema),
  causalChain: causalChainSchema,
  chart: chartSchema.optional(),
  limitations: z
    .array(z.string())
    .describe("What the paper does NOT prove; caveats and scope"),
  isHealthRelated: z
    .boolean()
    .describe("True for medical/health topics (drives the not-medical-advice banner)"),
});
export type PaperInsights = z.infer<typeof paperInsightsSchema>;
