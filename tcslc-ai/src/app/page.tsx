import type { Route } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const featureCards = [
  {
    title: 'AI strategy workshops',
    description:
      'Co-create the future of career education with guided sessions that align staff around measurable AI outcomes.',
    href: '/services',
  },
  {
    title: 'Integrated campus data',
    description:
      'Connect attendance, program success, and transportation data with privacy-first intelligence layers.',
    href: '/locations',
  },
  {
    title: 'Continuous iteration',
    description:
      'Our design sprints and usability loops ensure the TC SLC digital ecosystem keeps evolving.',
    href: '/contact',
  },
] satisfies { title: string; description: string; href: Route }[];

export default function HomePage() {
  return (
    <div className="py-16">
      <section className="container grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full border border-border/60 bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            AI-native transformation
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Reimagining Trumbull Career & Technical Center for an AI-powered future.
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            We are crafting a responsive, intelligent experience that brings families, students,
            and partners together with real-time insights, smart navigation, and actionable
            resources.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/contact">Talk with our team</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/documents">Preview documents</Link>
            </Button>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-background p-8 shadow-xl shadow-primary/5">
          <div className="absolute -left-20 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-16 -bottom-24 h-60 w-60 rounded-full bg-secondary/50 blur-3xl" />
          <div className="relative space-y-6">
            <h2 className="text-lg font-semibold text-foreground">AI Experience Blueprint</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              We are designing modular service pages, intelligent document search, and adaptive
              accessibility controls. Every interaction is guided by a cohesive, data-informed
              design system.
            </p>
            <ul className="grid gap-4 text-sm text-muted-foreground">
              <li className="rounded-xl border border-border/60 bg-secondary/40 p-4">
                <p className="font-medium text-foreground">Conversational support</p>
                <p>AI copilots assist with enrollment, scheduling, and program discovery.</p>
              </li>
              <li className="rounded-xl border border-border/60 bg-secondary/40 p-4">
                <p className="font-medium text-foreground">Unified design tokens</p>
                <p>Consistent visuals across marketing, portals, and internal tools.</p>
              </li>
              <li className="rounded-xl border border-border/60 bg-secondary/40 p-4">
                <p className="font-medium text-foreground">Accessibility-first</p>
                <p>Dynamic contrast, scalable typography, and inclusive interaction states.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="container mt-24 grid gap-10 md:grid-cols-3">
        {featureCards.map((card) => (
          <Link
            key={card.title}
            className="group relative overflow-hidden rounded-3xl border border-border/60 bg-background p-6 transition hover:border-primary/60 hover:shadow-lg"
            href={card.href}
          >
            <div className="absolute -right-8 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-primary/10 transition group-hover:scale-110" />
            <div className="relative space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                {card.title}
              </p>
              <p className="text-sm text-muted-foreground">{card.description}</p>
              <span className="inline-flex items-center text-sm font-medium text-foreground">
                Discover more
              </span>
            </div>
          </Link>
        ))}
      </section>
      <section className="container mt-24 flex flex-col gap-6 rounded-3xl border border-border/60 bg-secondary/40 p-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-muted-foreground">
          BUILDING IN PUBLIC
        </p>
        <h2 className="text-3xl font-semibold text-foreground md:text-4xl">
          Follow our sprint notes and design drops.
        </h2>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground">
          This space will evolve with interactive prototypes, AI copilots, and district-ready
          workflows. Subscribe to stay in the loop as we co-create the TC SLC experience.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg">Subscribe for updates</Button>
          <Button size="lg" variant="outline">
            Join beta testing
          </Button>
        </div>
      </section>
    </div>
  );
}
