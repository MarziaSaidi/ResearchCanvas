"use client";

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { Chart } from "@/lib/schema";

export function OutcomeChart({ chart }: { chart: Chart }) {
  const positive = "#1d9e75";
  const negative = "#2b44ff";

  return (
    <div className="w-full">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart.data} margin={{ top: 24, right: 8, left: 8, bottom: 8 }}>
            <ReferenceLine y={0} stroke="var(--border)" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted)", fontSize: 12, fontFamily: "var(--font-mono)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={40}
              tick={{ fill: "var(--muted)", fontSize: 11, fontFamily: "var(--font-mono)" }}
              tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}%`}
            />
            <Bar dataKey="value" radius={4} maxBarSize={72} isAnimationActive={false}>
              {chart.data.map((d, i) => (
                <Cell key={i} fill={d.value < 0 ? negative : positive} />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                formatter={(v) => {
                  const n = Number(v);
                  return `${n > 0 ? "+" : ""}${n}%`;
                }}
                style={{ fill: "var(--text)", fontSize: 12, fontFamily: "var(--font-mono)" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
