import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Separator({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("h-px w-full bg-border/70", className)}
      role="separator"
      {...props}
    />
  );
}
