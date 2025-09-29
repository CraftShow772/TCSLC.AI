export interface GovernanceControl {
  id: string;
  title: string;
  owner: string;
  status: "green" | "amber" | "red";
  notes: string;
}

export const GOVERNANCE_CONTROLS: GovernanceControl[] = [
  {
    id: "policy-review",
    title: "Annual policy review cadence",
    owner: "Governance",
    status: "green",
    notes: "All policies refreshed within the last 9 months.",
  },
  {
    id: "vendor-assurance",
    title: "Quarterly vendor assurance",
    owner: "Security",
    status: "amber",
    notes: "Two critical vendors awaiting 2024 attestations.",
  },
  {
    id: "incident-response",
    title: "Incident response tabletop",
    owner: "Operations",
    status: "green",
    notes: "Latest tabletop completed in May with updated escalation paths.",
  },
];

export function summarizeGovernanceStatus(controls: GovernanceControl[]) {
  const statusScore = controls.reduce((score, control) => {
    switch (control.status) {
      case "green":
        return score + 1;
      case "amber":
        return score + 0.5;
      case "red":
        return score;
      default:
        return score;
    }
  }, 0);

  const rating = statusScore / controls.length;
  if (rating >= 0.85) {
    return "Governance posture is strong with minor outstanding actions.";
  }
  if (rating >= 0.6) {
    return "Governance posture is steady—address amber controls soon.";
  }
  return "Governance posture requires immediate attention.";
}
