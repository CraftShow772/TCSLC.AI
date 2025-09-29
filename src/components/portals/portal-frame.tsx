"use client";

import { ExternalLink, Shield, SignalHigh } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { PortalDefinition } from "@/data/portals";

interface PortalFrameProps {
  portal: PortalDefinition;
}

function statusVariant(status: PortalDefinition["status"]) {
  switch (status) {
    case "operational":
      return { label: "Operational", className: "bg-accent/20 text-accent" };
    case "degraded":
      return { label: "Degraded", className: "bg-secondary/20 text-secondary" };
    case "maintenance":
      return { label: "Maintenance", className: "bg-muted/40 text-muted-foreground" };
    default:
      return { label: status, className: "bg-muted/40 text-muted-foreground" };
  }
}

export function PortalFrame({ portal }: PortalFrameProps) {
  const analytics = useAnalytics();
  const status = statusVariant(portal.status);

  const handleLaunch = () => {
    analytics.track("portal_launch", {
      portal: portal.id,
      status: portal.status,
      embed: portal.embed,
    });
    window.open(portal.url, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="flex flex-col gap-4" id={`portal-${portal.id}`}>
      <CardHeader className="space-y-3 pb-0">
        <div className="flex items-center justify-between">
          <Badge className={status.className}>{status.label}</Badge>
          <span className="text-xs text-muted-foreground">{portal.latency} latency</span>
        </div>
        <CardTitle>{portal.name}</CardTitle>
        <CardDescription>{portal.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground/80">
          <Shield className="h-4 w-4" />
          Owned by {portal.owner}
        </div>
        <Separator />
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Capabilities</h4>
          <ul className="flex flex-wrap gap-2">
            {portal.capabilities.map((item) => (
              <li
                key={item}
                className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <Separator />
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <SignalHigh className="h-4 w-4" />
            {portal.embed ? "Embeddable" : "Opens in new tab"}
          </div>
          <Button onClick={handleLaunch} className="gap-2">
            <ExternalLink className="h-4 w-4" /> Launch portal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
