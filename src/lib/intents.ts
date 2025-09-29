export interface IntentAction {
  label: string;
  description: string;
  href: string;
}

export interface IntentDefinition {
  id: string;
  label: string;
  description: string;
  keywords: string[];
  actions: IntentAction[];
}

export const intents: IntentDefinition[] = [
  {
    id: "renewal",
    label: "Renew a License",
    description: "Guided help for renewing liquor licenses and permits.",
    keywords: ["renew", "renewal", "license", "permit"],
    actions: [
      {
        label: "Start renewal checklist",
        description: "Step-by-step requirements before you renew.",
        href: "/#renewal-checklist",
      },
      {
        label: "Review renewal documents",
        description: "Verify forms and supporting documents.",
        href: "/documents?focus=renewal",
      },
    ],
  },
  {
    id: "tax",
    label: "Report and Pay Taxes",
    description: "Link to Florida Department of Revenue portals with context.",
    keywords: ["tax", "payment", "report", "sales"],
    actions: [
      {
        label: "View tax calendar",
        description: "Stay current on reporting deadlines.",
        href: "/services?focus=tax",
      },
      {
        label: "Launch tax payment portal",
        description: "Confirm requirements before redirecting.",
        href: "/portals/myeasygov",
      },
    ],
  },
  {
    id: "title-transfer",
    label: "Transfer a Title",
    description: "Understand documentation for transferring ownership.",
    keywords: ["transfer", "title", "ownership", "buy", "sell"],
    actions: [
      {
        label: "Checklist for transfers",
        description: "Confirm forms and inspections.",
        href: "/#transfer-checklist",
      },
      {
        label: "Document helper",
        description: "Upload paperwork for extraction and validation.",
        href: "/documents?focus=transfer",
      },
    ],
  },
  {
    id: "new-business",
    label: "Launch a New Business",
    description: "File applications, zoning, and training requirements.",
    keywords: ["new", "business", "apply", "application", "start"],
    actions: [
      {
        label: "Smart startup checklist",
        description: "Plan licensing, fingerprinting, and inspections.",
        href: "/#new-business-checklist",
      },
      {
        label: "Required documents",
        description: "See what to prepare before applying.",
        href: "/documents?focus=new-business",
      },
    ],
  },
];

export interface IntentMatch {
  intent: IntentDefinition;
  score: number;
}

export function matchIntent(query: string): IntentMatch | null {
  const normalized = query.toLowerCase();
  let best: IntentMatch | null = null;
  for (const intent of intents) {
    const score = intent.keywords.reduce((total, keyword) => {
      if (normalized.includes(keyword)) {
        return total + 1;
      }
      return total;
    }, 0);
    if (score === 0) {
      continue;
    }
    if (!best || score > best.score) {
      best = { intent, score };
    }
  }
  return best;
}
