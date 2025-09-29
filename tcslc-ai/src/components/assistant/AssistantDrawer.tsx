"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Loader2, Send, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { AssistantChunk, ChatMessage, Citation, ToolCall, UserContext } from "../../lib/ai/types";
import { MessageStream } from "./MessageStream";
import { CitationsPanel } from "./CitationsPanel";

interface AssistantDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssistantDrawer({ open, onOpenChange }: AssistantDrawerProps) {
  const pathname = usePathname();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pendingMessage, setPendingMessage] = useState("");
  const [citations, setCitations] = useState<Citation[]>([]);
  const [toolCalls, setToolCalls] = useState<{ tool: ToolCall; result?: unknown }[]>([]);
  const [lowConfidence, setLowConfidence] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const contextRef = useRef<UserContext>({ route: pathname ?? undefined });

  useEffect(() => {
    contextRef.current = { ...contextRef.current, route: pathname ?? undefined };
  }, [pathname]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const input = (formData.get("message") as string)?.trim();

    if (!input) {
      return;
    }

    form.reset();
    setPendingMessage("");
    await sendMessage(input);
  };

  const sendMessage = async (content: string) => {
    const userMessage: ChatMessage = { role: "user", content };
    const history = [...messages, userMessage];
    setMessages(history);
    setCitations([]);
    setToolCalls([]);
    setLowConfidence(false);
    setError(null);
    setIsLoading(true);
    setPendingMessage("");

    const payload = {
      messages: history,
      context: contextRef.current,
    };

    try {
      const response = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok || !response.body) {
        throw new Error("Unable to reach the assistant.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assembled = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex = buffer.indexOf("\n");
        while (newlineIndex !== -1) {
          const line = buffer.slice(0, newlineIndex).trim();
          buffer = buffer.slice(newlineIndex + 1);
          if (line) {
            handleChunk(JSON.parse(line) as AssistantChunk);
          }
          newlineIndex = buffer.indexOf("\n");
        }
      }

      const remaining = buffer.trim();
      if (remaining.length > 0) {
        handleChunk(JSON.parse(remaining) as AssistantChunk);
      }

      if (assembled.trim().length > 0) {
        setMessages((prev) => [...prev, { role: "assistant", content: assembled.trim() }]);
      }

      setPendingMessage("");

      function handleChunk(chunk: AssistantChunk) {
        switch (chunk.type) {
          case "token":
            assembled += chunk.value;
            setPendingMessage(assembled);
            break;
          case "citations":
            setCitations(chunk.items);
            break;
          case "tool":
            setToolCalls((prev) => [...prev, { tool: chunk.tool, result: chunk.result }]);
            break;
          case "done":
            setLowConfidence(Boolean(chunk.lowConfidence));
            break;
          default:
            break;
        }
      }
    } catch (cause) {
      console.error(cause);
      setError(cause instanceof Error ? cause.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" aria-hidden onClick={handleClose} />
      <div className="relative ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-xl dark:bg-slate-950">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">TCSLC Assistant</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ask about programs, membership, or upcoming events.</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Close assistant"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <MessageStream
            messages={messages}
            pendingMessage={pendingMessage.trim().length > 0 ? pendingMessage : undefined}
            isLoading={isLoading}
            toolCalls={toolCalls}
            error={error}
          />
        </div>
        <div className="border-t border-slate-200 px-6 py-4 dark:border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              ref={textareaRef}
              name="message"
              required
              rows={3}
              placeholder="Ask me anything about TCSLC..."
              className="w-full resize-none rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  (event.currentTarget.form as HTMLFormElement | null)?.requestSubmit();
                }
              }}
            />
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Shift + Enter for a new line</span>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        <CitationsPanel citations={citations} lowConfidence={lowConfidence} />
      </div>
    </div>
  );
}
