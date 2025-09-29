export type FieldHint = {
  title: string;
  description: string;
  examples?: string[];
  aiTips?: string[];
};

export const fieldHints = {
  ownerLegalName: {
    title: "Registered owner legal name",
    description:
      "Use the full legal name as it appears on the DMV record, including middle initials if listed.",
    examples: ["Jordan A. Rivera", "Taylor Chen"],
    aiTips: [
      "Cross-check the owner name with the signature line to ensure consistency.",
      "Flag any nicknames or abbreviations so the agent can confirm them manually.",
    ],
  },
  mailingAddress: {
    title: "Mailing address",
    description:
      "Capture the complete mailing address, including suite or apartment numbers.",
    examples: ["742 Market Street, Suite 320, San Francisco, CA 94102"],
    aiTips: [
      "Normalize street abbreviations (St., Rd., Ave.) to the DMV preferred format.",
      "If a PO Box appears, highlight it so a physical address can be requested if needed.",
    ],
  },
  registrationNumber: {
    title: "Registration number",
    description: "Unique identifier assigned to the vehicle registration record.",
    examples: ["REG-4928301", "A1537284"],
    aiTips: [
      "Strip out hyphens when passing data to backend systems unless they are mandatory.",
    ],
  },
  licensePlateNumber: {
    title: "License plate number",
    description: "Standard California license plate (usually 7 characters).",
    examples: ["8XYZ321", "7ABC456"],
    aiTips: [
      "Normalize the string to uppercase to avoid casing mismatches.",
      "Flag specialty plates by checking for non-alphanumeric characters.",
    ],
  },
  expirationDate: {
    title: "Expiration date",
    description: "Date the registration expires. Often located near the top of the notice.",
    examples: ["08/31/2024", "2025-01-15"],
    aiTips: [
      "Support both numeric and written month formats (e.g., 'Aug 31, 2024').",
      "Surface a reminder if the expiration date is within 30 days of today.",
    ],
  },
  insuranceProvider: {
    title: "Insurance provider",
    description:
      "The company that issued the vehicle's liability insurance policy.",
    examples: ["State Farm", "Mercury Insurance"],
    aiTips: [
      "Map common abbreviations (e.g., 'AAA') to the standard carrier name used in your CRM.",
    ],
  },
  insurancePolicyNumber: {
    title: "Policy number",
    description: "Unique identifier for the auto insurance policy.",
    examples: ["PCL-9081245", "CA-123-4567"],
    aiTips: [
      "Trim spaces and normalize dashes so downstream validations pass.",
      "Highlight when multiple policy numbers appear to reduce ambiguity.",
    ],
  },
  insuranceEffectiveDate: {
    title: "Policy effective date",
    description: "The start date of the active insurance policy term.",
    examples: ["02/15/2024"],
    aiTips: [
      "If the document lists effective and expiration dates, capture both for compliance.",
    ],
  },
  smogCertificateId: {
    title: "Smog certificate ID",
    description: "Barcode or control number associated with the smog check certificate.",
    examples: ["E-9382716"],
    aiTips: [
      "Ensure the certificate date is within the DMV acceptance window (typically 90 days).",
    ],
  },
  emissionsStation: {
    title: "Test station",
    description: "Name or number of the smog inspection station.",
    examples: ["Star Smog Center #4521"],
    aiTips: [
      "Capture the station number so agents can audit STAR vs. non-STAR locations.",
    ],
  },
  vin: {
    title: "Vehicle identification number (VIN)",
    description: "17-character VIN used to identify the vehicle.",
    examples: ["1HGCM82633A123456"],
    aiTips: [
      "Validate that the VIN is 17 characters and remove spaces or dashes.",
      "Highlight if the VIN decoded year mismatches the paperwork year.",
    ],
  },
  buyerName: {
    title: "Buyer name",
    description: "Primary buyer listed on the title or bill of sale.",
    examples: ["Morgan Patel"],
    aiTips: [
      "Support multiple buyers by splitting on 'and' or '&' when present.",
    ],
  },
  sellerName: {
    title: "Seller name",
    description: "Current owner who is transferring the vehicle.",
    examples: ["Jamie Lee"],
    aiTips: [
      "Highlight mismatches between the seller and the existing registered owner.",
    ],
  },
  saleDate: {
    title: "Sale date",
    description: "Date the transfer was executed.",
    examples: ["03/22/2024"],
    aiTips: [
      "Trigger a late transfer warning if the sale date is more than 10 days old.",
    ],
  },
  purchasePrice: {
    title: "Purchase price",
    description: "Total amount paid for the vehicle.",
    examples: ["$18,250", "$2,500"],
    aiTips: [
      "Strip currency symbols and commas before sending to tax calculations.",
    ],
  },
  odometerReading: {
    title: "Odometer reading",
    description: "Mileage recorded at the time of sale.",
    examples: ["67,154"],
    aiTips: [
      "Normalize to a numeric value and flag readings below the previous registration mileage.",
    ],
  },
  lienholder: {
    title: "Lienholder",
    description: "Financial institution holding a lien on the vehicle, if applicable.",
    examples: ["Ally Financial"],
    aiTips: [
      "Only mark lien release as satisfied when the document explicitly states it.",
    ],
  },
  titleNumber: {
    title: "Title number",
    description: "Official DMV title identifier, often top right on the pink slip.",
    examples: ["CA-02837461"],
    aiTips: [
      "Use the title number to cross-reference with prior DMV submissions for duplicates.",
    ],
  },
  businessLegalName: {
    title: "Business legal name",
    description: "The exact entity name registered with the Secretary of State.",
    examples: ["Harbor City Logistics LLC"],
    aiTips: [
      "Flag differences between legal name and DBA so filings include both when required.",
    ],
  },
  businessAddress: {
    title: "Business address",
    description: "Primary business address used on formation documents.",
    examples: ["1250 Harbor Blvd, Suite 200, Long Beach, CA 90802"],
    aiTips: [
      "If a virtual office is used, prompt the agent to confirm state acceptance.",
    ],
  },
  fein: {
    title: "Federal EIN",
    description: "Employer identification number assigned by the IRS.",
    examples: ["92-8741032"],
    aiTips: [
      "Mask the middle digits when sharing via chat to reduce exposure.",
    ],
  },
  dbaName: {
    title: "Doing business as (DBA)",
    description: "Trade name under which the company operates.",
    examples: ["Silver State Auto Brokers"],
    aiTips: [
      "Ensure the DBA spelling matches the county filing to avoid rejection.",
    ],
  },
  entityType: {
    title: "Entity type",
    description: "Classification of the business (LLC, Corporation, Partnership, etc.).",
    examples: ["California LLC", "S-Corporation"],
    aiTips: [
      "Map entity types to the internal workflow IDs for downstream automations.",
    ],
  },
  articlesReference: {
    title: "Formation document reference",
    description: "Document number or filing ID from the Articles of Organization/Incorporation.",
    examples: ["2024-LLC-00981"],
    aiTips: [
      "Double-check the filing year aligns with the application timeline.",
    ],
  },
  registeredAgent: {
    title: "Registered agent",
    description: "Name and address of the agent for service of process.",
    examples: ["Harbor Compliance, 1201 F St NW, Washington, DC 20004"],
    aiTips: [
      "Highlight when the agent is the same as the owner to confirm acceptance rules.",
    ],
  },
  contactEmail: {
    title: "Contact email",
    description: "Primary email for business correspondence.",
    examples: ["hello@harborcitylogistics.com"],
    aiTips: [
      "Validate format and flag consumer email domains if the client expects a branded address.",
    ],
  },
  contactPhone: {
    title: "Contact phone",
    description: "Main phone number for the business or vehicle owner.",
    examples: ["(562) 555-0193"],
    aiTips: [
      "Normalize to E.164 format before syncing to telephony systems.",
    ],
  },
  formationDate: {
    title: "Formation date",
    description: "Official date the business entity was created.",
    examples: ["04/05/2024"],
    aiTips: [
      "Surface compliance reminders if the formation date is less than 30 days old.",
    ],
  },
  operatingAgreement: {
    title: "Operating agreement reference",
    description:
      "Key clause identifiers or signature pages from the operating agreement or bylaws.",
    aiTips: [
      "Flag missing member signatures to ensure the agreement is fully executed.",
    ],
  },
} satisfies Record<string, FieldHint>;

export type FieldHintKey = keyof typeof fieldHints;

export function resolveFieldHints(keys: FieldHintKey[]) {
  return keys
    .map((key) => ({ key, hint: fieldHints[key] }))
    .filter((entry): entry is { key: FieldHintKey; hint: FieldHint } => Boolean(entry.hint));
}
