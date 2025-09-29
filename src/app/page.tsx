import Link from "next/link";
import { ArrowRight, Compass, ShieldCheck, Workflow } from "lucide-react";
import { allPrompts } from "contentlayer/generated";
import { AssistantPanel } from "@/components/assistant/assistant-panel";
import { AssistantProvider } from "@/components/assistant/assistant-provider";
import { SmartChecklist } from "@/components/checklists/smart-checklist";
import { MDXContent } from "@/components/mdx/mdx-content";
import { PortalGrid } from "@/components/portals/portal-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { checklists } from "@/data/checklists";
import { portals } from "@/data/portals";
import { buildPrivacySnapshot, generatePrivacyNarrative } from "@/modules/compliance/privacy";
import { GOVERNANCE_CONTROLS, summarizeGovernanceStatus } from "@/modules/compliance/governance";

const promptCards = [...allPrompts].sort((a, b) => a.order - b.order);
const primaryChecklist = checklists[0];

export default function Home() {
  const snapshot = buildPrivacySnapshot();
  const governanceSummary = summarizeGovernanceStatus(GOVERNANCE_CONTROLS);
  const checklistContext = {
    compliance: snapshot,
    activeIntent: "assistant",
    analyticsReady: true,
  } as const;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-12 sm:px-6">
      <section id="overview" className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Badge className="bg-primary/20 text-primary">TCSLC.AI</Badge>
          <h1 className="text-balance text-5xl font-semibold tracking-tight sm:text-6xl">
            AI-native delivery with compliance built in
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Meet the redesigned tcslc.com: a conversational experience that turns prompts into orchestrated workflows, embeds secure portals, and keeps compliance teams aligned with every click.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="gap-2">
              <Link href="#assistant">
                Launch assistant <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/locations">Explore locations</Link>
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="p-4">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Compliance score</CardTitle>
              <p className="text-2xl font-semibold text-foreground">{(snapshot.score * 100).toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">Updated {new Date(snapshot.updatedAt).toLocaleDateString()}</p>
            </Card>
            <Card className="p-4">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Governance controls</CardTitle>
              <p className="text-2xl font-semibold text-foreground">{GOVERNANCE_CONTROLS.length}</p>
              <p className="text-xs text-muted-foreground">{governanceSummary}</p>
            </Card>
            <Card className="p-4">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Portals secured</CardTitle>
              <p className="text-2xl font-semibold text-foreground">{portals.length}</p>
              <p className="text-xs text-muted-foreground">Wrapped with analytics-aware launchers.</p>
            </Card>
          </div>
        </div>
        <Card className="space-y-5">
          <CardHeader className="space-y-3 pb-0">
            <CardTitle className="text-xl">Prompts 1–10 at a glance</CardTitle>
            <CardDescription>
              Documentation compiled in MDX powers the assistant and content surfaces. Each entry below is rendered live from the content layer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div id="prompts" className="space-y-4">
              {promptCards.map((prompt) => (
                <article key={prompt.slug} className="rounded-2xl border border-border/60 bg-background/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-foreground">{prompt.title}</h3>
                    <Badge className="bg-secondary/20 text-secondary">{prompt.category}</Badge>
                  </div>
                  <Separator className="my-3" />
                  <MDXContent code={prompt.body.code} />
                </article>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <AssistantProvider>
        <AssistantPanel />
      </AssistantProvider>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <SmartChecklist checklist={primaryChecklist} context={checklistContext} />
        <Card id="compliance" className="space-y-4">
          <CardHeader className="space-y-3 pb-0">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <ShieldCheck className="h-4 w-4" /> Compliance briefing
            </div>
            <CardTitle>Privacy & governance snapshot</CardTitle>
            <CardDescription>{generatePrivacyNarrative(snapshot)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Mitigations in motion:</p>
            <ul className="space-y-2">
              {snapshot.mitigations.map((mitigation) => (
                <li key={mitigation.id} className="rounded-xl border border-border/40 bg-background/50 px-4 py-3">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
                    <span>{mitigation.owner}</span>
                    <span>{mitigation.status}</span>
                  </div>
                  <p className="mt-1 text-sm text-foreground">{mitigation.title}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <Badge className="bg-secondary/20 text-secondary">Integrations</Badge>
            <h2 className="text-3xl font-semibold">Secure portals, ready to launch</h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Wrap third-party experiences in hardened frames with analytics coverage and guardrails for every external workflow.
            </p>
          </div>
          <Button asChild variant="ghost" className="gap-2">
            <Link href="#assistant">
              Ask assistant which portal to open <Compass className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <PortalGrid portals={portals} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-3">
          <CardHeader className="space-y-2 pb-0">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Workflow className="h-4 w-4" /> Smart analytics
            </div>
            <CardTitle>Analytics hooks without the sprawl</CardTitle>
            <CardDescription>
              Lightweight hooks capture user intent, checklist progress, and portal launches—instrumented without sending PII.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Events automatically flush before the page hides and during navigation, ensuring observability is lossless.</p>
            <p>
              Use the <code className="rounded bg-background/80 px-2 py-1">useAnalytics</code> hook to track key milestones with a single line of code.
            </p>
          </CardContent>
        </Card>
        <Card className="space-y-3">
          <CardHeader className="space-y-2 pb-0">
            <CardTitle>Production hardening baked in</CardTitle>
            <CardDescription>
              Security headers, typed routes, and console hygiene are configured via Next.js to keep the surface ready for launch.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Content Security Policy locks down script, image, and frame origins.</p>
            <p>Cross-origin policies and permissions guards are enforced globally to protect embedded portals.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
