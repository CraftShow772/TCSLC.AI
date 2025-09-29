import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-xs font-medium text-primary",
        className
      )}
      {...props}
    />
  );
}
