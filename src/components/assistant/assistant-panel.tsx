"use client";

import { FormEvent, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useAssistant } from "./assistant-provider";
import { IntentSummary } from "./intent-summary";
import { MessageList } from "./message-list";

export function AssistantPanel() {
  const { state, sendMessage } = useAssistant();
  const [value, setValue] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(value);
    setValue("");
  };

  return (
    <Card id="assistant" className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        <CardHeader className="space-y-3 pb-0">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Conversational assistant
          </div>
          <CardTitle className="text-balance">Orchestrate AI-native workflows with routed context</CardTitle>
          <CardDescription>
            Every message is scored, grounded in MDX documentation, and logged through privacy-safe analytics.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ScrollArea className="h-[320px] rounded-2xl border border-border/50 bg-black/20 p-4">
            <MessageList messages={state.messages} />
          </ScrollArea>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Ask about compliance, launch checklists, or request a portal link."
            />
            <div className="flex items-center justify-end">
              <Button type="submit" disabled={!value.trim()} className="gap-2">
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
          </form>
        </CardContent>
      </div>
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Intent router</h3>
        <IntentSummary intent={state.activeIntent} />
      </div>
    </Card>
  );
}
