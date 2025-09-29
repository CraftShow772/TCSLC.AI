export interface DataAsset {
  name: string;
  systems: string[];
  retention: string;
  lawfulBasis: string;
}

export interface MitigationPlan {
  id: string;
  title: string;
  owner: string;
  status: "open" | "in-progress" | "closed";
}

export interface ComplianceSnapshot {
  score: number;
  riskRating: "low" | "moderate" | "high";
  dataAssets: DataAsset[];
  mitigations: MitigationPlan[];
  controlsInPlace: string[];
  updatedAt: string;
}

export const PRIVACY_CONTROLS: string[] = [
  "Role-based access for customer data",
  "Encryption in transit and at rest",
  "Documented data retention schedule",
  "Automated DPIA reminders",
  "Vendor risk monitoring",
];

export function buildPrivacySnapshot(): ComplianceSnapshot {
  return {
    score: 0.86,
    riskRating: "moderate",
    controlsInPlace: PRIVACY_CONTROLS,
    updatedAt: new Date().toISOString(),
    dataAssets: [
      {
        name: "Studio booking profiles",
        systems: ["Scheduling", "CRM"],
        retention: "18 months",
        lawfulBasis: "Contractual necessity",
      },
      {
        name: "Compliance attestations",
        systems: ["Compliance Console"],
        retention: "7 years",
        lawfulBasis: "Legal obligation",
      },
    ],
    mitigations: [
      {
        id: "dpia-video-archive",
        title: "Complete DPIA for studio video archives",
        owner: "Privacy Office",
        status: "in-progress",
      },
      {
        id: "retention-review",
        title: "Refresh retention policy for billing exports",
        owner: "Finance",
        status: "open",
      },
    ],
  };
}

export function generatePrivacyNarrative(snapshot: ComplianceSnapshot) {
  const openMitigations = snapshot.mitigations.filter((item) => item.status !== "closed");
  return `Current privacy score is ${(snapshot.score * 100).toFixed(
    0
  )}%, driven by ${snapshot.controlsInPlace.length} active controls. ${openMitigations.length} mitigation tasks remain before we can downgrade risk to low.`;
}

export function evaluateProcessingRisk(snapshot: ComplianceSnapshot, modifier = 0) {
  const base = snapshot.score - modifier;
  if (base >= 0.85) {
    return { rating: "low" as const, explanation: "Controls exceed current regulatory requirements." };
  }

  if (base >= 0.65) {
    return { rating: "moderate" as const, explanation: "Key mitigations outstanding—monitor DPIA backlog." };
  }

  return { rating: "high" as const, explanation: "Significant remediation needed. Escalate to governance." };
}
