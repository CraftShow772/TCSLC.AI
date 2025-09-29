"use client";

import { useEffect, useRef } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { ChatMessage, ToolCall } from "../../lib/ai/types";

interface MessageStreamProps {
  messages: ChatMessage[];
  pendingMessage?: string;
  isLoading: boolean;
  toolCalls: { tool: ToolCall; result?: unknown }[];
  error: string | null;
}

export function MessageStream({ messages, pendingMessage, isLoading, toolCalls, error }: MessageStreamProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    element.scrollTop = element.scrollHeight;
  }, [messages, pendingMessage, toolCalls]);

  return (
    <div ref={containerRef} className="flex h-full flex-col gap-4">
      {messages.map((message, index) => (
        <Bubble key={`${message.role}-${index}`} role={message.role} content={message.content} />
      ))}
      {pendingMessage && <Bubble role="assistant" content={pendingMessage} streaming />}
      {isLoading && !pendingMessage && (
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Thinking through the best answer…
        </div>
      )}
      {toolCalls.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-wide text-slate-400">Assistant tools</p>
          <div className="flex flex-col gap-2">
            {toolCalls.map((entry, index) => (
              <ToolCallCard key={index} tool={entry.tool} result={entry.result} />
            ))}
          </div>
        </div>
      )}
      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
          {error}
        </div>
      )}
    </div>
  );
}

interface BubbleProps {
  role: ChatMessage["role"];
  content: string;
  streaming?: boolean;
}

function Bubble({ role, content, streaming }: BubbleProps) {
  const isUser = role === "user";
  return (
    <div
      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition ${
        isUser
          ? "ml-auto bg-indigo-500 text-white"
          : "mr-auto bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
      } ${streaming ? "ring-2 ring-indigo-200" : ""}`}
    >
      {content}
      {streaming && <Cursor />}
    </div>
  );
}

function Cursor() {
  return <span className="ml-1 inline-block h-3 w-1 animate-pulse bg-indigo-500 align-middle"></span>;
}

interface ToolCallCardProps {
  tool: ToolCall;
  result?: unknown;
}

function ToolCallCard({ tool, result }: ToolCallCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
      <div className="mb-1 flex items-center gap-2 font-medium text-slate-800 dark:text-slate-100">
        <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
        {tool.name}
      </div>
      <pre className="whitespace-pre-wrap break-words text-[11px] text-slate-500 dark:text-slate-400">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}
