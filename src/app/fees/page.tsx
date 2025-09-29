import { getCompiledContent, getContentSummaries } from "@/lib/content";
import { WhyPanel } from "@/components/compliance/why-panel";

export const metadata = {
  title: "Fee tables | TCSLC.AI",
  description: "Transparent fee tables for renewals, transfers, and new applications.",
};

export default async function FeesPage() {
  const summaries = await getContentSummaries("fees");
  const entries = await Promise.all(
    summaries.map(async (summary) => ({ summary, content: await getCompiledContent("fees", summary.slug) })),
  );

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold">Fee tables</h1>
        <p className="text-muted-foreground">
          MDX tables allow finance teams to embed updated costs. Values also fuel assistant responses and analytics dashboards.
        </p>
        <WhyPanel context="Fee data is part of the analytics pipeline, providing guardrails for payments and renewals." />
      </header>
      <div className="space-y-8">
        {entries.map(({ summary, content }) => (
          <section key={summary.slug} id={summary.slug} className="space-y-3 rounded-xl border bg-background p-6 shadow-sm">
            <header>
              <h2 className="text-2xl font-semibold">{summary.title}</h2>
              <p className="text-sm text-muted-foreground">{summary.summary}</p>
            </header>
            <div className="prose prose-slate max-w-none dark:prose-invert">{content.component}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
