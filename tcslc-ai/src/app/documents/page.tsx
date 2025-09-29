import type { Metadata } from 'next';

import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Documents',
  description: 'Centralized document hub with AI-powered discovery for TC SLC.',
};

export default function DocumentsPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-4xl font-semibold text-foreground">Documents</h1>
        <p className="text-lg text-muted-foreground">
          We are preparing an intelligent repository that surfaces policies, forms, and classroom
          resources with natural language search, summarization, and personalized recommendations.
        </p>
        <div className="rounded-3xl border border-border/60 bg-secondary/40 p-8">
          <h2 className="text-xl font-semibold text-foreground">Upcoming features</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>Semantic search that understands your intent.</li>
            <li>Automated updates when documents change.</li>
            <li>Guided workflows to complete multi-step forms.</li>
          </ul>
          <Button className="mt-6" size="lg">
            Join early access
          </Button>
        </div>
      </div>
    </div>
  );
}
