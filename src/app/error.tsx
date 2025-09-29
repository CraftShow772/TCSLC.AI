"use client";

import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-24 text-center text-slate-100">
      <div className="max-w-xl space-y-6">
        <span className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Something went wrong
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          We couldn&apos;t complete that request
        </h1>
        <p className="text-base leading-relaxed text-slate-300">
          Our systems detected an error while rendering this page. The team has
          been notified automatically. You can retry the action or head back to
          the homepage.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center rounded-full border border-slate-700 px-5 py-2.5 text-sm font-medium text-white transition hover:border-slate-500 hover:bg-slate-900"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
          >
            Back to homepage
          </a>
        </div>
        {error.digest ? (
          <p className="text-xs text-slate-500">Error reference: {error.digest}</p>
        ) : null}
      </div>
    </main>
  );
}
