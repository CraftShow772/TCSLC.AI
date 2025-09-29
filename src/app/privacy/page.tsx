import type { Metadata } from "next";

import WhyYouSeeThis from "../../components/assistant/WhyYouSeeThis";

export const metadata: Metadata = {
  title: "Privacy & Responsible AI | TCSLC AI",
  description:
    "How TCSLC protects patient trust through encryption, minimization, and transparent governance across our AI-native platform.",
};

const PRINCIPLES = [
  {
    title: "Use minimization by design",
    description:
      "We only collect the data we need to deliver care-quality experiences, retain it for the shortest window possible, and give you controls to purge or export on demand.",
  },
  {
    title: "Security that matches clinical stakes",
    description:
      "Every interaction is encrypted in transit and at rest, scoped through role-based access, and monitored for anomalous behavior with automated containment.",
  },
  {
    title: "Transparent model stewardship",
    description:
      "We document training sources, evaluation datasets, and deployment guardrails so you can explain outcomes to patients, regulators, and partners.",
  },
];

const DATA_FLOW = [
  {
    name: "Source systems",
    details:
      "EHR, LMS, and scheduling systems stream into an isolated ingress where PHI is tokenized before any AI processing begins.",
  },
  {
    name: "AI processing",
    details:
      "Models operate on the tokenized layer with differential privacy, and only return the minimum structured insight needed for the workflow.",
  },
  {
    name: "Analytics lake",
    details:
      "Aggregated telemetry lands in a HIPAA-aligned analytics lake with lineage so you can audit every downstream dashboard.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="relative isolate mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16 lg:flex-row lg:py-24">
      <div className="mx-auto w-full max-w-3xl space-y-12 text-slate-200">
        <header className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400">Privacy</p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">Patient-trusted data stewardship</h1>
          <p className="text-base text-slate-300">
            Privacy is not a policy PDF—it is a living assurance program embedded into every surface of the TCSLC
            platform. From data ingress to model outputs, we engineer for least privilege, observability, and clear human
            accountability.
          </p>
        </header>

        <section className="space-y-6 rounded-3xl border border-white/10 bg-slate-950/60 p-8 shadow-lg shadow-black/30">
          <h2 className="text-lg font-semibold text-white">Our operating principles</h2>
          <p className="text-sm text-slate-300">
            These are the commitments we sign in our BAAs and revisit during every architecture review. They apply to the
            core platform, our AI copilots, and any integrations managed by TCSLC.
          </p>
          <ul className="grid gap-6 sm:grid-cols-2">
            {PRINCIPLES.map((principle) => (
              <li key={principle.title} className="rounded-2xl border border-white/5 bg-white/5 p-5">
                <h3 className="text-base font-semibold text-white">{principle.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{principle.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-8">
            <h2 className="text-lg font-semibold text-white">How data flows through the platform</h2>
            <p className="text-sm text-slate-300">
              We provide a documented, reviewable path for data so you can map it to your own compliance frameworks. Each
              stage includes automated checkpoints and human sign-off.
            </p>
            <ol className="mt-6 space-y-4">
              {DATA_FLOW.map((stage, index) => (
                <li key={stage.name} className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/10 text-sm font-semibold text-sky-300">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-white">{stage.name}</h3>
                    <p className="text-sm text-slate-300">{stage.details}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/60 p-8">
            <h2 className="text-lg font-semibold text-white">Your controls</h2>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>
                <span className="font-semibold text-white">Data portability:</span> Export structured transcripts, audit
                trails, and annotations to your warehouse or SIEM.
              </li>
              <li>
                <span className="font-semibold text-white">Retention policies:</span> Configure rolling deletion windows or
                legal hold for specific practice groups.
              </li>
              <li>
                <span className="font-semibold text-white">Subject rights:</span> Automated workflows for access, correction,
                and deletion requests ensure we respond within SLA.
              </li>
            </ul>
          </div>
        </section>
      </div>

      <aside className="w-full max-w-md shrink-0 space-y-8">
        <WhyYouSeeThis />
        <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/60 p-6 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-white">Regulatory alignment</h2>
          <p>
            TCSLC AI is built to exceed HIPAA, FERPA, and state privacy law requirements. We map our controls to NIST 800-53
            and HITRUST, and our team participates in annual third-party audits.
          </p>
          <p>
            Need custom documentation or to schedule a data protection impact assessment? Contact compliance@tcslc.com and we
            will respond within one business day.
          </p>
        </div>
      </aside>
    </div>
  );
}
