"use client";

import { CheckCircle2, Circle, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { ChecklistDefinition, ChecklistRuntimeContext } from "@/data/checklists";
import { useChecklist } from "./use-checklist";

interface SmartChecklistProps {
  checklist: ChecklistDefinition;
  context: ChecklistRuntimeContext;
}

export function SmartChecklist({ checklist, context }: SmartChecklistProps) {
  const analytics = useAnalytics();
  const { items, progress, toggle } = useChecklist(checklist, context);

  const handleToggle = (id: string) => {
    toggle(id);
    analytics.track("checklist_toggle", { checklist: checklist.id, item: id });
  };

  return (
    <Card id="checklists" className="space-y-4">
      <CardHeader className="space-y-3 pb-0">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <Gauge className="h-4 w-4" /> Smart checklist
        </div>
        <CardTitle>{checklist.title}</CardTitle>
        <CardDescription>{checklist.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-sm">
          <span>{progress.completed} of {progress.total} complete</span>
          <span className="font-semibold text-primary">{progress.percentage}%</span>
        </div>
        <ol className="space-y-3">
          {items.map((item) => {
            const Icon = item.status === "complete" ? CheckCircle2 : Circle;
            const isBlocked = item.dependencies.some((dependency) => {
              const dependencyItem = items.find((candidate) => candidate.id === dependency);
              return dependencyItem && dependencyItem.status !== "complete";
            });

            return (
              <li key={item.id} className="rounded-xl border border-border/50 bg-background/50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Icon className={`h-5 w-5 ${item.status === "complete" ? "text-accent" : "text-muted-foreground"}`} />
                      {item.title}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    {item.dependencies.length > 0 && (
                      <p className="text-xs text-muted-foreground/70">
                        Depends on: {item.dependencies.join(", ")}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={isBlocked}
                    onClick={() => handleToggle(item.id)}
                  >
                    {item.status === "complete" ? "Undo" : "Mark done"}
                  </Button>
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
