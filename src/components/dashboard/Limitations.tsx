"use client";

import { useState } from "react";

export function Limitations({ items }: { items: string[] }) {
  const [open, setOpen] = useState(false);
  if (items.length === 0) return null;

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="font-mono text-xs uppercase tracking-wide text-accent"
      >
        {open ? "− collapse" : "+ expand"}
      </button>
      {open && (
        <ul className="mt-4 flex flex-col gap-3">
          {items.map((item, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted">
              <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
