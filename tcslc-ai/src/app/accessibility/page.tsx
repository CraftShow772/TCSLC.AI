import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accessibility',
  description: 'Ensuring inclusive, accessible AI experiences for every TC SLC visitor.',
};

export default function AccessibilityPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-4xl font-semibold text-foreground">Accessibility</h1>
        <p className="text-lg text-muted-foreground">
          Accessibility is a core design principle. We prototype with screen reader support,
          keyboard navigation, color contrast tooling, and adaptable UI elements.
        </p>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            We are testing AI-driven personalization to suggest accessible layouts, content pacing,
            and language translations. As we iterate, we welcome feedback to ensure every visitor can
            engage fully.
          </p>
          <p>
            For immediate assistance, contact our team and we will prioritize accommodations in the
            upcoming releases.
          </p>
        </div>
      </div>
    </div>
  );
}
