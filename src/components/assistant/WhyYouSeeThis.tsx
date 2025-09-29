import { Database, Eye, ShieldCheck, Workflow } from "lucide-react";

const ITEMS = [
  {
    icon: ShieldCheck,
    title: "Privacy-preserving guardrails",
    description:
      "We automatically redact emails, phone numbers, payment details, and other identifiers before any data leaves your session.",
  },
  {
    icon: Workflow,
    title: "Traceable actions",
    description:
      "Every tool invocation and human override is captured in an immutable audit log so you can reconstruct decisions end-to-end.",
  },
  {
    icon: Eye,
    title: "Accountable transparency",
    description:
      "You can always inspect why a recommendation was made, the model confidence, and any safeguards that were triggered.",
  },
  {
    icon: Database,
    title: "Data residency controls",
    description:
      "Logs stay in-region and can be routed to your preferred lakehouse or SIEM with retention policies you control.",
  },
];

export function WhyYouSeeThis() {
  return (
    <section className="space-y-6 rounded-2xl border border-white/10 bg-slate-950/80 p-6 text-slate-200 shadow-xl shadow-slate-900/40">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Why you're seeing this
        </p>
        <h2 className="text-xl font-semibold text-white">A transparent AI co-pilot</h2>
        <p className="text-sm text-slate-300">
          Every response includes the compliance, privacy, and quality signals that our assurance layer evaluated so
          your team can trust what ships to patients and partners.
        </p>
      </header>

      <dl className="grid gap-4 sm:grid-cols-2">
        {ITEMS.map((item) => (
          <div
            key={item.title}
            className="group flex gap-4 rounded-xl border border-white/5 bg-white/5 p-4 transition hover:border-sky-400/60 hover:bg-sky-400/10"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/10 text-sky-300 transition group-hover:bg-sky-500/20 group-hover:text-sky-200">
              <item.icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <dt className="text-sm font-semibold text-white">{item.title}</dt>
              <dd className="text-sm text-slate-300">{item.description}</dd>
            </div>
          </div>
        ))}
      </dl>

      <footer className="rounded-xl border border-white/5 bg-slate-900/80 p-4 text-xs text-slate-400">
        <p>
          Need to export an audit package or configure retention? Reach out to your TCSLC compliance manager and we'll
          wire this feed into your existing governance workflows.
        </p>
      </footer>
    </section>
  );
}

export default WhyYouSeeThis;
