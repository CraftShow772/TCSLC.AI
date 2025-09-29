import { InfoIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface WhyPanelProps {
  context: string;
  className?: string;
}

export function WhyPanel({ context, className }: WhyPanelProps) {
  return (
    <div className={cn("flex items-start gap-3 rounded-md border border-info/40 bg-info/10 p-4", className)}>
      <InfoIcon className="mt-0.5 h-5 w-5 text-info" aria-hidden="true" />
      <div>
        <p className="font-medium text-foreground">Why you&apos;re seeing this</p>
        <p className="mt-1 text-sm text-muted-foreground">{context}</p>
      </div>
    </div>
  );
}
