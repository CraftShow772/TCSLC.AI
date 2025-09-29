export type IntentName =
  | "renew_vehicle"
  | "pay_property_tax"
  | "local_business_tax"
  | "driver_license"
  | "title_transfer"
  | "hunting_fishing"
  | "tourist_tax"
  | "appointments"
  | "records_search";

export type IntentResult = {
  intent: IntentName | "unknown";
  slots: Record<string, string>;
  confidence: number; // 0..1
  targetPath?: string; // internal next route fallback
  external?: { url: string; label?: string }; // populated in Prompt 5
};

const synonyms: Record<IntentName, string[]> = {
  renew_vehicle: ["renew my tag", "tag renewal", "renew registration", "renew plate", "sticker"],
  pay_property_tax: ["pay property tax", "property tax payment", "real estate tax"],
  local_business_tax: ["business tax", "local business tax", "lbt"],
  driver_license: ["driver license", "license renewal", "dl renewal", "id card"],
  title_transfer: ["title transfer", "transfer title", "sell my car title"],
  hunting_fishing: ["hunting license", "fishing license", "sportsman"],
  tourist_tax: ["tourist tax", "bed tax", "short term rental tax"],
  appointments: ["appointment", "schedule appointment", "book appointment"],
  records_search: ["records search", "public records", "lien search"]
};

const defaults: Partial<Record<IntentName, string>> = {
  renew_vehicle: "/services",
  pay_property_tax: "/services",
  local_business_tax: "/services",
  driver_license: "/services",
  title_transfer: "/documents",
  hunting_fishing: "/services",
  tourist_tax: "/services",
  appointments: "/contact",
  records_search: "/documents"
};

export function classifyIntent(text: string): IntentResult {
  const q = text.toLowerCase().trim();
  let best: { name: IntentName; score: number } | null = null;

  for (const name of Object.keys(synonyms) as IntentName[]) {
    const terms = synonyms[name];
    let score = 0;
    for (const t of terms) {
      if (q.includes(t)) score = Math.max(score, 1.0);
    }
    // fallback keyword heuristics
    if (name === "renew_vehicle" && /(renew|tag|registration)/.test(q)) score = Math.max(score, 0.7);
    if (name === "pay_property_tax" && /(property).*(tax)|\btax\b.*property/.test(q)) score = Math.max(score, 0.7);
    if (name === "driver_license" && /(driver|license|dl|id)/.test(q)) score = Math.max(score, 0.6);
    if (name === "title_transfer" && /(title).*(transfer)/.test(q)) score = Math.max(score, 0.7);
    if (name === "appointments" && /(appointment|schedule|book)/.test(q)) score = Math.max(score, 0.6);

    if (!best || score > best.score) best = { name, score };
  }

  if (!best || best.score < 0.5) {
    return { intent: "unknown", slots: {}, confidence: best?.score ?? 0, targetPath: "/services" };
  }

  const targetPath = defaults[best.name] ?? "/services";
  return { intent: best.name, slots: {}, confidence: Number(best.score.toFixed(2)), targetPath };
}
