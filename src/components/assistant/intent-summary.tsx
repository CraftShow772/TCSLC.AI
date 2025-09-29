"use client";

import { motion } from "framer-motion";
import { Lightbulb, Link2, Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { IntentMatch } from "@/lib/intent-router";

interface IntentSummaryProps {
  intent?: IntentMatch;
}

export function IntentSummary({ intent }: IntentSummaryProps) {
  if (!intent) {
    return (
      <div className="rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-sm text-muted-foreground">
        The assistant will infer your intent as you chat. Ask about portals, compliance readiness, or studio locations to see routing in action.
      </div>
    );
  }

  return (
    <motion.div
      key={intent.id}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-3 rounded-xl border border-primary/40 bg-primary/5 p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Route className="h-4 w-4" />
          {intent.title}
        </div>
        <Badge className="bg-primary/20 text-primary">{(intent.confidence * 100).toFixed(0)}% confidence</Badge>
      </div>
      <p className="text-sm text-muted-foreground">{intent.summary}</p>
      {intent.recommendedActions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground/80">
          <Lightbulb className="h-4 w-4" />
          <span className="font-semibold uppercase tracking-[0.2em] text-muted-foreground">Next steps</span>
          {intent.recommendedActions.map((action) => (
            <span key={action} className="rounded-full bg-primary/10 px-3 py-1 text-primary">
              {action}
            </span>
          ))}
        </div>
      )}
      {intent.promptSlug && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
          <Link2 className="h-4 w-4" />
          Grounded in prompt <span className="font-medium text-foreground">{intent.promptSlug}</span>
        </div>
      )}
    </motion.div>
  );
}
