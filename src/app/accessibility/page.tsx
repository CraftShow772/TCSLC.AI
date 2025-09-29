import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility & Inclusive Design | TCSLC AI",
  description:
    "How TCSLC builds AI-native experiences that are perceivable, operable, understandable, and robust for every learner and patient.",
};

const STANDARDS = [
  {
    title: "Perceivable",
    detail:
      "Color contrast meets WCAG 2.2 AA targets, motion can be reduced, and transcripts or captions are provided for every multimedia surface.",
  },
  {
    title: "Operable",
    detail:
      "Every workflow is fully keyboard navigable with clear focus states, logical tab order, and bypass links for repetitive content.",
  },
  {
    title: "Understandable",
    detail:
      "We author plain-language summaries alongside AI explanations and keep terminology consistent across patient, clinician, and admin views.",
  },
  {
    title: "Robust",
    detail:
      "Interfaces are tested with assistive technologies including screen readers, voice control, and switch devices before shipping.",
  },
];

const SUPPORT_CHANNELS = [
  {
    heading: "Accessibility desk",
    body: "Email access@tcslc.com for prioritized assistance, VPAT requests, or to request accessible training materials.",
  },
  {
    heading: "24/7 hotline",
    body: "Call 1-800-555-8275 to report issues impacting care delivery. We connect you with an on-call specialist within 15 minutes.",
  },
  {
    heading: "Feedback loop",
    body: "Use the in-product \"Report an issue\" shortcut or submit a GitHub issue in our public accessibility tracker.",
  },
];

export default function AccessibilityPage() {
  return (
    <div className="relative isolate mx-auto max-w-6xl space-y-16 px-6 py-16 lg:py-24">
      <header className="space-y-4 text-slate-200">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">Accessibility</p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">Inclusive, assistive-first experiences</h1>
        <p className="text-base text-slate-300">
          Equity is a product requirement. We invest in inclusive research, test with diverse learners and clinicians, and
          build remediation hooks directly into our AI copilots so accessibility never slips to a backlog.
        </p>
      </header>

      <section className="grid gap-8 rounded-3xl border border-white/10 bg-slate-950/60 p-8 shadow-lg shadow-black/30 lg:grid-cols-[1.2fr,1fr]">
        <div className="space-y-6 text-slate-200">
          <h2 className="text-lg font-semibold text-white">WCAG 2.2 AA as a baseline</h2>
          <p className="text-sm text-slate-300">
            Our cross-functional accessibility guild runs automated and manual audits across every release train. These four
            pillars guide design, content, and engineering decisions across the TCSLC platform.
          </p>
          <dl className="grid gap-6 sm:grid-cols-2">
            {STANDARDS.map((standard) => (
              <div key={standard.title} className="rounded-2xl border border-white/5 bg-white/5 p-5">
                <dt className="text-base font-semibold text-white">{standard.title}</dt>
                <dd className="mt-2 text-sm text-slate-300">{standard.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="space-y-4 rounded-2xl border border-white/5 bg-slate-950/80 p-6 text-sm text-slate-300">
          <h3 className="text-base font-semibold text-white">Assistive technology coverage</h3>
          <p>
            We certify support for JAWS, NVDA, VoiceOver, TalkBack, Dragon NaturallySpeaking, and switch control interfaces.
            New feature work only ships after passing our assistive compatibility matrix.
          </p>
          <p>
            Need documentation in Braille-ready or large-print formats? Let us know and we will provide accessible exports
            within two business days.
          </p>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/60 p-8 text-slate-200">
          <h2 className="text-lg font-semibold text-white">Inclusive AI operations</h2>
          <ul className="space-y-3 text-sm text-slate-300">
            <li>
              <span className="font-semibold text-white">Diverse evaluators:</span> We compensate clinicians and learners with
              disabilities to evaluate prompts, transcripts, and UI updates.
            </li>
            <li>
              <span className="font-semibold text-white">Bias monitoring:</span> Accessibility-specific test suites flag
              regressions in alternative text quality, caption coverage, and language complexity.
            </li>
            <li>
              <span className="font-semibold text-white">Continuous education:</span> Every engineer participates in quarterly
              accessibility labs covering semantics, screen reader etiquette, and inclusive writing.
            </li>
          </ul>
        </div>
        <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/60 p-8 text-slate-200">
          <h2 className="text-lg font-semibold text-white">We're here to help</h2>
          <p className="text-sm text-slate-300">
            Accessibility is a shared practice. Our support team and accessibility guild collaborate to resolve issues fast
            and learn from every interaction.
          </p>
          <ul className="space-y-3 text-sm text-slate-300">
            {SUPPORT_CHANNELS.map((channel) => (
              <li key={channel.heading} className="rounded-2xl border border-white/5 bg-white/5 p-5">
                <h3 className="text-base font-semibold text-white">{channel.heading}</h3>
                <p className="mt-1">{channel.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
