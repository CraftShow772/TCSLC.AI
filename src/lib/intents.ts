export type IntentKey = "payPropertyTax" | "renewVehicle" | "touristTax";

type IntentConfig = {
  id: IntentKey;
  label: string;
  description: string;
  href: string;
};

const flowsBasePath = "/flows";

export const intents: Record<IntentKey, IntentConfig> = {
  payPropertyTax: {
    id: "payPropertyTax",
    label: "Pay property tax",
    description: "Checklist before paying property taxes online",
    href: `${flowsBasePath}/pay-property-tax`
  },
  renewVehicle: {
    id: "renewVehicle",
    label: "Renew a vehicle registration",
    description: "Verify what you need for Florida registration renewals",
    href: `${flowsBasePath}/renew-vehicle`
  },
  touristTax: {
    id: "touristTax",
    label: "Pay tourist development tax",
    description: "Prepare filings for short-term rental remittance",
    href: `${flowsBasePath}/tourist-tax`
  }
};

export const DEFAULT_INTENT: IntentConfig = intents.payPropertyTax;

export function resolveIntentHref(value?: string | null): string {
  if (!value) return DEFAULT_INTENT.href;

  const normalized = value.trim().toLowerCase();
  const match = Object.values(intents).find((intent) => intent.id.toLowerCase() === normalized);

  if (match) return match.href;

  if (normalized.includes("vehicle")) return intents.renewVehicle.href;
  if (normalized.includes("tourist")) return intents.touristTax.href;

  return DEFAULT_INTENT.href;
}
