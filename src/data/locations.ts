export interface LocationProfile {
  id: string;
  name: string;
  region: string;
  timezone: string;
  address: string;
  capabilities: string[];
  contact: {
    email: string;
    phone: string;
  };
  availability: "open" | "limited" | "waitlist";
}

export const locations: LocationProfile[] = [
  {
    id: "nyc",
    name: "New York Studio",
    region: "North America",
    timezone: "America/New_York",
    address: "45 Madison Ave, New York, NY",
    capabilities: ["Enterprise activations", "Live production", "Compliance advisory"],
    contact: {
      email: "nyc@tcslc.ai",
      phone: "+1 (212) 555-9012",
    },
    availability: "open",
  },
  {
    id: "la",
    name: "Los Angeles Studio",
    region: "North America",
    timezone: "America/Los_Angeles",
    address: "101 Sunset Blvd, Los Angeles, CA",
    capabilities: ["AI content labs", "Partner enablement", "Creative direction"],
    contact: {
      email: "la@tcslc.ai",
      phone: "+1 (310) 555-2210",
    },
    availability: "limited",
  },
  {
    id: "ldn",
    name: "London Studio",
    region: "EMEA",
    timezone: "Europe/London",
    address: "200 Shoreditch High St, London",
    capabilities: ["Compliance workshops", "Studio streaming", "Product localization"],
    contact: {
      email: "london@tcslc.ai",
      phone: "+44 20 7946 0110",
    },
    availability: "open",
  },
];
