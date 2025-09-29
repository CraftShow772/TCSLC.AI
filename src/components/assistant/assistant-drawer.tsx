"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { BotIcon, MessageCircleIcon, SendIcon, XIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { WhyPanel } from "@/components/compliance/why-panel";
import { useAnalytics } from "@/hooks/use-analytics";
import { matchIntent } from "@/lib/intents";
import { cn } from "@/lib/utils";

import type { AssistantMessage } from "./types";

interface StreamingChunk {
  type: "token" | "complete" | "error";
  value?: string;
  citations?: { id: string; title: string; slug: string; type: string; summary: string; score: number }[];
  message?: string;
}

export function AssistantDrawer() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { logEvent } = useAnalytics();

  useEffect(() => {
    if (!open) {
      return;
    }
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const lastUserMessage = useMemo(() => {
    const reversed = [...messages].reverse();
    return reversed.find((message) => message.role === "user")?.content ?? "";
  }, [messages]);

  const intentMatch = useMemo(() => {
    const source = input || lastUserMessage;
    if (!source) {
      return null;
    }
    return matchIntent(source);
  }, [input, lastUserMessage]);

  const handleStream = useCallback(async (response: Response, pendingId: string) => {
    if (!response.body) {
      throw new Error("Missing response body");
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let assistantText = "";
    let citations: AssistantMessage["citations"];

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      const chunk = decoder.decode(value, { stream: true });
      const events = chunk
        .split("\n\n")
        .map((line) => line.trim())
        .filter(Boolean);
      for (const event of events) {
        if (!event.startsWith("data:")) {
          continue;
        }
        const payload = JSON.parse(event.replace(/^data:\s*/, "")) as StreamingChunk;
        if (payload.type === "token" && payload.value) {
          assistantText += payload.value;
          setMessages((prev) =>
            prev.map((message) =>
              message.id === pendingId
                ? {
                    ...message,
                    content: assistantText,
                  }
                : message,
            ),
          );
        }
        if (payload.type === "complete") {
          citations = payload.citations;
          setMessages((prev) =>
            prev.map((message) =>
              message.id === pendingId
                ? {
                    ...message,
                    citations: payload.citations,
                  }
                : message,
            ),
          );
        }
        if (payload.type === "error" && payload.message) {
          throw new Error(payload.message);
        }
      }
    }

    setIsStreaming(false);
    setError(null);
    logEvent({
      category: "assistant",
      action: "response_streamed",
      metadata: {
        citations,
      },
    });
  }, [logEvent]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isStreaming) {
      return;
    }
    const userMessage: AssistantMessage = {
      id: nanoid(),
      role: "user",
      content: input.trim(),
    };
    const placeholder: AssistantMessage = {
      id: nanoid(),
      role: "assistant",
      content: "",
    };
    setMessages((prev) => [...prev, userMessage, placeholder]);
    setInput("");
    setIsStreaming(true);
    setError(null);

    logEvent({
      category: "assistant",
      action: "message_sent",
      metadata: { length: userMessage.content.length },
    });

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ message: "Unable to process request" }));
        throw new Error(payload.message ?? "Unable to process request");
      }

      await handleStream(response, placeholder.id);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unexpected error");
      setIsStreaming(false);
      setMessages((prev) => prev.filter((message) => message.id !== placeholder.id));
      logEvent({
        category: "assistant",
        action: "error",
        metadata: { message: String(err) },
      });
    }
  }, [handleStream, input, isStreaming, logEvent, messages]);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {open && (
          <Card className="flex h-[520px] w-full max-w-md flex-col p-0 shadow-xl">
            <header className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <BotIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold">TCSLC assistant</p>
                  <p className="text-xs text-muted-foreground">Grounded in agency policy and documents</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">
              {intentMatch && (
                <section className="space-y-3 rounded-md border bg-muted/30 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Suggested intent</p>
                      <p className="text-xs text-muted-foreground">{intentMatch.intent.description}</p>
                    </div>
                    <Badge variant="accent">{intentMatch.intent.label}</Badge>
                  </div>
                  <div className="grid gap-3">
                    {intentMatch.intent.actions.map((action) => (
                      <a
                        key={action.href}
                        href={action.href}
                        className="block rounded-md border border-dashed border-primary/50 p-3 text-sm transition hover:border-primary"
                      >
                        <p className="font-medium text-foreground">{action.label}</p>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </a>
                    ))}
                  </div>
                </section>
              )}
              <WhyPanel
                context="Recommendations are based on your latest messages and the closest matching knowledge base entries."
              />
              <ScrollArea ref={scrollRef} className="flex-1 space-y-4 rounded-md border bg-background p-4">
                {messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground">
                    <MessageCircleIcon className="h-6 w-6" aria-hidden="true" />
                    <p>Ask about renewals, tax payments, title transfers, or starting a new business.</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className="space-y-2">
                      <div
                        className={cn(
                          "flex items-center gap-2 text-xs uppercase tracking-wide",
                          message.role === "user" ? "text-primary" : "text-secondary",
                        )}
                      >
                        {message.role === "user" ? "You" : "Assistant"}
                      </div>
                      <div className="rounded-md border bg-muted/30 p-3 text-sm leading-relaxed text-muted-foreground">
                        {message.content || (isStreaming && message.role === "assistant" ? "Typing…" : "")}
                      </div>
                      {message.citations && message.citations.length > 0 && (
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <Separator className="my-2" />
                          <p className="font-semibold text-foreground">Citations</p>
                          <ul className="space-y-1">
                            {message.citations.map((citation) => (
                              <li key={citation.id}>
                                <a href={`/${citation.type}#${citation.slug}`} className="text-primary hover:underline">
                                  {citation.title}
                                </a>{" "}
                                <span className="text-muted-foreground">(relevance {(citation.score * 100).toFixed(0)}%)</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </ScrollArea>
              {error && <p className="text-xs text-destructive">{error}</p>}
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void sendMessage();
                }}
                className="space-y-3"
              >
                <Textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask a question about renewals, payments, or documents"
                  rows={3}
                  disabled={isStreaming}
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Conversations are logged for quality and compliance.</span>
                  <Button type="submit" size="sm" disabled={isStreaming || input.trim().length === 0}>
                    <SendIcon className="mr-2 h-4 w-4" />
                    Send
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        )}
        <Button size="lg" className="shadow-lg" onClick={() => setOpen((prev) => !prev)}>
          <BotIcon className="mr-2 h-5 w-5" />
          {open ? "Close assistant" : "Ask the assistant"}
        </Button>
      </div>
    </>
  );
}
