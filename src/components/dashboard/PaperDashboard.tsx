import type { PaperInsights, StatCard as StatCardType, Confidence } from "@/lib/schema";
import { OutcomeChart } from "./OutcomeChart";
import { Limitations } from "./Limitations";

const STAT_COLORS = ["#2b44ff", "#1d9e75", "#c9822a", "#7a5bd0"];

const BADGE: Record<Confidence, { bg: string; fg: string }> = {
  high: { bg: "var(--hi-bg)", fg: "var(--hi-fg)" },
  moderate: { bg: "var(--mod-bg)", fg: "var(--mod-fg)" },
  low: { bg: "var(--lo-bg)", fg: "var(--lo-fg)" },
};

function Section({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14">
      <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-muted">
        <span className="mr-2 text-accent">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function StatCard({ stat, color }: { stat: StatCardType; color: string }) {
  const arrow = stat.direction === "up" ? "↑" : stat.direction === "down" ? "↓" : "";
  const badge = BADGE[stat.confidence];
  return (
    <div className="flex flex-col justify-between rounded-xl border border-border bg-surface p-5">
      <div>
        <div className="flex items-baseline gap-1 font-serif text-4xl" style={{ color }}>
          {stat.value}
          {arrow && <span className="text-2xl">{arrow}</span>}
        </div>
        <div className="mt-2 text-sm text-muted">{stat.label}</div>
      </div>
      <div className="mt-4">
        <span
          className="inline-block rounded px-2 py-1 font-mono text-[10px] uppercase tracking-wide"
          style={{ backgroundColor: badge.bg, color: badge.fg }}
        >
          {stat.confidence}
        </span>
      </div>
    </div>
  );
}

function CausalFlow({ nodes, note }: PaperInsights["causalChain"]) {
  if (nodes.length === 0) return null;
  return (
    <div>
      <div className="flex items-stretch gap-2 overflow-x-auto pb-2">
        {nodes.map((node, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="min-w-[160px] max-w-[200px] rounded-xl border border-border bg-surface p-4">
              <div className="text-sm font-medium text-text">{node.label}</div>
              {node.detail && (
                <div className="mt-1 font-mono text-xs text-muted">{node.detail}</div>
              )}
            </div>
            {i < nodes.length - 1 && (
              <span className="shrink-0 text-accent" aria-hidden>
                →
              </span>
            )}
          </div>
        ))}
      </div>
      {note && <p className="mt-3 text-xs italic text-muted">* {note}</p>}
    </div>
  );
}

function MetaLine({ meta }: { meta: PaperInsights["meta"] }) {
  const parts = [
    meta.journal,
    meta.year ? `${meta.year}` : null,
    meta.sampleSize ? `n = ${meta.sampleSize}` : null,
    meta.doi ? `DOI ${meta.doi}` : null,
  ].filter(Boolean);
  if (!meta.studyType && parts.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-wide text-muted">
      {meta.studyType && (
        <span className="rounded border border-accent px-1.5 py-0.5 text-accent">
          {meta.studyType}
        </span>
      )}
      {parts.length > 0 && <span>{parts.join(" · ")}</span>}
    </div>
  );
}

export function PaperDashboard({
  insights,
  analyzedAt,
}: {
  insights: PaperInsights;
  analyzedAt?: string;
}) {
  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-14">
      <MetaLine meta={insights.meta} />

      <h1 className="mt-4 font-serif text-4xl leading-tight text-text sm:text-5xl">
        {insights.title}
      </h1>

      {insights.isHealthRelated && (
        <div
          className="mt-6 rounded-lg px-4 py-3 text-sm"
          style={{ backgroundColor: "var(--mod-bg)", color: "var(--mod-fg)" }}
        >
          <span className="font-medium">Summarizes research — not medical advice.</span>{" "}
          Consult a qualified healthcare provider before acting on any findings.
        </div>
      )}

      <Section n="01" title="Executive summary">
        <div className="rounded-xl border border-border bg-surface p-6 text-[15px] leading-relaxed text-text">
          {insights.executiveSummary}
        </div>
      </Section>

      {insights.statCards.length > 0 && (
        <Section n="02" title="Key metrics">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {insights.statCards.slice(0, 4).map((stat, i) => (
              <StatCard key={i} stat={stat} color={STAT_COLORS[i % STAT_COLORS.length]} />
            ))}
          </div>
        </Section>
      )}

      {insights.keyFindings.length > 0 && (
        <Section n="03" title="Key findings">
          <ol className="flex flex-col gap-4">
            {insights.keyFindings.map((f, i) => (
              <li key={i} className="flex gap-4">
                <span className="font-mono text-xs text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[15px] leading-relaxed text-text">{f}</span>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {insights.causalChain.nodes.length > 0 && (
        <Section n="04" title="Proposed causal pathway">
          <CausalFlow {...insights.causalChain} />
        </Section>
      )}

      {insights.chart && (
        <Section n="05" title={insights.chart.title}>
          {insights.chart.subtitle && (
            <p className="mb-4 font-mono text-xs uppercase tracking-wide text-muted">
              {insights.chart.subtitle}
            </p>
          )}
          <div className="rounded-xl border border-border bg-surface p-5">
            <OutcomeChart chart={insights.chart} />
          </div>
        </Section>
      )}

      {insights.limitations.length > 0 && (
        <Section n="06" title="Limitations & caveats">
          <Limitations items={insights.limitations} />
        </Section>
      )}

      <footer className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 font-mono text-xs uppercase tracking-wide text-muted">
        <span>
          ResearchCanvas{analyzedAt ? ` · Analyzed ${analyzedAt}` : ""}
        </span>
        <a href="/" className="text-accent">
          ↑ Analyze another
        </a>
      </footer>
    </article>
  );
}
