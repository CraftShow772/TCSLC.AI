"use client";

import { Citation } from "../../lib/ai/types";
import { EscalateButton } from "./EscalateButton";

interface CitationsPanelProps {
  citations: Citation[];
  lowConfidence?: boolean;
}

export function CitationsPanel({ citations, lowConfidence }: CitationsPanelProps) {
  if (citations.length === 0 && !lowConfidence) {
    return null;
  }

  return (
    <div className="border-t border-slate-200 bg-slate-50/80 px-6 py-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
      {citations.length > 0 && (
        <div className="space-y-2">
          <p className="font-semibold uppercase tracking-wide text-[11px] text-slate-500 dark:text-slate-400">Referenced resources</p>
          <ul className="space-y-2">
            {citations.map((citation, index) => (
              <li key={citation.url ?? citation.title ?? index} className="leading-snug">
                {citation.url ? (
                  <a
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-indigo-600 hover:underline dark:text-indigo-300"
                  >
                    {citation.title ?? citation.url}
                  </a>
                ) : (
                  <span className="font-medium text-slate-700 dark:text-slate-200">{citation.title}</span>
                )}
                {citation.snippet && <p className="text-slate-500 dark:text-slate-400">{citation.snippet}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-3 flex items-center justify-between gap-3">
        {lowConfidence && (
          <span className="text-[11px] font-medium uppercase tracking-wide text-amber-600 dark:text-amber-300">
            Assistant confidence: needs review
          </span>
        )}
        <EscalateButton className="ml-auto" />
      </div>
    </div>
  );
}
