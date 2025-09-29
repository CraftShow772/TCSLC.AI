"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";
import { allPrompts } from "contentlayer/generated";
import { useAnalytics } from "@/hooks/useAnalytics";
import { resolveIntent, type IntentMatch } from "@/lib/intent-router";

export type AssistantRole = "user" | "assistant" | "system";

export interface AssistantMessage {
  id: string;
  role: AssistantRole;
  content: string;
  intent?: IntentMatch;
}

interface AssistantState {
  messages: AssistantMessage[];
  activeIntent?: IntentMatch;
}

type AssistantAction =
  | { type: "append"; message: AssistantMessage }
  | { type: "intent"; intent: IntentMatch };

const AssistantContext = createContext<{
  state: AssistantState;
  sendMessage: (content: string) => void;
} | null>(null);

const initialMessages: AssistantMessage[] = [
  {
    id: "system-intro",
    role: "system",
    content:
      "You're exploring TCSLC.AI—ask about portals, compliance, analytics, or launch a checklist to see how the assistant guides delivery.",
  },
];

function assistantReducer(state: AssistantState, action: AssistantAction): AssistantState {
  switch (action.type) {
    case "append":
      return {
        ...state,
        messages: [...state.messages, action.message],
      };
    case "intent":
      return {
        ...state,
        activeIntent: action.intent,
      };
    default:
      return state;
  }
}

function generateAssistantResponse(intent: IntentMatch, userContent: string) {
  const prompt = intent.promptSlug
    ? allPrompts.find((item) => item.slug === intent.promptSlug)
    : null;

  const promptLine = prompt
    ? `I can ground this in our “${prompt.title}” blueprint: ${prompt.summary}`
    : "Let's use our project blueprints to keep you on track.";

  const actionLine = intent.recommendedActions.length
    ? `Recommended next steps: ${intent.recommendedActions.join(", ")}.`
    : "Let me know how you'd like to proceed.";

  return `Noted: “${userContent}”. ${promptLine} ${actionLine}`;
}

function createMessage(role: AssistantRole, content: string, intent?: IntentMatch): AssistantMessage {
  return {
    id: `${role}-${Math.random().toString(36).slice(2, 10)}`,
    role,
    content,
    intent,
  };
}

export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const analytics = useAnalytics();
  const [state, dispatch] = useReducer(assistantReducer, {
    messages: initialMessages,
  });

  const sendMessage = useCallback(
    (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) {
        return;
      }

      const intent = resolveIntent(trimmed);
      dispatch({ type: "append", message: createMessage("user", trimmed, intent) });
      dispatch({ type: "intent", intent });
      analytics.track("assistant_message", { role: "user", intent: intent.id });

      const assistantReply = generateAssistantResponse(intent, trimmed);
      dispatch({ type: "append", message: createMessage("assistant", assistantReply, intent) });
      analytics.track("assistant_message", { role: "assistant", intent: intent.id, confidence: intent.confidence });
    },
    [analytics]
  );

  const value = useMemo(
    () => ({
      state,
      sendMessage,
    }),
    [state, sendMessage]
  );

  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>;
}

export function useAssistant() {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error("useAssistant must be used within an AssistantProvider");
  }

  return context;
}
