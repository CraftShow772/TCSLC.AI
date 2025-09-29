"use client";

import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-24 text-center text-slate-100">
        <div className="max-w-xl space-y-6">
          <span className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Critical failure
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            We&apos;re working to restore service
          </h1>
          <p className="text-base leading-relaxed text-slate-300">
            Something unexpected prevented the application from loading. Please
            refresh the page or try again in a few moments. If the problem
            continues, contact support with the reference below.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center rounded-full border border-slate-700 px-5 py-2.5 text-sm font-medium text-white transition hover:border-slate-500 hover:bg-slate-900"
            >
              Reload
            </button>
            <a
              href="mailto:support@tcslc.com"
              className="inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
            >
              Contact support
            </a>
          </div>
          {error.digest ? (
            <p className="text-xs text-slate-500">Error reference: {error.digest}</p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
