import { getCompiledContent, getContentSummaries } from "@/lib/content";
import { DocumentHelper } from "@/components/portals/document-helper";
import { WhyPanel } from "@/components/compliance/why-panel";

export const metadata = {
  title: "Documents | TCSLC.AI",
  description: "Document preparation guidance with extraction stubs for renewals, transfers, and new businesses.",
};

export default async function DocumentsPage() {
  const summaries = await getContentSummaries("documents");
  const entries = await Promise.all(
    summaries.map(async (summary) => ({ summary, content: await getCompiledContent("documents", summary.slug) })),
  );

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold">Document library</h1>
        <p className="text-muted-foreground">
          Upload checklists and reference documents, then reference MDX content for submission requirements.
        </p>
        <WhyPanel context="Document guidance mirrors what the assistant cites, ensuring one source of truth." />
      </header>
      <DocumentHelper />
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
