import type { ComplianceSnapshot } from "@/modules/compliance/privacy";

export type ChecklistStatus = "pending" | "in-progress" | "complete";

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  dependencies?: string[];
  autoComplete?: (context: ChecklistRuntimeContext) => boolean;
}

export interface ChecklistDefinition {
  id: string;
  title: string;
  description: string;
  items: ChecklistItem[];
}

export interface ChecklistRuntimeContext {
  compliance: ComplianceSnapshot;
  activeIntent?: string;
  analyticsReady: boolean;
}

export const checklists: ChecklistDefinition[] = [
  {
    id: "ai-launch",
    title: "AI launch readiness",
    description: "Steps to launch an AI workflow within the studio ecosystem.",
    items: [
      {
        id: "confirm-intent",
        title: "Confirm user intent",
        description: "Validate that the requested workflow matches a supported intent.",
      },
      {
        id: "analytics",
        title: "Enable analytics instrumentation",
        description: "Ensure analytics hooks are active and capturing consented events.",
        autoComplete: (context) => context.analyticsReady,
      },
      {
        id: "privacy",
        title: "Review privacy mitigations",
        description: "Confirm open mitigations have owners and due dates before launch.",
        dependencies: ["analytics"],
        autoComplete: (context) => context.compliance.mitigations.every((item) => item.status !== "open"),
      },
      {
        id: "portal",
        title: "Select portal integration",
        description: "Choose the correct portal and confirm embeddability requirements.",
        dependencies: ["confirm-intent"],
      },
    ],
  },
  {
    id: "compliance-refresh",
    title: "Compliance refresh",
    description: "Quarterly review of compliance controls and attestations.",
    items: [
      {
        id: "inventory",
        title: "Refresh data inventory",
        description: "Reconcile data assets with latest retention schedules.",
      },
      {
        id: "mitigations",
        title: "Close outstanding mitigations",
        description: "Ensure open mitigations are actively progressing.",
        autoComplete: (context) => context.compliance.mitigations.every((item) => item.status === "closed"),
      },
      {
        id: "stakeholders",
        title: "Notify stakeholders",
        description: "Share updated governance summary with location leads.",
      },
    ],
  },
];
