import type { Metadata } from 'next';

import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Connect with the TC SLC AI design and engineering team.',
};

export default function ContactPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-4xl font-semibold text-foreground">Contact</h1>
        <p className="text-lg text-muted-foreground">
          Reach out to start a discovery conversation, request access to prototypes, or learn how
          AI copilots can enhance every TC SLC service touchpoint.
        </p>
        <form className="space-y-5 rounded-3xl border border-border/60 bg-background p-8 shadow-sm">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground" htmlFor="name">
              Name
            </label>
            <input
              className="h-11 rounded-lg border border-input bg-transparent px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              id="name"
              name="name"
              placeholder="Your full name"
              type="text"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground" htmlFor="email">
              Email
            </label>
            <input
              className="h-11 rounded-lg border border-input bg-transparent px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              id="email"
              name="email"
              placeholder="you@organization.com"
              type="email"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground" htmlFor="message">
              How can we help?
            </label>
            <textarea
              className="min-h-[140px] rounded-lg border border-input bg-transparent px-3 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              id="message"
              name="message"
              placeholder="Share your goals, challenges, or questions."
            />
          </div>
          <Button size="lg">Send message</Button>
        </form>
        <p className="text-sm text-muted-foreground">
          Looking for quick answers? Our AI concierge will soon provide instant guidance on
          enrollment, programs, transportation, and more.
        </p>
      </div>
    </div>
  );
}
