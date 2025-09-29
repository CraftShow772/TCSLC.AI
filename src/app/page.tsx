import Link from "next/link";
import { ArrowRightIcon, FileTextIcon, MapPinIcon, ShieldIcon } from "lucide-react";

import { RenewalChecklist } from "@/components/checklists/renewal-checklist";
import { TransferChecklist } from "@/components/checklists/transfer-checklist";
import { NewBusinessChecklist } from "@/components/checklists/new-business-checklist";
import { AuditLogBanner } from "@/components/compliance/audit-log-banner";
import { AccessibilityPlaceholder } from "@/components/compliance/accessibility-placeholder";
import { PrivacyPlaceholder } from "@/components/compliance/privacy-placeholder";
import { DocumentHelper } from "@/components/portals/document-helper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const quickActions = [
  {
    title: "Renew a license",
    description: "Step-by-step guidance grounded in current rulemaking.",
    href: "/services#renewals",
  },
  {
    title: "Transfer ownership",
    description: "Understand tax clearance, zoning, and fingerprint requirements.",
    href: "/documents?focus=transfer",
  },
  {
    title: "Launch a new business",
    description: "Preview timelines and smart checklists for startups.",
    href: "/fees",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary/20 px-3 py-1 text-xs font-medium text-secondary-foreground">
            <ShieldIcon className="h-4 w-4" />
            Official redesign preview
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            TCSLC.AI brings guidance, checklists, and compliance to every licensing task
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            A human-centered assistant that grounds every answer in Tallahassee Community Services Licensing Commission policy. Jump into renewals, transfers, or new business launches with confidence.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/services">
                Explore services
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/faqs">Read FAQs</Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {quickActions.map((action) => (
              <Card key={action.title} className="space-y-2 border-dashed border-primary/40 bg-muted/20 p-5">
                <h3 className="text-base font-semibold text-foreground">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
                <Link href={action.href} className="inline-flex items-center text-sm text-primary hover:underline">
                  Continue
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </Card>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <DocumentHelper />
          <AuditLogBanner />
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <RenewalChecklist />
        <TransferChecklist />
      </section>

      <section className="grid gap-8 md:grid-cols-[1.5fr,1fr]">
        <NewBusinessChecklist />
        <div className="space-y-6">
          <PrivacyPlaceholder />
          <AccessibilityPlaceholder />
        </div>
      </section>

      <section className="grid gap-6 rounded-xl border bg-background p-8 shadow-sm md:grid-cols-3">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Plan your visit</h2>
          <p className="text-sm text-muted-foreground">
            Offices across Leon County and statewide partners accept applications and fees. View live wait times soon.
          </p>
          <Button variant="outline" asChild>
            <Link href="/locations">
              <MapPinIcon className="mr-2 h-4 w-4" />
              Locations
            </Link>
          </Button>
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-semibold">Documents library</h3>
          <p className="text-sm text-muted-foreground">
            Access MDX-powered references for services, FAQs, and checklists with vector search backing every answer.
          </p>
          <Link href="/documents" className="inline-flex items-center text-sm text-primary hover:underline">
            <FileTextIcon className="mr-1 h-4 w-4" />
            Browse documents
          </Link>
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-semibold">Fee tables</h3>
          <p className="text-sm text-muted-foreground">
            Transparent fee information with MDX tables ensures you budget for renewals, transfers, and new filings.
          </p>
          <Link href="/fees" className="inline-flex items-center text-sm text-primary hover:underline">
            View fees
          </Link>
        </div>
      </section>
    </div>
  );
}
