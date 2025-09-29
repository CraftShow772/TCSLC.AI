import { getCompiledContent, getContentSummaries } from "@/lib/content";
import { WhyPanel } from "@/components/compliance/why-panel";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "FAQs | TCSLC.AI",
  description: "Answers to common licensing questions with citations to agency policy.",
};

export default async function FaqsPage() {
  const summaries = await getContentSummaries("faqs");
  const entries = await Promise.all(
    summaries.map(async (summary) => ({ summary, content: await getCompiledContent("faqs", summary.slug) })),
  );

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold">Frequently asked questions</h1>
        <p className="text-muted-foreground">
          These MDX-backed responses match the assistant’s citations so you can trace every answer.
        </p>
        <WhyPanel context="FAQs continuously feed the assistant grounding index. Updates here improve conversational responses." />
      </header>
      <div className="space-y-6">
        {entries.map(({ summary, content }) => (
          <Card key={summary.slug} id={summary.slug} className="space-y-3 p-6">
            <h2 className="text-xl font-semibold text-foreground">{summary.title}</h2>
            <div className="prose prose-slate max-w-none text-sm text-muted-foreground dark:prose-invert">
              {content.component}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
