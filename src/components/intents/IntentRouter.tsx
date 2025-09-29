"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { IntentResult } from "../../lib/intents";

function formatIntentName(intent: IntentResult["intent"]) {
  if (intent === "unknown") return "Unknown";
  return intent
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function IntentRouter() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<IntentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formattedConfidence = useMemo(() => {
    if (!result) return null;
    return `${Math.round(result.confidence * 100)}%`;
  }, [result]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim()) {
      setError("Type a question or request to continue.");
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/assistant/intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? "Unable to classify your request.");
      }

      const payload: IntentResult = await response.json();
      setResult(payload);
    } catch (classificationError) {
      setError(
        classificationError instanceof Error
          ? classificationError.message
          : "Something went wrong. Please try again."
      );
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-[0_45px_70px_-40px_rgba(15,23,42,0.6)] backdrop-blur">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-50">AI Intent Router</h2>
          <p className="text-sm text-slate-200/80">
            Ask a question in plain language and we&apos;ll guide you to the right Treasure Coast Service Center.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="assistant-query">
            Ask the assistant
          </label>
          <input
            id="assistant-query"
            name="query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Renew my vehicle registration"
            className="h-12 w-full rounded-full border border-white/10 bg-slate-950/60 px-5 text-sm text-slate-100 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
          />
          <button
            type="submit"
            className="h-12 shrink-0 rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 px-6 text-sm font-semibold text-white shadow-[0_10px_20px_-15px_rgba(56,189,248,0.9)] transition hover:from-sky-400 hover:via-blue-500 hover:to-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Classifying..." : "Find next step"}
          </button>
        </form>

        {error && <p className="text-sm text-rose-300">{error}</p>}

        {result && (
          <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Predicted intent</p>
                <p className="text-xl font-semibold text-slate-50">{formatIntentName(result.intent)}</p>
              </div>
              {formattedConfidence && (
                <div className="rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1 text-sm font-medium text-sky-200">
                  Confidence {formattedConfidence}
                </div>
              )}
            </div>

            {result.intent === "unknown" ? (
              <p className="mt-4 text-sm text-slate-200/80">
                We couldn&apos;t find an exact match. Explore our service directory for more options.
              </p>
            ) : (
              <p className="mt-4 text-sm text-slate-200/80">
                Our assistant recommends starting with this service area based on your request.
              </p>
            )}

            {result.targetPath && (
              <Link
                href={result.targetPath}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-300 transition hover:text-sky-200"
              >
                Visit {result.targetPath}
                <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
