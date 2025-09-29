/**
 * Centralized external links. Keep all vendor URLs here so we can swap later.
 * In production, MEG_PAYMENT_BASE_URL must be provided in env.
 */
const MEG_PAYMENT_BASE = process.env.MEG_PAYMENT_BASE_URL || "";

type Portal = {
  label: string;
  url: string;
  vendor?: "MEG" | "Other";
};

export const portals = {
  payPropertyTax: {
    label: "Pay Property Tax",
    url: `${MEG_PAYMENT_BASE}/property-tax`.replace(/\/+$/, "/property-tax"),
    vendor: "MEG"
  } as Portal,
  renewVehicle: {
    label: "Renew Vehicle Registration",
    url: `${MEG_PAYMENT_BASE}/vehicle-renewal`.replace(/\/+$/, "/vehicle-renewal"),
    vendor: "MEG"
  } as Portal,
  touristTax: {
    label: "Pay Tourist Development Tax",
    url: `${MEG_PAYMENT_BASE}/tourist-tax`.replace(/\/+$/, "/tourist-tax"),
    vendor: "MEG"
  } as Portal
} satisfies Record<string, Portal>;

/**
 * Helper: return a safe URL. If env is missing during early dev, return "#"
 * so the app doesn't crash. Prompt 10 will enforce env validation.
 */
export function safeExternal(url: string): string {
  if (!url || url.includes("undefined")) return "#";
  return url;
}
