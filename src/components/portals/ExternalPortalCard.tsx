import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import type { ReactNode } from "react";

import { portals, safeExternal } from "@/lib/links";

type PortalInfo = (typeof portals)[keyof typeof portals];

type Requirement = {
  label: string;
  detail?: string;
};

type ExternalPortalCardProps = {
  title: string;
  description: string;
  portal: PortalInfo;
  requirements: Requirement[];
  continueLabel?: string;
  supportContent?: ReactNode;
  footerNote?: ReactNode;
};

const vendorCopy: Record<Exclude<PortalInfo["vendor"], undefined>, string> = {
  MEG: "MyEasyGov",
  Other: "third-party partner"
};

export function ExternalPortalCard({
  title,
  description,
  portal,
  requirements,
  continueLabel,
  supportContent,
  footerNote
}: ExternalPortalCardProps) {
  const href = safeExternal(portal.url);
  const isDisabled = href === "#";
  const vendorLabel = portal.vendor ? vendorCopy[portal.vendor] ?? portal.vendor : undefined;
  const actionLabel = continueLabel ?? `Continue to ${portal.label}`;

  return (
    <section className="mx-auto w-full max-w-3xl">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="space-y-6 p-8 sm:p-10">
          <header className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-wide text-blue-600">Step 1 of 2</p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h1>
            <p className="text-base text-slate-600 dark:text-slate-300">{description}</p>
            {vendorLabel ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                You will complete this action on our secure partner site powered by {vendorLabel}.
              </p>
            ) : null}
          </header>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Before you continue</h2>
            <ul className="space-y-3">
              {requirements.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="space-y-1">
                    <p className="font-medium text-slate-900 dark:text-white">{item.label}</p>
                    {item.detail ? <p className="text-slate-600 dark:text-slate-300">{item.detail}</p> : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {supportContent ? (
            <div className="rounded-2xl border border-slate-100 p-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
              {supportContent}
            </div>
          ) : null}

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Link
              href={href}
              target="_blank"
              rel="noreferrer"
              prefetch={false}
              className={`inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300 dark:bg-blue-500 dark:hover:bg-blue-400 ${
                isDisabled ? "pointer-events-none opacity-60" : ""
              }`}
              aria-disabled={isDisabled}
            >
              <span>{actionLabel}</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400">Opens a new secure tab</p>
          </div>

          {footerNote ? <footer className="text-xs text-slate-500 dark:text-slate-400">{footerNote}</footer> : null}
        </div>
      </div>
    </section>
  );
}
