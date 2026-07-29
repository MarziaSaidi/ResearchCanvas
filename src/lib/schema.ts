import { z } from "zod";

/**
 * PaperInsights — the shared contract between the extraction pipeline (Claude)
 * and the dashboard UI (Marzia's designs).
 *
 * Every claim carries a `sourceQuote` so nothing is presented as fact without
 * traceability back to the source paper. This schema is also the tool-input
 * schema handed to Claude, and validates the model's output before render.
 *
 * v0 draft — see ROADMAP.md. Refine fields here with design input.
 */

export const confidenceEnum = z.enum(["high", "moderate", "low"]);
export type Confidence = z.infer<typeof confidenceEnum>;

export const statCardSchema = z.object({
  label: z.string().describe("Short label, e.g. 'Depression reduction'"),
  value: z.string().describe("Headline value as shown, e.g. '28%'"),
  direction: z
    .enum(["up", "down", "neutral"])
    .describe("Direction of the effect for visual treatment"),
  confidence: confidenceEnum.describe(
    "How strongly the paper supports this figure",
  ),
  sourceQuote: z
    .string()
    .describe("Exact span from the paper supporting this stat (traceability)"),
});
export type StatCard = z.infer<typeof statCardSchema>;

export const causalLinkSchema = z.object({
  from: z.string().describe("Cause / upstream node, e.g. 'Exercise'"),
  to: z.string().describe("Effect / downstream node, e.g. 'Lower inflammation'"),
  label: z
    .string()
    .optional()
    .describe("Optional edge label describing the relationship"),
});
export type CausalLink = z.infer<typeof causalLinkSchema>;

export const chartSchema = z.object({
  type: z.enum(["bar", "line"]),
  title: z.string(),
  data: z.array(
    z.object({
      label: z.string(),
      value: z.number(),
    }),
  ),
});
export type Chart = z.infer<typeof chartSchema>;

export const paperInsightsSchema = z.object({
  title: z.string().describe("Paper title"),
  executiveSummary: z
    .string()
    .describe("2-4 sentences, plain language, no jargon"),
  keyFindings: z.array(z.string()).describe("Bullet-point key findings"),
  statCards: z.array(statCardSchema),
  causalChain: z
    .array(causalLinkSchema)
    .describe("Ordered cause->effect links for the flow diagram"),
  chart: chartSchema.optional(),
  limitations: z
    .array(z.string())
    .describe("What the paper does NOT prove; caveats and scope"),
  isHealthRelated: z
    .boolean()
    .describe("True if the paper concerns health/medical topics (drives the not-medical-advice disclaimer)"),
});
export type PaperInsights = z.infer<typeof paperInsightsSchema>;
