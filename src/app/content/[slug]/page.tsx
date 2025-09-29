import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentBySlug, getContentList } from "@/lib/content";

type ContentPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const content = await getContentList();

  return content.map(({ slug }) => ({ slug }));
}

export async function generateMetadata(
  props: ContentPageProps
): Promise<Metadata> {
  const { slug } = await props.params;
  const entry = await getContentBySlug(slug).catch(() => null);

  if (!entry) {
    return {
      title: "Insight not found — TCSLC.AI",
    };
  }

  return {
    title: `${entry.meta.title} — TCSLC.AI`,
    description: entry.meta.excerpt,
  };
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { slug } = await params;
  const entry = await getContentBySlug(slug).catch(() => null);

  if (!entry) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-24 sm:px-8">
      <div className="mb-10 flex items-center justify-between gap-4 text-sm text-slate-400">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-semibold text-sky-300 transition hover:text-sky-200"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.667 8H3.333M7.333 12l-4-4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          All insights
        </Link>
        <span className="uppercase tracking-[0.3em] text-slate-500">Insight</span>
      </div>

      <article className="space-y-8">
        <header className="space-y-4">
          <h1 className="text-4xl font-semibold text-slate-50">
            {entry.meta.title}
          </h1>
          {entry.meta.excerpt && (
            <p className="text-lg text-slate-300">{entry.meta.excerpt}</p>
          )}
        </header>
        <div className="space-y-6 text-base leading-relaxed text-slate-200 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-8 [&_h3]:text-xl [&_a]:text-sky-300 [&_a:hover]:text-sky-200 [&_strong]:text-slate-50">
          {entry.content}
        </div>
      </article>
    </main>
  );
}
