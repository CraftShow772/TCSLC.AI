"use client";

import { Fragment } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { AssistantMessage } from "./assistant-provider";

interface MessageListProps {
  messages: AssistantMessage[];
}

const roleConfig: Record<AssistantMessage["role"], { label: string }> = {
  system: { label: "System" },
  user: { label: "You" },
  assistant: { label: "Assistant" },
};

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((message, index) => {
        const config = roleConfig[message.role];
        const isAssistant = message.role === "assistant";
        const alignment = isAssistant ? "items-start" : "items-end";
        const bubble = isAssistant
          ? "bg-primary/10 text-primary border border-primary/40"
          : message.role === "system"
            ? "bg-muted/40 text-muted-foreground border border-border/60"
            : "bg-accent/10 text-accent border border-accent/40";

        return (
          <Fragment key={message.id}>
            {index > 0 && <Separator className="border-border/20" />}
            <div className={cn("flex flex-col gap-2", alignment)}>
              <Badge className="bg-transparent px-0 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {config.label}
              </Badge>
              <div className={cn("max-w-[32rem] rounded-xl px-4 py-3 text-sm leading-relaxed", bubble)}>
                {message.content}
              </div>
              {message.intent && message.role !== "system" && (
                <p className="text-xs text-muted-foreground">
                  Intent: <span className="font-medium text-foreground">{message.intent.id}</span>
                  {message.intent.confidence > 0 && (
                    <span className="ml-1 text-muted-foreground/70">
                      ({Math.round(message.intent.confidence * 100)}% confidence)
                    </span>
                  )}
                </p>
              )}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
