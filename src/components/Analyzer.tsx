"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = [
  "Reading source",
  "Extracting findings",
  "Identifying metrics",
  "Building visuals",
];

function LoadingState({ step }: { step: number }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
      <h2 className="mt-6 font-serif text-2xl text-text">Analyzing your paper…</h2>
      <p className="mt-1 text-sm text-muted">This usually takes 10–30 seconds.</p>
      <div className="mt-8 h-1 w-full max-w-md overflow-hidden rounded-full bg-border">
        <div
          className="h-full bg-accent transition-all duration-500"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>
      <ul className="mt-6 flex flex-col gap-2 text-left font-mono text-sm">
        {STEPS.map((s, i) => (
          <li
            key={s}
            className={
              i < step
                ? "text-muted line-through"
                : i === step
                  ? "text-text"
                  : "text-muted/50"
            }
          >
            <span className="mr-2 text-accent">{i <= step ? "●" : "○"}</span>
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Analyzer() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [doi, setDoi] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function run(body: FormData) {
    setError(null);
    setBusy(true);
    setStep(0);
    const timer = setInterval(
      () => setStep((s) => Math.min(s + 1, STEPS.length - 1)),
      2500,
    );
    try {
      const res = await fetch("/api/analyze", { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong");
      router.push(`/paper/${json.id}`);
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    } finally {
      clearInterval(timer);
    }
  }

  function onFile(f: File | null | undefined) {
    if (!f) return;
    const fd = new FormData();
    fd.set("file", f);
    run(fd);
  }

  function onAnalyzeDoi() {
    if (!doi.trim()) return;
    const fd = new FormData();
    fd.set("source", doi.trim());
    run(fd);
  }

  if (busy) return <LoadingState step={step} />;

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <p
          className="rounded-lg px-3 py-2 text-sm"
          style={{ backgroundColor: "var(--mod-bg)", color: "var(--mod-fg)" }}
        >
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          onFile(e.dataTransfer.files?.[0]);
        }}
        className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-16 transition-colors ${
          dragging ? "border-accent bg-accent/5" : "border-border"
        }`}
      >
        <span className="text-2xl text-muted" aria-hidden>
          ⭱
        </span>
        <span className="text-sm font-medium text-text">
          Drop a PDF here or click to upload
        </span>
        <span className="font-mono text-xs uppercase tracking-wide text-muted">
          PDF · DOI · PubMed link
        </span>
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0])}
      />

      <div className="flex gap-2">
        <input
          type="text"
          value={doi}
          onChange={(e) => setDoi(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onAnalyzeDoi()}
          placeholder="Or paste a DOI or PubMed URL…"
          className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-accent"
        />
        <button
          onClick={onAnalyzeDoi}
          className="rounded-lg bg-accent px-5 py-2 font-mono text-sm text-white hover:opacity-90"
        >
          Analyze
        </button>
      </div>
    </div>
  );
}
