export interface PortalDefinition {
  slug: string;
  name: string;
  description: string;
  requirements: string[];
  url: string;
  analyticsCategory: string;
}

export const portals: PortalDefinition[] = [
  {
    slug: "myeasygov",
    name: "MyEasyGov Tax Portal",
    description: "Pay taxes, renew licenses, and manage business accounts through the Department of Revenue.",
    requirements: [
      "Florida Business Partner number",
      "Recent filing confirmation number",
      "Payment method (ACH or credit card)",
    ],
    url: "https://myeasygov.fl.gov/",
    analyticsCategory: "portal_myeasygov",
  },
  {
    slug: "myfloridalicense",
    name: "MyFloridaLicense",
    description: "Update ownership details, print licenses, and upload supporting documents.",
    requirements: [
      "Primary license number",
      "Portal username and security questions",
      "Scanned supporting documents under 25 MB",
    ],
    url: "https://www.myfloridalicense.com/",
    analyticsCategory: "portal_myfloridalicense",
  },
];

export function getPortal(slug: string): PortalDefinition | undefined {
  return portals.find((portal) => portal.slug === slug);
}
