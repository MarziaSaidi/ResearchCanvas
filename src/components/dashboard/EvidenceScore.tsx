// A lotus badge showing an aggregate "evidence score" (0-10), derived from how
// strongly the paper supports its headline stats. Inspired by the reference UI.
const PETAL_COLORS = ["#f2c88a", "#ec9433", "#d9781f", "#b45f14"];

export function EvidenceScore({ score }: { score: number }) {
  const petals = Array.from({ length: 8 });
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-28 w-28">
        <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
          <g transform="translate(60,60)">
            {petals.map((_, i) => (
              <ellipse
                key={i}
                cx="0"
                cy="-26"
                rx="12"
                ry="30"
                transform={`rotate(${i * 45})`}
                fill={PETAL_COLORS[i % PETAL_COLORS.length]}
                opacity="0.55"
              />
            ))}
            <circle r="25" fill="var(--surface)" stroke="var(--glass-border)" />
          </g>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-serif text-2xl text-text">
          {score.toFixed(1)}
        </div>
      </div>
      <span className="mt-1 font-mono text-[10px] uppercase tracking-wide text-muted">
        Evidence score
      </span>
    </div>
  );
}
