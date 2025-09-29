export type PortalStatus = "operational" | "degraded" | "maintenance";

export interface PortalDefinition {
  id: string;
  name: string;
  description: string;
  url: string;
  owner: string;
  latency: string;
  status: PortalStatus;
  capabilities: string[];
  embed?: boolean;
}

export const portals: PortalDefinition[] = [
  {
    id: "compliance-console",
    name: "Compliance Console",
    description: "Submit DPIAs, review audit trails, and download signed agreements.",
    url: "https://portal.tcslc.ai/compliance",
    owner: "Governance",
    latency: "~180ms",
    status: "operational",
    capabilities: ["DPIA automation", "Audit log export", "Data map editor"],
    embed: true,
  },
  {
    id: "client-billing",
    name: "Client Billing",
    description: "Secure invoicing and payment management for studio engagements.",
    url: "https://billing.tcslc.ai",
    owner: "Finance",
    latency: "~220ms",
    status: "degraded",
    capabilities: ["Invoice approvals", "Payment reconciliation", "Ledger export"],
  },
  {
    id: "partner-knowledge",
    name: "Partner Knowledge Base",
    description: "Centralized resources for partner onboarding, SLAs, and enablement.",
    url: "https://partners.tcslc.ai",
    owner: "Delivery",
    latency: "~140ms",
    status: "operational",
    capabilities: ["SLA templates", "Training videos", "Escalation workflows"],
  },
];
