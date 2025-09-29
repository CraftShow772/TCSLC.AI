import { getCompiledContent, getContentSummaries } from "@/lib/content";
import { WhyPanel } from "@/components/compliance/why-panel";

export const metadata = {
  title: "Services | TCSLC.AI",
  description: "Comprehensive service catalog with renewal, transfer, and startup guidance.",
};

export default async function ServicesPage() {
  const summaries = await getContentSummaries("services");
  const entries = await Promise.all(
    summaries.map(async (summary) => ({ summary, content: await getCompiledContent("services", summary.slug) })),
  );

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold">Services</h1>
        <p className="text-muted-foreground">
          Explore licensing programs, renewal frequencies, and escalation paths. Each section is backed by MDX content and indexed for vector search in the assistant.
        </p>
        <WhyPanel context="Content synchronizes with the same corpus used by the assistant. Updates instantly improve answers." />
      </header>
      <div className="space-y-12">
        {entries.map(({ summary, content }) => (
          <article key={summary.slug} id={summary.slug} className="space-y-4 rounded-xl border bg-background p-6 shadow-sm">
            <div>
              <h2 className="text-2xl font-semibold">{summary.title}</h2>
              <p className="text-sm text-muted-foreground">{summary.summary}</p>
            </div>
            <div className="prose prose-slate max-w-none dark:prose-invert">{content.component}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
