import { allPrompts } from "contentlayer/generated";
import { z } from "zod";

export const intentIds = z.enum([
  "assistant",
  "portal",
  "compliance",
  "analytics",
  "locations",
  "checklist",
  "content",
  "governance",
  "delivery",
  "insights",
]);

export type IntentId = z.infer<typeof intentIds>;

export interface IntentMatch {
  id: IntentId;
  title: string;
  summary: string;
  confidence: number;
  recommendedActions: string[];
  promptSlug?: string;
}

type IntentConfig = {
  id: IntentId;
  title: string;
  keywords: string[];
  summary: string;
  recommendedActions: string[];
};

const INTENT_CONFIG: IntentConfig[] = [
  {
    id: "assistant",
    title: "Assistant guidance",
    keywords: ["assistant", "chat", "conversation", "help", "ai"],
    summary: "Route the user into the conversational assistant with relevant context chips.",
    recommendedActions: ["Open the assistant panel", "Surface the latest MDX prompt"],
  },
  {
    id: "portal",
    title: "Portal integration",
    keywords: ["portal", "iframe", "external", "vendor", "integration"],
    summary: "Launch an embedded or linked external portal with hardened wrappers.",
    recommendedActions: ["Show the portal launcher", "Display latency and SLA badges"],
  },
  {
    id: "compliance",
    title: "Compliance automation",
    keywords: ["compliance", "privacy", "risk", "audit", "governance"],
    summary: "Highlight privacy modules, risk matrices, and mitigation plans.",
    recommendedActions: ["Generate a compliance brief", "Link to smart checklists"],
  },
  {
    id: "analytics",
    title: "Analytics instrumentation",
    keywords: ["analytics", "metrics", "events", "tracking", "data"],
    summary: "Provide analytics hooks, readiness status, and observability dashboards.",
    recommendedActions: ["Emit analytics events", "Expose readiness checklist"],
  },
  {
    id: "locations",
    title: "Location intelligence",
    keywords: ["location", "studio", "timezone", "address", "map"],
    summary: "Share relevant studio locations, availability, and scheduling hooks.",
    recommendedActions: ["Surface nearby studio", "Offer booking CTA"],
  },
  {
    id: "checklist",
    title: "Operational checklist",
    keywords: ["checklist", "task", "workflow", "playbook", "launch"],
    summary: "Summon smart checklists tailored to the current workflow.",
    recommendedActions: ["Render the smart checklist", "Auto-complete dependent steps"],
  },
  {
    id: "content",
    title: "Content documentation",
    keywords: ["documentation", "prompt", "mdx", "guide", "playbook"],
    summary: "Serve MDX-driven knowledge or prompt documentation to the user.",
    recommendedActions: ["Link to prompt documentation", "Embed MDX excerpt"],
  },
  {
    id: "governance",
    title: "Governance insights",
    keywords: ["policy", "guardrail", "governance", "control", "policy"],
    summary: "Return governance guardrails and stewardship roles.",
    recommendedActions: ["Summarize policy owners", "List guardrail status"],
  },
  {
    id: "delivery",
    title: "Delivery enablement",
    keywords: ["delivery", "project", "roadmap", "milestone", "deployment"],
    summary: "Outline delivery playbooks and portal entry points for project teams.",
    recommendedActions: ["Expose deployment checklist", "Link to delivery portal"],
  },
  {
    id: "insights",
    title: "Insights and reporting",
    keywords: ["insight", "report", "dashboard", "visibility", "trend"],
    summary: "Surface analytics dashboards, KPIs, and reporting actions.",
    recommendedActions: ["Launch reporting portal", "Push analytics digest"],
  },
];

function scoreIntent(input: string, intent: IntentConfig) {
  const normalized = input.toLowerCase();
  const matchedKeywords = intent.keywords.filter((keyword) => normalized.includes(keyword));
  const keywordScore = matchedKeywords.length / intent.keywords.length;
  const promptBoost = allPrompts.some((prompt) => {
    return (
      normalized.includes(prompt.slug.replace(/-/g, " ")) ||
      normalized.includes(prompt.title.toLowerCase()) ||
      normalized.includes(prompt.summary.toLowerCase())
    );
  })
    ? 0.1
    : 0;

  return keywordScore + promptBoost;
}

export function resolveIntent(input: string): IntentMatch {
  if (!input.trim()) {
    return {
      id: "assistant",
      title: "Assistant guidance",
      summary: "Invite the user to ask a question or pick a recommended workflow.",
      confidence: 0,
      recommendedActions: ["Prompt for next question"],
    };
  }

  const ranked = INTENT_CONFIG.map((config) => ({
    config,
    score: scoreIntent(input, config),
  }))
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];
  const fallback = INTENT_CONFIG[0];
  const winner = best && best.score > 0 ? best.config : fallback;
  const confidence = Math.min(1, Math.max(0, best?.score ?? 0));

  const promptMatch = allPrompts
    .slice()
    .sort((a, b) => a.order - b.order)
    .find((prompt) => {
      const normalized = input.toLowerCase();
      return (
        normalized.includes(prompt.slug.replace(/-/g, " ")) ||
        normalized.includes(prompt.title.toLowerCase()) ||
        normalized.includes(prompt.category.toLowerCase())
      );
    });

  return {
    id: winner.id,
    title: winner.title,
    summary: winner.summary,
    confidence,
    recommendedActions: winner.recommendedActions,
    promptSlug: promptMatch?.slug,
  };
}
