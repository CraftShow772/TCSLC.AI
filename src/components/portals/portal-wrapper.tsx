"use client";

import { useState } from "react";
import { ExternalLinkIcon, ShieldQuestionIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WhyPanel } from "@/components/compliance/why-panel";
import { useAnalytics } from "@/hooks/use-analytics";
import type { PortalDefinition } from "@/data/portals";

interface PortalWrapperProps {
  portal: PortalDefinition;
}

export function PortalWrapper({ portal }: PortalWrapperProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  const { logEvent } = useAnalytics();

  const handleRedirect = () => {
    logEvent({
      category: portal.analyticsCategory,
      action: "redirect",
      metadata: { acknowledged },
    });
    window.open(portal.url, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-start gap-3">
        <ShieldQuestionIcon className="mt-0.5 h-5 w-5 text-secondary" aria-hidden="true" />
        <div>
          <h2 className="text-xl font-semibold">{portal.name}</h2>
          <p className="text-sm text-muted-foreground">{portal.description}</p>
        </div>
      </div>
      <WhyPanel
        context="You are being redirected to a trusted external system. We surface prerequisites to help you avoid unnecessary delays."
      />
      <section>
        <h3 className="text-sm font-semibold">Requirements before continuing</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {portal.requirements.map((requirement) => (
            <li key={requirement}>{requirement}</li>
          ))}
        </ul>
      </section>
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={acknowledged}
          onChange={(event) => setAcknowledged(event.target.checked)}
        />
        I confirm I have the required information ready.
      </label>
      <Button onClick={handleRedirect} disabled={!acknowledged}>
        Continue to portal
        <ExternalLinkIcon className="ml-2 h-4 w-4" />
      </Button>
    </Card>
  );
}
