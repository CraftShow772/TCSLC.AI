import type { Metadata } from 'next';

import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Services',
  description: 'AI-native services and strategy engagements for TC SLC.',
};

export default function ServicesPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-4xl font-semibold text-foreground">Services</h1>
        <p className="text-lg text-muted-foreground">
          Our team is building a blueprint for AI-enabled operations, from automated student
          support to data-rich decision making. Explore how these services align with district
          goals and community outcomes.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {['AI Copilot Strategy', 'Data Integration', 'Digital Experience Design', 'Staff Enablement'].map((service) => (
            <div key={service} className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground">{service}</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                We pair deep research with rapid prototyping to bring each initiative to life.
              </p>
            </div>
          ))}
        </div>
        <Button size="lg">Request a discovery call</Button>
      </div>
    </div>
  );
}
