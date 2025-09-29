import Link from "next/link";
import { getContentList } from "@/lib/content";

export default async function HomePage() {
  const content = await getContentList();

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-16 px-6 py-24 sm:px-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_58%)]" />
      <section className="space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">
          TCSLC.AI
        </p>
        <h1 className="text-4xl font-semibold text-slate-50 sm:text-5xl">
          AI-native transformation for transportation and logistics leaders.
        </h1>
        <p className="max-w-2xl text-lg text-slate-300">
          We partner with visionary teams to orchestrate intelligent customer journeys,
          elevate operational clarity, and create revenue through real-time, context-aware AI.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="mailto:hello@tcslc.com"
            className="rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            Start a project
          </Link>
          <Link
            href="#insights"
            className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-400 hover:text-sky-300"
          >
            Explore insights
          </Link>
        </div>
      </section>

      <section id="insights" className="space-y-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-50">Latest insights</h2>
            <p className="text-sm text-slate-400">
              Signal-rich briefs on how AI reshapes logistics, commerce, and client experiences.
            </p>
          </div>
          <span className="hidden text-xs font-medium uppercase tracking-[0.3em] text-slate-600 sm:inline">
            Updated continuously
          </span>
        </div>

        {content.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {content.map((entry) => (
              <Link
                key={entry.slug}
                href={`/content/${entry.slug}`}
                className="group relative flex h-full flex-col rounded-3xl border border-slate-800 bg-slate-900/40 p-6 transition hover:border-sky-400/60 hover:bg-slate-900/70"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent opacity-0 transition group-hover:opacity-100" />
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">Insight</span>
                <h3 className="mt-4 text-xl font-semibold text-slate-50">
                  {entry.title}
                </h3>
                {entry.excerpt && (
                  <p className="mt-3 text-sm text-slate-300">
                    {entry.excerpt}
                  </p>
                )}
                <span className="mt-6 inline-flex items-center text-sm font-semibold text-sky-300">
                  Read insight
                  <svg
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.333 8h9.334M8.667 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 p-10 text-slate-300">
            We&rsquo;re curating a library of high-leverage AI plays. Check back soon for our first drop.
          </div>
        )}
      </section>
    </main>
  );
}
