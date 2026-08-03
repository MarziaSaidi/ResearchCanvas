import { PaperDashboard } from "@/components/dashboard/PaperDashboard";
import type { PaperInsights } from "@/lib/schema";

// Temporary design-preview route with sample data (no auth/DB). Delete later.
const sample: PaperInsights = {
  title:
    "A 12-week aerobic exercise program reduces depression symptoms in adults with major depressive disorder",
  meta: {
    studyType: "RCT",
    journal: "Journal of Clinical Psychiatry",
    year: 2024,
    sampleSize: 480,
    doi: "10.4088/JCP.24m15192",
  },
  executiveSummary:
    "A randomized controlled trial enrolled 480 adults with confirmed major depressive disorder and assigned them to a structured 12-week aerobic exercise program — three 45-minute sessions per week — or a waitlist control. At endpoint, the exercise group showed a statistically significant 28% reduction in PHQ-9 depression scores versus 4% in controls (p < 0.001). The intervention also reduced CRP 6.2-fold, improved sleep quality by 12%, and cut anxiety scores by 19%.",
  keyFindings: [
    "Exercising participants showed a 28% reduction in PHQ-9 scores vs. 4% in the waitlist control (p < 0.001, Cohen's d = 0.74).",
    "C-reactive protein (CRP) fell 6.2-fold within 6 weeks, indicating a rapid anti-inflammatory response.",
    "Pittsburgh Sleep Quality Index improved 12% at endpoint — consistent across all subgroups.",
    "Effect sizes were largest in participants with PHQ-9 ≥ 15 at baseline, suggesting a dose-response relationship.",
    "Dropout rates were low and comparable: 11% in the exercise arm vs. 9% in the control arm.",
  ],
  statCards: [
    {
      label: "Depression symptom reduction",
      value: "28%",
      direction: "down",
      confidence: "high",
      sourceQuote: "reduced PHQ-9 depression scores by 28% versus 4% in controls (p < 0.001)",
    },
    {
      label: "Participants enrolled",
      value: "480",
      direction: "up",
      confidence: "high",
      sourceQuote: "enrolled 480 adults with confirmed major depressive disorder",
    },
    {
      label: "Sleep quality improvement",
      value: "12%",
      direction: "up",
      confidence: "moderate",
      sourceQuote: "improved sleep quality by 12%",
    },
    {
      label: "Follow-up period",
      value: "12 wk",
      direction: "neutral",
      confidence: "high",
      sourceQuote: "a structured 12-week aerobic exercise program",
    },
  ],
  causalChain: {
    nodes: [
      { label: "12-week aerobic exercise", detail: "3 × 45 min / week" },
      { label: "Lower inflammation", detail: "CRP ↓ 6.2×" },
      { label: "Improved mood regulation", detail: "HPA axis normalization" },
      { label: "28% fewer symptoms", detail: "PHQ-9 endpoint" },
    ],
    note: "Hypothesized mechanism; no formal mediation analysis was performed.",
  },
  chart: {
    type: "bar",
    title: "Reported outcome changes",
    subtitle: "% change from baseline · exercise arm · 12-week endpoint",
    data: [
      { label: "Depression", value: -28 },
      { label: "Sleep quality", value: 12 },
    ],
  },
  limitations: [
    "Single-site study, so results may not transfer to other populations or settings.",
    "Follow-up ended at 12 weeks; longer-term durability is unknown.",
    "Waitlist (not active) control, so placebo and attention effects cannot be ruled out.",
    "The inflammation-to-mood mechanism was hypothesized, not tested via mediation analysis.",
  ],
  isHealthRelated: true,
};

export default function PreviewPage() {
  return <PaperDashboard insights={sample} analyzedAt="Aug 3, 2026" />;
}
